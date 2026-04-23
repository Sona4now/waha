"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Session } from "@/lib/meditation/sessions";
import type { Stats } from "@/hooks/meditation/useSessionHistory";
import type { Journey } from "@/lib/meditation/journeys";
import Confetti from "./Confetti";

/**
 * Short, specific Arabic encouragements. Picked randomly per-session so
 * returning users don't see the same line. Kept small (6 items) on purpose —
 * a larger set dilutes the specificity.
 */
const MOTIVATIONAL_QUOTES = [
  "اللي عملته ده أصعب من إنك تقعد ساعة في الجيم.",
  "جسمك دلوقتي بيعمل reset. اديله لحظة.",
  "كل مرة بتتأمل، بتبني عضلة في الصبر.",
  "الهدوء مش هروب — ده قوة.",
  "التنفس الواعي هو أقدم دواء في التاريخ.",
  "3 دقايق بس كفاية إنك ترجع لنفسك.",
];

interface Props {
  session: Session;
  elapsed: number;
  fullyCompleted: boolean;
  breathCycles: number;
  stats: Stats;
  /** 1-5 mood rating captured pre-session (if any). */
  moodBefore?: number;
  /** 1-5 mood rating captured post-session (if any). */
  moodAfter?: number;
  /** If this session was a journey day, the journey + day number. Used to
   *  show "Day 3 of 7" completion progress + journey-done celebration. */
  journey?: Journey;
  journeyDay?: number;
  onRestart: () => void;
  onLibrary: () => void;
  /** Navigate to /therapy-room/history. Optional so the Summary stays useful
   *  even if the consumer hasn't wired history yet. */
  onViewHistory?: () => void;
}

function achievementFor(elapsed: number, fullyCompleted: boolean) {
  if (fullyCompleted) return { emoji: "🏆", text: "أتممت الجلسة كاملة" };
  if (elapsed >= 600) return { emoji: "🥇", text: "أكتر من 10 دقائق — ممتاز" };
  if (elapsed >= 300) return { emoji: "🥈", text: "5 دقائق — بداية قوية" };
  if (elapsed >= 120) return { emoji: "🥉", text: "دقيقتين — خطوة أولى" };
  return { emoji: "🌱", text: "كل لحظة بتحسبلك" };
}

/**
 * Mood delta card. Only shown when both moods were captured.
 * Positive delta (+1, +2...) = got better. Negative = got worse.
 * Zero = "stayed same" still counts as a win for stability.
 */
function MoodDelta({ before, after }: { before: number; after: number }) {
  const delta = after - before;
  const MOOD_EMOJIS = ["😞", "😟", "😐", "🙂", "😊"];
  const beforeEmoji = MOOD_EMOJIS[before - 1] ?? "😐";
  const afterEmoji = MOOD_EMOJIS[after - 1] ?? "😐";

  const message =
    delta > 1
      ? `تحسّن كبير! قفزت ${delta} درجات`
      : delta === 1
        ? "حاسس أحسن شوية ← مفيش حاجة صغيرة"
        : delta === 0
          ? "حافظت على هدوءك — ده إنجاز برضه"
          : delta === -1
            ? "أحياناً التأمل بيكشف مشاعر كانت مدفونة"
            : "لو لسه متعب، امنح نفسك وقت تاني";

  const tint =
    delta > 0
      ? "bg-[#91b149]/15 border-[#91b149]/40 text-[#91b149]"
      : delta === 0
        ? "bg-white/5 border-white/20 text-white/80"
        : "bg-amber-500/10 border-amber-400/30 text-amber-200";

  return (
    <div className={`rounded-2xl border p-4 mb-5 ${tint}`}>
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-3xl">{beforeEmoji}</span>
        <span className="text-xl opacity-50">←</span>
        <span className="text-3xl">{afterEmoji}</span>
      </div>
      <p className="text-xs font-bold leading-relaxed">{message}</p>
    </div>
  );
}

