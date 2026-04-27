"use client";

import { motion } from "framer-motion";
import type { BreathPhase } from "@/hooks/meditation/useBreathCycle";
import type { BreathTimings } from "@/lib/meditation/sessions";
import type { EnvId } from "@/lib/meditation/environments";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  phase: BreathPhase;
  timings: BreathTimings;
  /** 0..1 session completion */
  progress: number;
  /** Optional Arabic narration line shown under the orb (guided/bodyscan). */
  narrationLine?: string;
  /** Disable scale animation for reduced-motion users. */
  reduceMotion?: boolean;
  /** Environment id — drives the orb's color palette. */
  env?: EnvId;
  /** Seconds remaining — shown subtly below the phase label. */
  remainingSec?: number;
}

const PHASE_LABEL_AR: Record<BreathPhase, string> = {
  in: "شهيق",
  hold1: "إمسك",
  out: "زفير",
  hold2: "إمسك",
};

const PHASE_LABEL_EN: Record<BreathPhase, string> = {
  in: "Inhale",
  hold1: "Hold",
  out: "Exhale",
  hold2: "Hold",
};

/**
 * Per-environment color palette. Each env has:
 *  - `inner`: main orb background (translucent)
 *  - `outer`: outer glow ring (even more translucent)
 *  - `glow`:  shadow bloom color
 *  - `ring`:  progress ring stroke
 *
 * These tie the orb visually to the audio — sea orbs feel cool and blue,
 * desert orbs feel warm/golden, etc.
 */
const ORB_PALETTE: Record<
  EnvId,
  { inner: string; outer: string; glow: string; ring: string }
> = {
  sea: {
    inner: "rgba(56,189,248,0.20)",
    outer: "rgba(56,189,248,0.08)",
    glow: "rgba(56,189,248,0.35)",
    ring: "rgba(56,189,248,0.85)",
  },
  desert: {
    inner: "rgba(251,191,36,0.20)",
    outer: "rgba(251,191,36,0.08)",
    glow: "rgba(251,191,36,0.30)",
    ring: "rgba(251,191,36,0.85)",
  },
  mountain: {
    inner: "rgba(168,162,158,0.20)",
    outer: "rgba(168,162,158,0.08)",
    glow: "rgba(226,214,198,0.25)",
    ring: "rgba(226,214,198,0.85)",
  },
  oasis: {
    inner: "rgba(52,211,153,0.20)",
    outer: "rgba(52,211,153,0.08)",
    glow: "rgba(52,211,153,0.30)",
    ring: "rgba(145,177,73,0.85)",
  },
};

/** Fallback matches the previous white/accent look — used if env is missing. */
const DEFAULT_PALETTE = {
  inner: "rgba(255,255,255,0.10)",
  outer: "rgba(255,255,255,0.06)",
  glow: "rgba(255,255,255,0.20)",
  ring: "rgba(145,177,73,0.85)",
};

function formatRemaining(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function BreathingOrb({
  phase,
  timings,
  progress,
  narrationLine,
  reduceMotion,
  env,
  remainingSec,
}: Props) {
  const { locale } = useTranslations();
  const PHASE_LABEL = locale === "en" ? PHASE_LABEL_EN : PHASE_LABEL_AR;
  const palette = env ? ORB_PALETTE[env] : DEFAULT_PALETTE;

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

  // SVG ring geometry. Stroke bumped from 4→6 + track opacity 6→12% so the
  // ring actually reads against dark + bright env backdrops both.
  const size = 320;
  const stroke = 6;
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
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.ring}
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
        className="absolute w-56 h-56 rounded-full border"
        style={{ borderColor: palette.outer }}
        aria-hidden="true"
      />
      <motion.div
        animate={{ scale: [1.1, 1.2, 1.1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full border"
        style={{ borderColor: palette.outer }}
        aria-hidden="true"
      />

      {/* ── Main orb ── */}
      <motion.div
        animate={reduceMotion ? undefined : { scale: targetScale }}
        transition={{ duration: phaseDuration, ease: "easeInOut" }}
        className="relative w-40 h-40 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center"
        style={{
          background: palette.inner,
          boxShadow: `0 0 60px ${palette.glow}`,
        }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { scale: targetScale * 0.6 + 0.4 }}
          transition={{ duration: phaseDuration, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full border border-white/20 flex flex-col items-center justify-center"
          style={{ background: palette.inner }}
        >
          <span
            className="text-white text-lg font-bold font-display leading-none"
            aria-live="polite"
          >
            {PHASE_LABEL[phase]}
          </span>
          {typeof remainingSec === "number" && remainingSec > 0 && (
            <span
              className="text-white/55 text-[10px] font-mono mt-1 tabular-nums"
              aria-label={locale === "en" ? "Time remaining" : "الوقت المتبقي"}
            >
              {formatRemaining(remainingSec)}
            </span>
          )}
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
