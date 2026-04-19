"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Journey, JourneyProgress } from "@/lib/meditation/journeys";
import { nextDayFor } from "@/lib/meditation/journeys";

interface Props {
  journey: Journey;
  progress: JourneyProgress;
  onOpen: (journey: Journey) => void;
  index?: number;
}

/**
 * Card for a multi-day journey. Shows cover image, name, progress dots,
 * and the next-day teaser. Tapping it opens the journey detail view.
 */
export default function JourneyCard({
  journey,
  progress,
  onOpen,
  index = 0,
}: Props) {
  const entry = progress[journey.id];
  const completedCount = entry?.completedDays.length ?? 0;
  const totalDays = journey.days.length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);
  const nextDay = nextDayFor(journey, progress);
  const nextDayInfo = journey.days.find((d) => d.day === nextDay);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(journey)}
      className="relative group flex flex-col text-right bg-[#12394d]/70 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden w-full focus:outline-none focus:ring-2 focus:ring-[#91b149] focus:ring-offset-2 focus:ring-offset-[#0a151f]"
      dir="rtl"
      aria-label={`فتح رحلة ${journey.name}`}
    >
      {/* Cover */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={journey.coverImage}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          aria-hidden="true"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${journey.gradient} opacity-70`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a151f] via-transparent to-transparent" />

        {/* Icon */}
        <div className="absolute top-3 right-3 text-3xl drop-shadow-lg" aria-hidden="true">
          {journey.icon}
        </div>

        {/* Progress badge */}
        {completedCount > 0 && (
          <div className="absolute top-3 left-3 bg-[#91b149] text-[#0a0f14] text-[10px] font-bold px-2 py-0.5 rounded-full">
            {completedCount}/{totalDays}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div>
          <h3 className="text-white font-display font-black text-lg leading-tight mb-1">
            {journey.name}
          </h3>
          <p className="text-white/55 text-xs">{journey.subtitle}</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 flex-wrap mt-1" aria-hidden="true">
          {journey.days.slice(0, Math.min(totalDays, 14)).map((d) => {
            const done = entry?.completedDays.includes(d.day);
            const current = d.day === nextDay;
            return (
              <span
                key={d.day}
                className={`h-1.5 rounded-full transition-all ${
                  done
                    ? "w-4 bg-[#91b149]"
                    : current
                      ? "w-4 bg-white/60"
                      : "w-1.5 bg-white/15"
                }`}
              />
            );
          })}
        </div>

        {/* Next day teaser */}
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          {completedCount === totalDays ? (
            <>
              <span className="text-[#91b149] font-bold">✓ خلصت الرحلة</span>
              <span className="text-white/40">ابدأ من جديد ←</span>
            </>
          ) : (
            <>
              <span className="text-white/50">يوم {nextDay}</span>
              <span className="text-white font-bold truncate max-w-[60%]">
                {nextDayInfo?.teaser}
              </span>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5" aria-hidden="true">
          <div
            className="h-full bg-[#91b149] transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </motion.button>
  );
}
