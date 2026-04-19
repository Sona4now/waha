"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SESSIONS, SESSION_TAGS, type Session } from "@/lib/meditation/sessions";
import { getEnvironment } from "@/lib/meditation/environments";
import type { Stats } from "@/hooks/meditation/useSessionHistory";
import StreakBadge from "./StreakBadge";

interface Props {
  stats: Stats;
  meditatedToday: boolean;
  favorites: string[];
  lastSessionId?: string;
  onPick: (session: Session) => void;
  onToggleFavorite: (id: string) => void;
}

function fmtMin(sec: number) {
  if (sec < 60) return `${sec} ث`;
  return `${Math.round(sec / 60)} د`;
}

export default function SessionLibrary({
  stats,
  meditatedToday,
  favorites,
  lastSessionId,
  onPick,
  onToggleFavorite,
}: Props) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return SESSIONS;
    if (filter === "favorites")
      return SESSIONS.filter((s) => favorites.includes(s.id));
    return SESSIONS.filter((s) => s.tag === filter);
  }, [filter, favorites]);

  const lastSession = lastSessionId
    ? SESSIONS.find((s) => s.id === lastSessionId)
    : null;

  return (
    <div
      className="min-h-screen bg-[#070d15] py-10 px-4 sm:py-16"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-[10px] uppercase tracking-[0.5em] text-[#91b149] font-bold mb-3">
            · Meditation Room ·
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-3">
            غرفة التأمل
          </h1>
          <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed">
            اختر جلسة تناسب حالتك — تنفس، تأمل، واسترخِ مع الطبيعة المصرية
          </p>
        </motion.header>

        {/* Streak card */}
        <div className="mb-8">
          <StreakBadge stats={stats} meditatedToday={meditatedToday} />
        </div>

        {/* Resume last */}
        {lastSession && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onPick(lastSession)}
            className="w-full mb-6 flex items-center justify-between gap-3 bg-gradient-to-l from-[#91b149]/20 to-[#91b149]/5 border border-[#91b149]/30 rounded-2xl p-4 hover:border-[#91b149]/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#91b149]/20 flex items-center justify-center text-xl">
                ↻
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#91b149] font-bold uppercase tracking-widest">
                  أكمل آخر جلسة
                </div>
                <div className="text-white font-bold text-sm">
                  {lastSession.name} · {fmtMin(lastSession.duration)}
                </div>
              </div>
            </div>
            <span className="text-[#91b149] opacity-0 group-hover:opacity-100 transition-opacity">
              ←
            </span>
          </motion.button>
        )}

        {/* Tag filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {[
            ...SESSION_TAGS,
            ...(favorites.length > 0
              ? ([{ id: "favorites", label: "المفضلات", icon: "♥" }] as const)
              : []),
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors border ${
                filter === t.id
                  ? "bg-[#91b149] border-[#91b149] text-[#0a0f14]"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Session grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((s, i) => {
            const env = getEnvironment(s.env);
            const fav = favorites.includes(s.id);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative"
              >
                <button
                  onClick={() => onPick(s)}
                  className={`w-full text-right p-5 rounded-2xl bg-gradient-to-br ${env.gradients.day} border border-white/10 hover:border-[#91b149]/50 hover:scale-[1.02] transition-all group`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-3xl">{s.icon}</div>
                    <div className="flex items-center gap-1 text-white/70 text-[10px] font-bold bg-black/20 rounded-full px-2 py-1">
                      <span>⏱️</span>
                      <span className="font-mono">{fmtMin(s.duration)}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-display font-bold text-base mb-1">
                    {s.name}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed mb-3 line-clamp-2">
                    {s.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-white/50">
                    <span>{env.emoji}</span>
                    <span>{env.name}</span>
                    <span className="text-white/20">·</span>
                    <span className="uppercase tracking-wider">{s.tag}</span>
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(s.id);
                  }}
                  aria-pressed={fav}
                  aria-label={fav ? "إزالة من المفضلات" : "إضافة للمفضلات"}
                  className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    fav
                      ? "bg-red-500/80 text-white"
                      : "bg-black/30 text-white/50 hover:bg-black/50 hover:text-white"
                  }`}
                >
                  <span className="text-sm">{fav ? "♥" : "♡"}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/40 text-sm">
            مفيش جلسات في التصنيف ده لسه.
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/home"
            className="text-white/30 hover:text-white/60 text-sm no-underline transition-colors"
          >
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
