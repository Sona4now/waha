"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getSessionAudioTrack,
  getVoClipPath,
  CHIMES,
  type Session,
  type VoClip,
} from "@/lib/meditation/sessions";

interface Opts {
  session: Session;
  /** Master play/pause flag — when false all layers pause. */
  playing: boolean;
  /** Current elapsed seconds into the session. */
  elapsed: number;
  /** Whether intro countdown is still running (don't play audio yet). */
  intro: boolean;
  /** User mute toggle for voice. */
  voiceEnabled: boolean;
  /** Volumes 0-100. */
  volumeAmbient: number;
  volumeChimes: number;
  volumeVoice: number;
  /** Fallback TTS speaker — used if the MP3 for a clip 404s or fails. */
  fallbackSpeak?: (text: string) => void;
}

interface Return {
  currentClipIdx: number;
  voActive: boolean;
  audioMissing: boolean;
  playStart: () => void;
  playEnd: () => void;
  skipToNextClip: () => void;
}

/**
 * Three-layer audio engine for a meditation session.
 *
 *   1. Ambient music — loops continuously, ducks to 40% while VO plays.
 *   2. VO clips      — scheduled against `elapsed`; play at clip.at seconds.
 *   3. Chimes        — one-shot bells for start/end transitions.
 *
 * - Each layer is its own HTMLAudioElement (reused across clips).
 * - If a VO clip 404s, the optional `fallbackSpeak` (Web Speech) kicks in.
 * - Respects `playing` / `voiceEnabled` — all layers coordinate.
 */
