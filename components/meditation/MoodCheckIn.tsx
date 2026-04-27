"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/components/site/LocaleProvider";

export type Mood = 1 | 2 | 3 | 4 | 5;

const MOODS_AR: { value: Mood; emoji: string; label: string }[] = [
  { value: 1, emoji: "😞", label: "متعب" },
  { value: 2, emoji: "😟", label: "متوتر" },
  { value: 3, emoji: "😐", label: "عادي" },
  { value: 4, emoji: "🙂", label: "كويس" },
  { value: 5, emoji: "😊", label: "ممتاز" },
];

const MOODS_EN: { value: Mood; emoji: string; label: string }[] = [
  { value: 1, emoji: "😞", label: "Exhausted" },
  { value: 2, emoji: "😟", label: "Stressed" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
];

interface Props {
  /** "before" → before the session starts, "after" → after it ends. */
  phase: "before" | "after";
  /** What the user selected before, for context on the "after" screen. */
  previousMood?: Mood;
  onSelect: (mood: Mood) => void;
  onSkip: () => void;
  sessionName: string;
}

/**
 * Full-screen mood check-in. Renders before and after each session.
 *
 * Why a dedicated component instead of a toast: the whole point is to create
 * a deliberate pause — a beat where the user actually *notices* how they
 * feel. A buried toggle gets skipped; a full-screen moment gets answered.
 *
 * The "skip" path is always available — forcing someone to introspect on
 * command is counterproductive. But the UI nudges them subtly toward
 * answering by making skip a smaller text link.
 */
export default function MoodCheckIn({
  phase,
  previousMood,
  onSelect,
  onSkip,
  sessionName,
}: Props) {
  const { locale } = useTranslations();
  const MOODS = locale === "en" ? MOODS_EN : MOODS_AR;
  // Small haptic tap on selection — this is the moment the user commits
  // to an emotion, a subtle confirmation vibration reinforces the choice.
  const select = useCallback(
    (m: Mood) => {
      try {
        navigator.vibrate?.(15);
      } catch {
        /* haptic not supported */
      }
      onSelect(m);
    },
    [onSelect],
  );
  const title =
    phase === "before"
      ? locale === "en"
        ? "How are you feeling right now?"
        : "إزاي حاسس دلوقتي؟"
      : locale === "en"
        ? "How are you feeling now?"
        : "دلوقتي إزاي حاسس؟";
  const subtitle =
    phase === "before"
      ? locale === "en"
        ? `Before we begin ${sessionName} — a moment of honesty with yourself`
        : `قبل ما نبدأ ${sessionName} — لحظة صدق مع نفسك`
      : locale === "en"
        ? "The difference between before and after will help you see that meditation makes a real difference"
        : "الفرق بين قبل وبعد هيساعدك تشوف إن التأمل بيعمل فرق حقيقي";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#0a1a2a] via-[#0d2238] to-[#070d15] flex flex-col items-center justify-center px-6"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="max-w-md w-full text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#91b149] font-bold mb-3">
          {phase === "before"
            ? locale === "en"
              ? "Before session"
              : "قبل الجلسة"
            : locale === "en"
              ? "After session"
              : "بعد الجلسة"}
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
          {title}
        </h1>
        <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          {subtitle}
        </p>

        {/* Mood row — 5 emoji buttons */}
        <div className="flex items-center justify-between gap-2 md:gap-3 mb-8" role="radiogroup" aria-label={locale === "en" ? "Mood scale" : "مقياس المزاج"}>
          {MOODS.map((m, i) => {
            const isPrev = previousMood === m.value;
            return (
              <motion.button
                key={m.value}
                onClick={() => select(m.value)}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-1.5 transition-colors ${
                  isPrev
                    ? "bg-[#91b149]/20 border border-[#91b149]/60 shadow-[0_0_24px_rgba(145,177,73,0.25)]"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
                aria-label={m.label}
                role="radio"
                aria-checked={isPrev}
              >
                <span className="text-3xl md:text-4xl">{m.emoji}</span>
                <span className={`text-[9px] md:text-[10px] font-bold ${isPrev ? "text-[#91b149]" : "text-white/70"}`}>
                  {m.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Contextual hint for "before" */}
        {phase === "before" && previousMood === undefined && (
          <p className="text-white/40 text-[11px] leading-relaxed mb-6">
            {locale === "en"
              ? "Pick the closest feeling · it doesn't need to be perfect"
              : "اختار الإحساس الأقرب · مش لازم يكون مثالي"}
          </p>
        )}

        <button
          onClick={onSkip}
          className="text-white/45 hover:text-white/75 text-xs font-bold transition-colors"
        >
          {phase === "before"
            ? locale === "en"
              ? "Skip"
              : "تخطّي"
            : locale === "en"
              ? "Skip and go to summary"
              : "تخطّي واذهب للملخص"}
        </button>
      </motion.div>
    </motion.div>
  );
}
