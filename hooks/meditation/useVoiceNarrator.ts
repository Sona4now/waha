"use client";

import { useCallback, useEffect, useRef } from "react";

interface Opts {
  /** Whether speech is allowed (user toggle + browser support). */
  enabled: boolean;
  /** Arabic-Egyptian rate feels better around 0.85. */
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * Lightweight wrapper over the Web Speech API for Arabic narration.
 * Queues utterances and cancels on unmount.
 */
export function useVoiceNarrator({
  enabled,
  rate = 0.85,
  pitch = 1,
  volume = 1,
}: Opts) {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Try to pick an Arabic voice if the browser exposes one.
  useEffect(() => {
    if (!supported) return;

    function pick() {
      const voices = window.speechSynthesis.getVoices();
      const arabic =
        voices.find((v) => /ar[-_]EG/i.test(v.lang)) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("ar")) ||
        null;
      voiceRef.current = arabic;
    }
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !enabled || !text) return;
      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "ar-EG";
        utter.rate = rate;
        utter.pitch = pitch;
        utter.volume = volume;
        if (voiceRef.current) utter.voice = voiceRef.current;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch {
        /* API not available — silent fail */
      }
    },
    [supported, enabled, rate, pitch, volume],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
  }, [supported]);

  // Stop any in-flight speech when the component using the hook unmounts.
  useEffect(() => stop, [stop]);

  return { supported, speak, stop };
}
