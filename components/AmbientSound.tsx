"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/components/site/LocaleProvider";
import { resolveIntroAmbient, type IntroAmbient } from "@/lib/introAudio";

interface Props {
  track?: IntroAmbient;
  volume?: number;
}

export default function AmbientSound({
  track = "nature",
  volume = 0.15,
}: Props) {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Resolve the actual URL for the requested track. Prefers a local file
  // under /public/intro/ambient/intro__<track>.mp3 when available, falls
  // back to the CDN preview otherwise. The probe happens once per track
  // per session — see isIntroAudioAvailable() in lib/introAudio.ts.
  useEffect(() => {
    let cancelled = false;
    resolveIntroAmbient(track).then((src) => {
      if (!cancelled) setResolvedSrc(src);
    });
    return () => {
      cancelled = true;
    };
  }, [track]);

  // Wire up the <Audio> element once we have a URL.
  useEffect(() => {
    if (!resolvedSrc) return;
    const audio = new Audio(resolvedSrc);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setReady(true), {
      once: true,
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [resolvedSrc, volume]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      audio.play().catch(() => {});
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  }, [muted]);

  // When the track prop changes mid-session, swap in the new src without
  // tearing down the audio element so playback stays continuous.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !resolvedSrc) return;
    if (audio.src !== resolvedSrc) {
      const wasPlaying = !audio.paused;
      audio.src = resolvedSrc;
      audio.load();
      if (wasPlaying) audio.play().catch(() => {});
    }
  }, [resolvedSrc]);

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1 }}
      onClick={toggle}
      className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/[0.15] transition-all duration-300 group"
      title={
        muted
          ? isEn
            ? "Play sound"
            : "تشغيل الصوت"
          : isEn
            ? "Mute sound"
            : "كتم الصوت"
      }
    >
      <AnimatePresence mode="wait">
        {muted ? (
          <motion.svg
            key="muted"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </motion.svg>
        ) : (
          <motion.svg
            key="unmuted"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(145,177,73,0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Pulse ring when playing */}
      {!muted && (
        <motion.div
          className="absolute inset-0 rounded-full border border-[#91b149]/30"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