export function useSessionAudio({
  session,
  playing,
  elapsed,
  intro,
  voiceEnabled,
  volumeAmbient,
  volumeChimes,
  volumeVoice,
  fallbackSpeak,
}: Opts): Return {
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const voRef = useRef<HTMLAudioElement | null>(null);
  const startChimeRef = useRef<HTMLAudioElement | null>(null);
  const endChimeRef = useRef<HTMLAudioElement | null>(null);

  const [currentClipIdx, setCurrentClipIdx] = useState(-1);
  const [voActive, setVoActive] = useState(false);
  const [audioMissing, setAudioMissing] = useState(false);
  const playedClipsRef = useRef<Set<string>>(new Set());

  const ambientUrl = useMemo(() => getSessionAudioTrack(session), [session]);

  // ─── Initialize audio elements once per session ──────────
  useEffect(() => {
    const ambient = new Audio();
    ambient.src = ambientUrl;
    ambient.loop = true;
    ambient.preload = "auto";
    ambient.volume = 0;
    ambient.addEventListener("error", () => setAudioMissing(true));
    ambientRef.current = ambient;

    const vo = new Audio();
    vo.preload = "auto";
    vo.volume = 0;
    voRef.current = vo;

    const startChime = new Audio();
    startChime.src = CHIMES.start;
    startChime.preload = "auto";
    startChimeRef.current = startChime;

    const endChime = new Audio();
    endChime.src = CHIMES.end;
    endChime.preload = "auto";
    endChimeRef.current = endChime;

    // Pre-warm the first few VO clips so onset is instant
    session.voClips.slice(0, 2).forEach((c) => {
      const preload = new Audio();
      preload.src = getVoClipPath(c.id);
      preload.preload = "auto";
    });

    // Reset per-session state
    playedClipsRef.current = new Set();
    setCurrentClipIdx(-1);
    setVoActive(false);

    return () => {
      [ambient, vo, startChime, endChime].forEach((a) => {
        try {
          a.pause();
          a.src = "";
        } catch {
          /* ignore */
        }
      });
    };
  }, [ambientUrl, session.voClips]);

  // ─── Play/pause ambient based on master toggle ───────────
  useEffect(() => {
    const ambient = ambientRef.current;
    if (!ambient) return;
    if (intro || !playing) {
      ambient.pause();
      return;
    }
    // iOS requires a user gesture; play() may reject silently — that's fine.
    ambient.play().catch(() => {
      /* browser blocked autoplay */
    });
  }, [playing, intro]);

  // ─── Ambient volume with ducking while VO plays ──────────
  useEffect(() => {
    const ambient = ambientRef.current;
    if (!ambient) return;
    const base = Math.max(0, Math.min(1, volumeAmbient / 100));
    ambient.volume = voActive ? base * 0.4 : base;
  }, [volumeAmbient, voActive]);

  // ─── VO volume ───────────────────────────────────────────
  useEffect(() => {
    const vo = voRef.current;
    if (!vo) return;
    vo.volume = voiceEnabled ? Math.max(0, Math.min(1, volumeVoice / 100)) : 0;
  }, [volumeVoice, voiceEnabled]);

  // ─── Chime volumes ───────────────────────────────────────
  useEffect(() => {
    const v = Math.max(0, Math.min(1, volumeChimes / 100));
    if (startChimeRef.current) startChimeRef.current.volume = v;
    if (endChimeRef.current) endChimeRef.current.volume = v;
  }, [volumeChimes]);

  // ─── Pause/resume VO when master play toggles ────────────
  useEffect(() => {
    const vo = voRef.current;
    if (!vo || !voActive) return;
    if (!playing) {
      vo.pause();
    } else {
      vo.play().catch(() => {});
    }
  }, [playing, voActive]);

  const playClip = useCallback(
    (clip: VoClip) => {
      const vo = voRef.current;
      if (!vo) return;

      const url = getVoClipPath(clip.id);
      vo.src = url;

      const onEnd = () => {
        setVoActive(false);
        vo.removeEventListener("ended", onEnd);
        vo.removeEventListener("error", onError);
      };
      const onError = () => {
        setVoActive(false);
        setAudioMissing(true);
        if (fallbackSpeak) fallbackSpeak(clip.text);
        vo.removeEventListener("ended", onEnd);
        vo.removeEventListener("error", onError);
      };

      vo.addEventListener("ended", onEnd);
      vo.addEventListener("error", onError);

      setVoActive(true);
      vo.play().catch(onError);
    },
    [fallbackSpeak],
  );

  // ─── VO clip scheduler — triggers next clip at `elapsed` ──
  useEffect(() => {
    if (intro || !playing) return;
    const vo = voRef.current;
    if (!vo) return;

    const due = session.voClips.findIndex(
      (c) => c.at <= elapsed && !playedClipsRef.current.has(c.id),
    );
    if (due < 0) return;

    const clip = session.voClips[due];
    playedClipsRef.current.add(clip.id);
    setCurrentClipIdx(due);

    if (!voiceEnabled) {
      // Keep caption index in sync even when muted.
      return;
    }

    playClip(clip);
  }, [elapsed, intro, playing, voiceEnabled, session.voClips, playClip]);

  const skipToNextClip = useCallback(() => {
    if (intro) return;
    const vo = voRef.current;
    if (vo) vo.pause();
    const next = currentClipIdx + 1;
    if (next >= session.voClips.length) {
      setVoActive(false);
      return;
    }
    const clip = session.voClips[next];
    playedClipsRef.current.add(clip.id);
    setCurrentClipIdx(next);
    if (voiceEnabled) playClip(clip);
  }, [intro, currentClipIdx, session.voClips, voiceEnabled, playClip]);

  const playStart = useCallback(() => {
    const chime = startChimeRef.current;
    if (!chime) return;
    chime.currentTime = 0;
    chime.play().catch(() => {});
  }, []);

  const playEnd = useCallback(() => {
    const chime = endChimeRef.current;
    if (!chime) return;
    chime.currentTime = 0;
    chime.play().catch(() => {});
  }, []);

  return {
    currentClipIdx,
    voActive,
    audioMissing,
    playStart,
    playEnd,
    skipToNextClip,
  };
}
