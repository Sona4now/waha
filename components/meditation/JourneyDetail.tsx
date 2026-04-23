"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Journey, JourneyProgress } from "@/lib/meditation/journeys";
import { SESSIONS } from "@/lib/meditation/sessions";
import { nextDayFor, dayLockInfo } from "@/lib/meditation/journeys";

interface Props {
  journey: Journey;
  progress: JourneyProgress;
  onBack: () => void;
  onStartDay: (day: number) => void;
}

/**
 * Detail page for a single journey — shows cover, day-by-day list,
 * progress, and lets the user start or resume.
 */
export default function JourneyDetail({
  journey,
  progress,
  onBack,
  onStartDay,
}: Props) {
  const entry = progress[journey.id];
  const completedCount = entry?.completedDays.length ?? 0;
  const nextDay = nextDayFor(journey, progress);
  const totalDays = journey.days.length;

  const percent = Math.round((completedCount / totalDays) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#070d15]"
      dir="rtl"
    >
      {/* Cover */}
      <div className="relative h-[45vh] min-h-[280px] overflow-hidden">
        <Image
          src={journey.coverImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${journey.gradient} opacity-75`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070d15]" />

        {/* Back */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-10 text-white/85 hover:text-white text-xs bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 transition-colors inline-flex items-center gap-1.5"
          style={{ top: "max(16px, env(safe-area-inset-top))" }}
          aria-label="رجوع"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>رجوع</span>
        </button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-5xl mb-3" aria-hidden="true">
              {journey.icon}
            </p>
            <h1 className="font-display text-2xl md:text-4xl font-black mb-1">
              {journey.name}
            </h1>
            <p className="text-white/70 text-sm mb-3">{journey.subtitle}</p>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs">
                <div
                  className="h-full bg-[#91b149] transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-white/70 font-bold whitespace-nowrap">
                {completedCount} / {totalDays}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description + primary CTA */}
      <div className="relative max-w-3xl mx-auto px-4 -mt-2 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#12394d]/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-5"
        >
          <p className="text-white/80 text-sm leading-relaxed mb-5">
            {journey.description}
          </p>
          <button
            onClick={() => onStartDay(nextDay)}
            className="w-full py-3.5 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-[#0a0f14] font-bold rounded-full text-sm hover:shadow-[0_8px_24px_rgba(145,177,73,0.4)] transition-shadow"
          >
            {completedCount === 0
              ? `ابدأ اليوم 1 — ${journey.days[0]?.teaser}`
              : completedCount === totalDays
                ? "ابدأ الرحلة من جديد"
                : `كمّل — يوم ${nextDay}`}
          </button>
        </motion.div>

        {/* Day list */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold px-1 mb-2">
            الأيام
          </p>
          {journey.days.map((d, i) => {
            const session = SESSIONS.find((s) => s.id === d.sessionId);
            const lock = dayLockInfo(journey, d.day, progress);
            const done = lock.completed;
            const current = lock.unlocked && !done;
            const locked = !lock.unlocked;
            return (
              <motion.button
                key={d.day}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                onClick={() => lock.unlocked && onStartDay(d.day)}
                disabled={!lock.unlocked}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-right ${
                  current
                    ? "bg-[#91b149]/15 border-[#91b149]/60 hover:bg-[#91b149]/20"
                    : done
                      ? "bg-[#12394d]/40 border-white/10 hover:bg-[#12394d]/60"
                      : "bg-white/5 border-white/5 opacity-60 cursor-not-allowed"
                }`}
                aria-label={`يوم ${d.day}: ${d.teaser} — ${lock.label}`}
              >
                {/* Day number / status badge */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    done
                      ? "bg-[#91b149] text-[#0a0f14]"
                      : current
                        ? "bg-white text-[#12394d]"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {done ? "✓" : d.day}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm leading-tight">
                    {d.teaser}
                  </div>
                  {session && (
                    <div className="text-white/50 text-[11px] mt-0.5 truncate">
                      {session.name} · {Math.round(session.duration / 60)} دقيقة
                    </div>
                  )}
                  {/* Show the lock-state label so users know exactly when a
                      day becomes available instead of just seeing a lock icon. */}
                  {locked && (
                    <div className="text-[#91b149]/80 text-[11px] font-bold mt-1">
                      🔒 {lock.label}
                    </div>
                  )}
                </div>

                <span
                  className={`text-lg flex-shrink-0 ${
                    done
                      ? "text-[#91b149]"
                      : current
                        ? "text-white"
                        : "text-white/30"
                  }`}
                  aria-hidden="true"
                >
                  {done ? "✓" : locked ? "🔒" : "←"}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
