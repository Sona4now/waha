"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Session, VoClip } from "@/lib/meditation/sessions";
import {
  startAmbient,
  type AmbientController,
} from "@/lib/meditation/proceduralAmbient";
import {
  playStartChime,
  playEndChime,
} from "@/lib/meditation/chimes";

interface Opts {
  session: Session;
  /** Active locale — determines which translation of VO text is spoken. */
  locale: "ar" | "en";
  /** Master play/pause flag — when false all layers pause. */
  playing: boolean;
  /** Current elapsed seconds into the session. */
  elapsed: number;
  /** Whether intro countdown is still running (don't start audio yet). */
  intro: boolean;
  /** User mute toggle for voice. */
  voiceEnabled: boolean;
  /** Volumes 0-100. */
  volumeAmbient: number;
  volumeChimes: number;
  volumeVoice: number;
  /** Speaks the current VO line. Supplied by SessionPlayer using the
   *  Web Speech narrator hook. */
  speak: (text: string) => void;
  stopSpeech: () => void;
}

interface Return {
  currentClipIdx: number;
  playStart: () => void;
  playEnd: () => void;
  /** Cancels the current VO clip and immediately triggers the next one. */
  skipClip: () => void;
}

/**
 * Fully-procedural 3-layer audio engine. Zero network, zero assets.
 *
 *   1. Ambient  — Web Audio synthesized per env (see `proceduralAmbient.ts`).
 *                 Loops forever while the session is playing; auto-ducks
 *                 while VO is speaking.
 *   2. VO clips — Scheduled against `elapsed`; spoken via Web Speech API
 *                 (passed in via `speak`). Captions come from clip.text.
 *   3. Chimes   — Sine-wave bells synthesized on demand (`chimes.ts`).
 *
 * No files are loaded. The app works offline from the first minute.
 */
export function useSessionAudio({
  session,
  locale,
  playing,
  elapsed,
  intro,
  voiceEnabled,
  volumeAmbient,
  volumeChimes,
  volumeVoice,
  speak,
  stopSpeech,
}: Opts): Return {
  const ambientRef = useRef<AmbientController | null>(null);
  const [currentClipIdx, setCurrentClipIdx] = useState(-1);
  const playedClipsRef = useRef<Set<string>>(new Set());
  const voActiveRef = useRef(false);

  // ─── Start / stop ambient based on playing state ──────────
  useEffect(() => {
    // Tear down when we enter a paused state or the intro countdown.
    if (intro || !playing) {
      ambientRef.current?.stop();
      ambientRef.current = null;
      return;
    }
    // Start if not running. Volume applied at construction.
    if (!ambientRef.current) {
      ambientRef.current = startAmbient(session.env, volumeAmbient / 100);
    }
    return () => {
      // Cleanup on unmount of the whole hook
      ambientRef.current?.stop();
      ambientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, intro, session.env]);

  // ─── Update ambient volume (also handles VO-ducking) ───────
  useEffect(() => {
    if (!ambientRef.current) return;
    const base = Math.max(0, Math.min(1, volumeAmbient / 100));
    ambientRef.current.setVolume(voActiveRef.current ? base * 0.4 : base);
  }, [volumeAmbient]);

  // ─── Reset per-session state when the session changes ──────
  useEffect(() => {
    playedClipsRef.current = new Set();
    setCurrentClipIdx(-1);
    voActiveRef.current = false;
  }, [session.id]);

  // ─── VO scheduler — fires matching clip at `elapsed` ───────
  useEffect(() => {
    if (intro || !playing) return;

    const due = session.voClips.findIndex(
      (c) => c.at <= elapsed && !playedClipsRef.current.has(c.id),
    );
    if (due < 0) return;

    const clip: VoClip = session.voClips[due];
    playedClipsRef.current.add(clip.id);
    setCurrentClipIdx(due);

    if (!voiceEnabled) return; // caption-only mode

    // Duck ambient, speak, restore when done
    if (ambientRef.current) {
      const base = volumeAmbient / 100;
      ambientRef.current.setVolume(base * 0.4);
    }
    voActiveRef.current = true;

    const clipText = clip.text[locale];
    speak(clipText);

    // Estimate speech duration from text length (~120 wpm ~= 2 words/sec ~=
    // 10 chars/sec). Restore ambient + unset voActive after.
    const estMs = Math.max(3000, (clipText.length / 10) * 1000);
    const restoreTimer = setTimeout(() => {
      voActiveRef.current = false;
      if (ambientRef.current) {
        const base = volumeAmbient / 100;
        ambientRef.current.setVolume(base);
      }
    }, estMs);
    return () => clearTimeout(restoreTimer);
  }, [elapsed, intro, playing, voiceEnabled, locale, session.voClips, speak, volumeAmbient]);

  // ─── Stop speech when pause/disable toggles ────────────────
  useEffect(() => {
    if (!playing || !voiceEnabled) {
      stopSpeech();
      voActiveRef.current = false;
    }
  }, [playing, voiceEnabled, stopSpeech]);

  const playStart = useCallback(() => {
    playStartChime(volumeChimes / 100);
  }, [volumeChimes]);

  const playEnd = useCallback(() => {
    playEndChime(volumeChimes / 100);
  }, [volumeChimes]);

  /**
   * Skip to the next unplayed clip. Cancels whatever TTS is speaking now
   * and jumps to the next line in the session script. If everything has
   * already played we just cancel and stay silent until the session ends.
   */
  const skipClip = useCallback(() => {
    stopSpeech();
    // Find the first clip that hasn't been played yet, regardless of `at`.
    const nextIdx = session.voClips.findIndex(
      (c) => !playedClipsRef.current.has(c.id),
    );
    if (nextIdx < 0) {
      voActiveRef.current = false;
      return;
    }
    const clip = session.voClips[nextIdx];
    playedClipsRef.current.add(clip.id);
    setCurrentClipIdx(nextIdx);
    if (!voiceEnabled) return;
    if (ambientRef.current) {
      const base = volumeAmbient / 100;
      ambientRef.current.setVolume(base * 0.4);
    }
    voActiveRef.current = true;
    speak(clip.text[locale]);
  }, [session.voClips, locale, voiceEnabled, speak, stopSpeech, volumeAmbient]);

  return { currentClipIdx, playStart, playEnd, skipClip };
}
