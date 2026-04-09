"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SOUNDS: Record<string, string> = {
  waves:
    "https://cdn.freesound.org/previews/467/467539_5765668-lq.mp3",
  wind:
    "https://cdn.freesound.org/previews/530/530679_8079834-lq.mp3",
  nature:
    "https://cdn.freesound.org/previews/462/462807_7799498-lq.mp3",
};

interface Props {
  track?: keyof typeof SOUNDS;
  volume?: number;
}

export default function AmbientSound({
  track = "nature",
  volume = 0.15,
}: Props) {
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(SOUNDS[track]);
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
  }, [track, volume]);

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

  // Update track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const src = SOUNDS[track];
    if (audio.src !== src) {
      const wasPlaying = !audio.paused;
      audio.src = src;
      audio.load();
      if (wasPlaying) audio.play().catch(() => {});
    }
  }, [track]);

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1 }}
      onClick={toggle}
      className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/[0.15] transition-all duration-300 group"
      title={muted ? "تشغيل الصوت" : "كتم الصوت"}
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