export default function SessionSummary({
  session,
  elapsed,
  fullyCompleted,
  breathCycles,
  stats,
  moodBefore,
  moodAfter,
  journey,
  journeyDay,
  onRestart,
  onLibrary,
  onViewHistory,
}: Props) {
  const a = achievementFor(elapsed, fullyCompleted);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const hasMoodData =
    typeof moodBefore === "number" && typeof moodAfter === "number";
  const journeyDone =
    journey && journeyDay !== undefined && journeyDay >= journey.days.length;

  // Pick a stable motivational quote for this mount (not on every render).
  const quote = useMemo(
    () =>
      MOTIVATIONAL_QUOTES[
        Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
      ],
    [],
  );

  // Fire confetti when the user actually finished. Not for short-tap sessions
  // or for mid-session ends — we reserve it for a real achievement moment.
  const showConfetti = fullyCompleted || !!journeyDone;

  // Web Share API fallback → copy-to-clipboard
  const handleShare = useCallback(async () => {
    const text = journey
      ? `خلّصت اليوم ${journeyDay} من ${journey.name} — ${mins} دقيقة تأمل. 🌿`
      : `خلّصت جلسة ${session.name} — ${mins} دقيقة تأمل، ${breathCycles} دورة تنفس. 🌿`;
    try {
      if (navigator.share) {
        await navigator.share({ text, title: "واحة · غرفة التأمل" });
      } else {
        await navigator.clipboard.writeText(
          `${text}\nhttps://wahaeg.com/therapy-room`,
        );
      }
    } catch {
      /* user canceled */
    }
  }, [journey, journeyDay, mins, breathCycles, session.name]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#070d15]/95 backdrop-blur-xl flex items-center justify-center z-[60] px-4 overflow-y-auto py-8"
      dir="rtl"
      role="dialog"
      aria-label="ملخص الجلسة"
    >
      <Confetti active={showConfetti} />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="bg-[#162033] border border-[#1e3a5f] rounded-3xl p-7 max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          {journeyDone ? "🎉" : a.emoji}
        </motion.div>
        <h2 className="text-2xl font-display font-black text-white mb-1">
          {journeyDone ? `خلّصت ${journey?.name}!` : fullyCompleted ? "أحسنت!" : "شكراً لك"}
        </h2>
        <p className="text-[#91b149] text-sm font-bold mb-5">
          {journey && journeyDay !== undefined
            ? `اليوم ${journeyDay} من ${journey.days.length}`
            : a.text}
        </p>

        {/* Mood delta — only if captured */}
        {hasMoodData && <MoodDelta before={moodBefore!} after={moodAfter!} />}

        {/* Motivational quote — reinforces that the user did something real */}
        <p className="text-white/60 text-xs leading-relaxed mb-5 px-2">
          💬 {quote}
        </p>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-white/5 rounded-xl p-2.5">
            <div className="text-lg font-bold text-white font-mono">
              {mins}:{String(secs).padStart(2, "0")}
            </div>
            <div className="text-[9px] text-white/40 mt-0.5">المدة</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <div className="text-lg font-bold text-white font-mono">
              {breathCycles}
            </div>
            <div className="text-[9px] text-white/40 mt-0.5">دورة تنفس</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <div className="text-lg font-bold text-white font-mono">
              {stats.streak}🔥
            </div>
            <div className="text-[9px] text-white/40 mt-0.5">يوم متواصل</div>
          </div>
        </div>

        <div className="text-[11px] text-white/30 mb-5 leading-relaxed">
          {session.name} · إجمالي {stats.totalMinutes} دقيقة عبر{" "}
          {stats.totalSessions} جلسة
        </div>

        <div className="flex flex-col gap-2">
          {!journeyDone && (
            <button
              onClick={onRestart}
              className="w-full py-3 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold rounded-full text-sm hover:shadow-[0_8px_24px_rgba(145,177,73,0.4)] transition-shadow"
            >
              كرر نفس الجلسة
            </button>
          )}
          <button
            onClick={handleShare}
            className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full text-xs border border-white/10 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>شارك اللحظة</span>
          </button>
          <button
            onClick={onLibrary}
            className="w-full py-2.5 text-white/70 hover:text-white text-xs font-bold transition-colors"
          >
            {journey ? "عودة للرحلة" : "جلسة تانية"}
          </button>
          {onViewHistory ? (
            <button
              onClick={onViewHistory}
              className="w-full py-2 text-white/40 hover:text-white/80 text-xs transition-colors"
            >
              📊 شوف تاريخك
            </button>
          ) : (
            <Link
              href="/therapy-room/history"
              className="w-full py-2 text-white/40 hover:text-white/80 text-xs transition-colors no-underline"
            >
              📊 شوف تاريخك
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
