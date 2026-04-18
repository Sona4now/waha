"use client";

import { motion } from "framer-motion";
import type { DestinationFull } from "@/data/siteData";

interface Props {
  dest: DestinationFull;
}

/**
 * Quick facts bar shown right under the hero.
 * 4-6 key data points the user cares about most,
 * answered in a single glance.
 */
export default function QuickFactsBar({ dest }: Props) {
  const bestMonthNames = ["", "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const bestMonth = dest.bestMonths?.[0] ? bestMonthNames[dest.bestMonths[0]] : "طوال العام";

  const facts = [
    {
      icon: "📍",
      label: "المسافة من القاهرة",
      value: dest.distanceKm ? `${dest.distanceKm} كم` : "—",
    },
    {
      icon: "⏱️",
      label: "المدة المثالية",
      value: dest.duration || "—",
    },
    {
      icon: "💰",
      label: "التكلفة",
      value: dest.costFrom || "—",
    },
    {
      icon: "🌡️",
      label: "أفضل موعد",
      value: bestMonth,
    },
    {
      icon: "⭐",
      label: "الصعوبة",
      value: dest.difficulty || "سهل",
    },
    {
      icon: "👥",
      label: "مناسبة لـ",
      value: dest.audience || "الجميع",
    },
  ];

  return (
    <section className="relative -mt-10 z-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white dark:bg-[#162033] rounded-2xl shadow-[0_20px_60px_-20px_rgba(29,87,112,0.35)] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] border border-[#d0dde4] dark:border-[#1e3a5f] p-4 sm:p-6"
        >
          {/* Pitch line */}
          {dest.pitch && (
            <div className="mb-4 pb-4 border-b border-[#d0dde4] dark:border-[#1e3a5f]">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <p className="text-sm sm:text-base font-bold text-[#12394d] dark:text-white leading-snug">
                  {dest.pitch}
                </p>
              </div>
            </div>
          )}

          {/* Facts grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="text-center"
              >
                <div className="text-xl sm:text-2xl mb-1">{f.icon}</div>
                <div className="text-[10px] sm:text-[11px] text-[#7b7c7d] dark:text-white/40 mb-0.5">
                  {f.label}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#12394d] dark:text-white leading-tight">
                  {f.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
