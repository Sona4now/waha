"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/components/site/LocaleProvider";
import { resolveIntroVo, type IntroVoId } from "@/lib/introAudio";

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
      if (cancelled || !url) return;

      const audio = new Audio(url);
      audio.volume = opts.volume ?? 0.85;
      audio.preload = "auto";
      audioRef.current = audio;

      // Autoplay can fail if the user hasn't interacted — we silently
      // ignore the rejection so the cinematic flow doesn't break.
      audio.play().catch(() => {});
    }, opts.delay ?? 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
    // We intentionally re-run on id/locale changes only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, locale]);
}
