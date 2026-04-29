"use client";

import { useCallback, useEffect, useRef } from "react";

interface Opts {
  /** Whether speech is allowed (user toggle + browser support). */
  enabled: boolean;
  /** Active locale — determines voice selection and utterance language. */
  locale?: "ar" | "en";
  /**
   * Speech rate. Slower than normal for meditation — 0.75 is calm but still
   * understandable. 0.6 starts to feel sedated. Don't go above 0.9.
   */
  rate?: number;
  /** 0..2 — lower feels warmer. 0.95 is a gentle default. */
  pitch?: number;
  volume?: number;
}

/**
 * Arabic-tuned wrapper over the Web Speech API.
 *
 * Why this isn't just `speechSynthesis.speak()`:
 *  - Browser voice quality varies dramatically for Arabic (iOS has good
 *    Maged/Tarik, Chrome Linux has almost nothing). We rank-select the best
 *    available voice.
 *  - iOS Safari needs a user gesture before the first utterance — we expose
 *    `unlock()` the UI can call from a tap handler.
 *  - Punctuation creates natural pauses. We add commas to long sentences that
 *    don't have any, so the TTS doesn't race through them.
 *  - Some Android browsers drop utterances longer than ~180 chars silently.
 *    We split on sentence boundaries and queue them.
 */
export function useVoiceNarrator({
  enabled,
  locale = "ar",
  rate = 0.75,
  pitch = 0.95,
  volume = 1,
}: Opts) {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const queueRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Rank + pick the best voice for the active locale.
  useEffect(() => {
    if (!supported) return;

    function pick() {
      const voices = window.speechSynthesis.getVoices();
      if (locale === "ar") {
        // Priority: named quality Arabic voices → ar-EG → any ar-* → name hint
        const named = voices.find((v) =>
          /maged|laila|tarik|majed|noha|hedda/i.test(v.name),
        );
        const arEG = voices.find((v) => /ar[-_]eg/i.test(v.lang));
        const arAny = voices.find((v) => v.lang?.toLowerCase().startsWith("ar"));
        const nameHint = voices.find((v) => /arab/i.test(v.name));
        voiceRef.current = named || arEG || arAny || nameHint || null;
      } else {
        // Priority: en-US → en-GB → any en-*
        const enUS = voices.find((v) => /en[-_]us/i.test(v.lang));
        const enGB = voices.find((v) => /en[-_]gb/i.test(v.lang));
        const enAny = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
        voiceRef.current = enUS || enGB || enAny || null;
      }
    }
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported, locale]);

  /**
   * Split a long line into digestible chunks on sentence boundaries.
   * Arabic uses the same punctuation as Latin, plus the Arabic comma ،
   * and Arabic full stop (same . usually).
   */
  const splitIntoChunks = useCallback((text: string): string[] => {
    const parts = text
      .split(/(?<=[.؟!])\s+|(?<=،)\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    // If no sentence boundaries were found, we still want to break on length.
    const out: string[] = [];
    for (const p of parts) {
      if (p.length > 160) {
        // Hard-split very long sentences at word boundaries around 120 chars.
        const words = p.split(/\s+/);
        let cur = "";
        for (const w of words) {
          if ((cur + " " + w).trim().length > 120) {
            out.push(cur.trim());
            cur = w;
          } else {
            cur = (cur + " " + w).trim();
          }
        }
        if (cur) out.push(cur);
      } else {
        out.push(p);
      }
    }
    return out;
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !enabled || !text) return;
      try {
        // Cancel any in-flight queue so overlapping clips don't stack.
        window.speechSynthesis.cancel();
        queueRef.current = [];

        const chunks = splitIntoChunks(text);
        chunks.forEach((chunk, i) => {
          const u = new SpeechSynthesisUtterance(chunk);
          u.lang = locale === "ar" ? "ar-EG" : "en-US";
          u.rate = rate;
          u.pitch = pitch;
          u.volume = volume;
          if (voiceRef.current) u.voice = voiceRef.current;
          // 200ms pause between chunks so it doesn't race
          if (i > 0) {
            // Some browsers respect leading spaces as micro-pause
            u.text = "  " + u.text;
          }
          queueRef.current.push(u);
          window.speechSynthesis.speak(u);
        });
      } catch {
        /* API flaked — silent */
      }
    },
    [supported, enabled, locale, rate, pitch, volume, splitIntoChunks],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
      queueRef.current = [];
    } catch {
      /* noop */
    }
  }, [supported]);

  /**
   * Must be called from a user gesture handler on iOS / mobile Chrome —
   * otherwise the first utterance is silently dropped. Speaks a silent space
   * to "warm up" the synthesizer.
   */
  const unlock = useCallback(() => {
    if (!supported) return;
    try {
      const warm = new SpeechSynthesisUtterance(" ");
      warm.volume = 0;
      warm.rate = 3; // finish instantly
      window.speechSynthesis.speak(warm);
    } catch {
      /* ignore */
    }
  }, [supported]);

  // Stop on unmount.
  useEffect(() => stop, [stop]);

  return { supported, speak, stop, unlock };
}
