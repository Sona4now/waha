"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Session } from "@/lib/meditation/sessions";
import type { Journey, JourneyProgress } from "@/lib/meditation/journeys";
import type { Stats } from "@/hooks/meditation/useSessionHistory";
import { getEnvironment } from "@/lib/meditation/environments";
import JourneyCard from "./JourneyCard";

interface Props {
  suggestedSession: Session;
  journeys: Journey[];
  journeyProgress: JourneyProgress;
  stats: Stats;
  meditatedToday: boolean;
  onStart: () => void;
  onOpenJourney: (j: Journey) => void;
  onOpenLibrary: () => void;
}

/**
 * The first screen the user sees when they tap "غرفة التأمل".
 *
 * Design principle: minimal friction. The whole top half is a giant
 * "tap to start" affordance — start breathing within one tap.
 * The rest (stats + journeys + library) lives below the fold for
 * those who want it, but isn't in the way.
 */
export default function ImmersiveEntry({
  suggestedSession,
  journeys,
  journeyProgress,
  stats,
  meditatedToday,
  onStart,
  onOpenJourney,
  onOpenLibrary,
}: Props) {
  const env = getEnvironment(suggestedSession.env);
  const [orbBreath, setOrbBreath] = useState<"in" | "out">("in");

  // Welcome orb breathes gently — a visual invitation
  useEffect(() => {
    const t = setInterval(() => {
      setOrbBreath((b) => (b === "in" ? "out" : "in"));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Time-aware greeting (morning / afternoon / evening)
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return "ليلة طيبة";
    if (h < 12) return "صباح الخير";
    if (h < 17) return "نهارك سعيد";
    if (h < 21) return "مساء الخير";
    return "ليلة طيبة";
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen bg-[#070d15] overflow-hidden"
      dir="rtl"
    >
      {/* ── Hero: full-viewport immersive zone (uses dvh for mobile) ── */}
      <section
        className="relative flex items-center justify-center w-full min-h-screen [min-height:100dvh]"
      >
        {/* Ambient gradient backdrop */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${env.gradients.day} opacity-90`}
          aria-hidden="true"
        />
        {/* Ken-burns hero image (silent) */}
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover animate-[kenBurns_25s_ease-out_infinite]"
          />
        </div>
        {/* Vignette */}
        <div
          className="absolute inset-0 bg-gradient-radial pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 20%, rgba(7,13,21,0.45) 70%, rgba(7,13,21,0.85) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Back nav */}
        <Link
          href="/home"
          className="absolute top-4 right-4 z-30 text-white/80 hover:text-white text-xs bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 no-underline transition-colors inline-flex items-center gap-1.5"
          style={{ top: "max(16px, env(safe-area-inset-top))" }}
          aria-label="الرجوع للرئيسية"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>الرئيسية</span>
        </Link>

        {/* Stats chip (top-left) */}
        {stats.streak > 0 && (
          <div
            className="absolute top-4 left-4 z-30 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 text-white text-xs font-bold inline-flex items-center gap-1.5"
            style={{ top: "max(16px, env(safe-area-inset-top))" }}
            aria-label={`streak: ${stats.streak} أيام`}
          >
            🔥 <span>{stats.streak} يوم</span>
            {meditatedToday && <span className="text-[#91b149]">·</span>}
          </div>
        )}

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-lg px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <p className="text-[11px] uppercase tracking-[0.5em] text-[#91b149] font-bold mb-6">
              غرفة التأمل
            </p>

            {/* Time-aware greeting */}
            <p className="text-white/75 text-lg mb-1 font-display">{greeting}</p>
            <h1 className="font-display text-3xl md:text-5xl font-black mb-8 leading-tight">
              خد شهيق.
            </h1>
          </motion.div>

          {/* The breathing orb as a tap target */}
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.92 }}
            onClick={onStart}
            className="relative mx-auto w-48 h-48 md:w-56 md:h-56 rounded-full mb-8 focus:outline-none focus:ring-4 focus:ring-[#91b149]/40 focus:ring-offset-0"
            aria-label={`ابدأ جلسة ${suggestedSession.name}`}
          >
            {/* Pulsing outer ring — breathes at 4s in / 4s out to invite breath sync */}
            <motion.div
              animate={{
                scale: orbBreath === "in" ? 1.15 : 0.92,
                opacity: orbBreath === "in" ? 0.7 : 0.3,
              }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border-2 border-[#91b149]/60 pointer-events-none"
            />
            <motion.div
              animate={{
                scale: orbBreath === "in" ? 1.08 : 0.96,
              }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="absolute inset-4 rounded-full bg-gradient-to-br from-[#91b149] to-[#5d7a2d] shadow-[0_8px_40px_rgba(145,177,73,0.5)] pointer-events-none"
            />
            {/* Center label — pointer-events:none so clicks pass through to button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#0a1a0a] font-display pointer-events-none">
              <span className="text-3xl mb-1" aria-hidden="true">
                {suggestedSession.icon}
              </span>
              <span className="text-xs font-bold">ابدأ</span>
              <span className="text-[10px] opacity-70 mt-0.5">
                {Math.round(suggestedSession.duration / 60)} دقيقة
              </span>
            </div>
          </motion.button>

          {/* Session suggestion label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/70 text-sm mb-2"
          >
            {suggestedSession.name}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="text-white/50 text-xs max-w-xs mx-auto mb-10"
          >
            {suggestedSession.subtitle}
          </motion.p>

          {/* Secondary actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center justify-center gap-3"
          >
            <button
              onClick={onOpenLibrary}
              className="text-white/70 hover:text-white text-xs font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full px-4 h-9 border border-white/15 transition-colors"
            >
              كل الجلسات
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("journeys")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white/70 hover:text-white text-xs font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full px-4 h-9 border border-white/15 transition-colors"
            >
              رحلات ↓
            </button>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-bold tracking-wider pointer-events-none"
          aria-hidden="true"
        >
          ⌄ اسحب لأسفل
        </motion.div>
      </section>

      {/* ── Journeys section ── */}
      <section
        id="journeys"
        className="relative py-16 px-4 bg-gradient-to-b from-[#070d15] to-[#0a1828]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#91b149] font-bold mb-3">
              Journeys
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-2">
              رحلات متدرجة
            </h2>
            <p className="text-white/55 text-sm max-w-md mx-auto">
              برامج يومية تبني عادة التأمل خطوة خطوة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {journeys.map((j, i) => (
              <JourneyCard
                key={j.id}
                journey={j}
                progress={journeyProgress}
                onOpen={onOpenJourney}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip (only if user has history) ── */}
      {stats.totalSessions > 0 && (
        <section className="relative py-12 px-4 bg-[#0a1828]">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-3xl font-display font-black text-[#91b149]">
                {stats.totalSessions}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
                جلسة
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-[#91b149]">
                {Math.round(stats.totalMinutes)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
                دقيقة
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-[#91b149]">
                {stats.streak}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
                يوم streak
              </div>
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
