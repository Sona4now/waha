"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Session } from "@/lib/meditation/sessions";
import type { Stats } from "@/hooks/meditation/useSessionHistory";

interface Props {
  session: Session;
  elapsed: number;
  fullyCompleted: boolean;
  breathCycles: number;
  stats: Stats;
  onRestart: () => void;
  onLibrary: () => void;
}

function achievementFor(elapsed: number, fullyCompleted: boolean) {
  if (fullyCompleted)
    return { emoji: "🏆", text: "أتممت الجلسة كاملة" };
  if (elapsed >= 600) return { emoji: "🥇", text: "أكتر من 10 دقائق — ممتاز" };
  if (elapsed >= 300) return { emoji: "🥈", text: "5 دقائق — بداية قوية" };
  if (elapsed >= 120) return { emoji: "🥉", text: "دقيقتين — خطوة أولى" };
  return { emoji: "🌱", text: "كل لحظة بتحسبلك" };
}

export default function SessionSummary({
  session,
  elapsed,
  fullyCompleted,
  breathCycles,
  stats,
  onRestart,
  onLibrary,
}: Props) {
  const a = achievementFor(elapsed, fullyCompleted);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#070d15]/95 backdrop-blur-xl flex items-center justify-center z-[60] px-4"
      dir="rtl"
      role="dialog"
      aria-label="ملخص الجلسة"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="bg-[#162033] border border-[#1e3a5f] rounded-3xl p-8 max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          {a.emoji}
        </motion.div>
        <h2 className="text-2xl font-display font-black text-white mb-1">
          {fullyCompleted ? "أحسنت!" : "شكراً لك"}
        </h2>
        <p className="text-[#91b149] text-sm font-bold mb-6">{a.text}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl font-bold text-white font-mono">
              {mins}:{String(secs).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-white/40 mt-1">المدة</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl font-bold text-white font-mono">
              {breathCycles}
            </div>
            <div className="text-[10px] text-white/40 mt-1">دورة تنفس</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl font-bold text-white font-mono">
              {stats.streak}🔥
            </div>
            <div className="text-[10px] text-white/40 mt-1">يوم متواصل</div>
          </div>
        </div>

        <div className="text-[11px] text-white/30 mb-6 leading-relaxed">
          {session.name} · إجمالي {stats.totalMinutes} دقيقة عبر{" "}
          {stats.totalSessions} جلسة
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold rounded-full text-sm hover:shadow-[0_8px_24px_rgba(145,177,73,0.4)] transition-shadow"
          >
            كرر نفس الجلسة
          </button>
          <button
            onClick={onLibrary}
            className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full text-sm border border-white/10 transition-colors"
          >
            جلسة تانية
          </button>
          <Link
            href="/home"
            className="w-full py-3 text-white/50 hover:text-white text-sm no-underline text-center transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
