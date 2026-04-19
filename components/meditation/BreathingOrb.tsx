"use client";

import { motion } from "framer-motion";
import type { BreathPhase } from "@/hooks/meditation/useBreathCycle";
import type { BreathTimings } from "@/lib/meditation/sessions";

interface Props {
  phase: BreathPhase;
  timings: BreathTimings;
  /** 0..1 session completion */
  progress: number;
  /** Optional Arabic narration line shown under the orb (guided/bodyscan). */
  narrationLine?: string;
  /** Disable scale animation for reduced-motion users. */
  reduceMotion?: boolean;
}

const PHASE_LABEL: Record<BreathPhase, string> = {
  in: "شهيق",
  hold1: "إمسك",
  out: "زفير",
  hold2: "إمسك",
};

export default function BreathingOrb({
  phase,
  timings,
  progress,
  narrationLine,
  reduceMotion,
}: Props) {
  // Target scale per phase: inhale grows, exhale shrinks, holds stay.
  const targetScale =
    phase === "in" ? 1.55 : phase === "hold1" ? 1.55 : phase === "out" ? 1 : 1;

  // Animation duration mirrors the actual phase duration in seconds.
  const phaseDuration =
    phase === "in"
      ? timings.inhale
      : phase === "hold1"
        ? 0.4
        : phase === "out"
          ? timings.exhale
          : 0.4;

  // SVG ring geometry
  const size = 320;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* ── Progress ring ── */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 m-auto -rotate-90 pointer-events-none"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(145,177,73,0.85)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>

      {/* ── Halo rings ── */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-56 h-56 rounded-full border border-white/10"
        aria-hidden="true"
      />
      <motion.div
        animate={{ scale: [1.1, 1.2, 1.1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full border border-white/5"
        aria-hidden="true"
      />

      {/* ── Main orb ── */}
      <motion.div
        animate={reduceMotion ? undefined : { scale: targetScale }}
        transition={{ duration: phaseDuration, ease: "easeInOut" }}
        className="relative w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.08)]"
      >
        <motion.div
          animate={reduceMotion ? undefined : { scale: targetScale * 0.6 + 0.4 }}
          transition={{ duration: phaseDuration, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
        >
          <span
            className="text-white text-lg font-bold font-display"
            aria-live="polite"
          >
            {PHASE_LABEL[phase]}
          </span>
        </motion.div>
      </motion.div>

      {/* ── Narration line ── */}
      {narrationLine && (
        <motion.p
          key={narrationLine}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-12 text-center text-white/70 text-sm sm:text-base font-display leading-relaxed max-w-md px-6"
          aria-live="polite"
        >
          {narrationLine}
        </motion.p>
      )}
    </div>
  );
}
