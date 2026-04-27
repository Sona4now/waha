"use client";

import type { Stats } from "@/hooks/meditation/useSessionHistory";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  stats: Stats;
  meditatedToday: boolean;
}

const DAY_LABELS_AR = ["ح", "ن", "ث", "ر", "خ", "ج", "س"]; // Sunday .. Saturday
const DAY_LABELS_EN = ["S", "M", "T", "W", "T", "F", "S"]; // Sunday .. Saturday

/**
 * Compact streak + weekly overview. Rendered on the library screen.
 */
export default function StreakBadge({ stats, meditatedToday }: Props) {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const DAY_LABELS = isEn ? DAY_LABELS_EN : DAY_LABELS_AR;
  const { streak, totalMinutes, totalSessions, last7Days } = stats;

  return (
    <div
      className="bg-gradient-to-br from-[#162033]/90 to-[#0a151f]/90 border border-[#1e3a5f] rounded-2xl p-5 backdrop-blur"
      dir={isEn ? "ltr" : "rtl"}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-1">
            {isEn ? "Meditation streak" : "سلسلة التأمل"}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-white">
              {streak}
            </span>
            <span className="text-sm text-white/60">
              {isEn
                ? streak === 1
                  ? "day"
                  : "days"
                : streak === 1
                  ? "يوم"
                  : streak === 2
                    ? "يومين"
                    : "أيام"}
            </span>
            {streak > 0 && <span className="text-xl">🔥</span>}
          </div>
        </div>
        <div className="text-left text-xs text-white/40 leading-relaxed">
          <div>
            <span className="text-white font-mono font-bold">
              {totalMinutes}
            </span>{" "}
            {isEn ? "minutes" : "دقيقة"}
          </div>
          <div>
            <span className="text-white font-mono font-bold">
              {totalSessions}
            </span>{" "}
            {isEn ? "sessions" : "جلسة"}
          </div>
        </div>
      </div>

      {/* Weekly grid */}
      <div
        className="flex items-center justify-between gap-1.5"
        role="list"
        aria-label={isEn ? "Last 7 days" : "آخر 7 أيام"}
      >
        {last7Days.map((done, i) => {
          const isToday = i === last7Days.length - 1;
          return (
            <div
              key={i}
              role="listitem"
              className="flex flex-col items-center gap-1 flex-1"
            >
              <div
                className={`w-full aspect-square max-w-[28px] rounded-md border flex items-center justify-center text-[9px] font-bold transition-colors ${
                  done
                    ? "bg-[#91b149] border-[#91b149] text-white"
                    : isToday
                      ? "bg-white/5 border-[#91b149]/40 text-white/30"
                      : "bg-white/5 border-white/10 text-white/20"
                }`}
                aria-label={
                  done
                    ? isEn
                      ? "Meditated this day"
                      : "تأمل في هذا اليوم"
                    : isEn
                      ? "Did not meditate this day"
                      : "لم يتم التأمل في هذا اليوم"
                }
              >
                {done ? "✓" : isToday ? "·" : ""}
              </div>
              <span className="text-[9px] text-white/30">
                {DAY_LABELS[(new Date().getDay() - (6 - i) + 7) % 7]}
              </span>
            </div>
          );
        })}
      </div>

      {!meditatedToday && (
        <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-[#91b149] text-center">
          {isEn
            ? "Haven't meditated today — two minutes is enough"
            : "لسه مأمنتش النهاردة — جلسة دقيقتين كفاية"}
        </div>
      )}
    </div>
  );
}
