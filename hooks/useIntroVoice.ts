"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/components/site/LocaleProvider";
import { resolveIntroVo, INTRO_VO_TEXT, type IntroVoId } from "@/lib/introAudio";

/**
 * Plays an intro VO clip when `playKey` flips to a non-null value.
 *
 * Drop this into any cinematic-intro screen and call it with the clip
 * id you want to narrate. The hook resolves the locale, finds the file
 * under /public/intro/vo/{ar,en}/<id>.mp3, and plays it once.
 *
 * Silent fallback when the file isn't there yet — the screen still
 * works, the user just doesn't hear narration. No errors.
 *
 * @example
 *   useIntroVoice("hook-1", { delay: 400, volume: 0.85 });
 */
export function useIntroVoice(
  id: IntroVoId | null,
  opts: { delay?: number; volume?: number } = {},
) {
  const { locale } = useTranslations();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const url = await resolveIntroVo(id, locale);
      if (cancelled) return;

      if (url) {
        // Real MP3 exists — play it.
        const audio = new Audio(url);
        audio.volume = opts.volume ?? 0.85;
        audio.preload = "auto";
        audioRef.current = audio;
        audio.play().catch(() => {});
      } else if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        // Fall back to Web Speech using the registered text for this clip.
        const text = INTRO_VO_TEXT[id]?.[locale];
        if (!text) return;
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = locale === "ar" ? "ar-EG" : "en-US";
          u.rate = 0.82;
          u.pitch = 0.95;
          u.volume = opts.volume ?? 0.85;
          // Pick the best available voice for the locale.
          const voices = window.speechSynthesis.getVoices();
          if (locale === "ar") {
            u.voice =
              voices.find((v) => /maged|laila|tarik|majed/i.test(v.name)) ||
              voices.find((v) => /ar[-_]eg/i.test(v.lang)) ||
              voices.find((v) => v.lang?.toLowerCase().startsWith("ar")) ||
              null;
          } else {
            u.voice =
              voices.find((v) => /en[-_]us/i.test(v.lang)) ||
              voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
              null;
          }
          window.speechSynthesis.speak(u);
        } catch {
          /* browser TTS unavailable — stay silent */
        }
      }
    }, opts.delay ?? 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      // Also stop any in-flight Web Speech utterance.
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
    };
    // We intentionally re-run on id/locale changes only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, locale]);
}
