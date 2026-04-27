"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SESSIONS, getSession } from "@/lib/meditation/sessions";
import {
  useSessionHistory,
  type SessionRecord,
} from "@/hooks/meditation/useSessionHistory";
import { readJourneyProgress, JOURNEYS } from "@/lib/meditation/journeys";
import { useTranslations } from "@/components/site/LocaleProvider";

/* ═══════════════════════════════════════════════════════════
   History page — /therapy-room/history
   All data is read from localStorage (no network). Renders:
     · Calendar heatmap of the last 30 days
     · Mood delta chart (avg mood improvement per session)
     · Session list (most recent first, with mood + duration)
     · Journey progress rings
     · Export / Import data buttons
   ═══════════════════════════════════════════════════════════ */

// Format a date as "ي س" = day name + day number
function dayLabel(
  ts: number,
  locale: "ar" | "en",
  short = false,
): string {
  const d = new Date(ts);
  const namesAr = short
    ? ["أحد", "اثن", "ثل", "أر", "خم", "جم", "سبت"]
    : ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const namesEn = short
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
  const names = locale === "en" ? namesEn : namesAr;
  return `${names[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

function formatDuration(sec: number, locale: "ar" | "en"): string {
  if (sec < 60) return locale === "en" ? `${sec}s` : `${sec} ث`;
  const m = Math.round(sec / 60);
  return locale === "en" ? `${m}m` : `${m} د`;
}

/** 30-day heatmap. Oldest on the right in RTL. */
function Heatmap({
  records,
  locale,
}: {
  records: SessionRecord[];
  locale: "ar" | "en";
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const DAY_MS = 86400000;

  // Compute total meditation seconds per day
  const buckets = new Map<number, number>();
  for (const r of records) {
    const d = new Date(r.completedAt);
    d.setHours(0, 0, 0, 0);
    const key = d.getTime();
    buckets.set(key, (buckets.get(key) ?? 0) + r.durationSec);
  }

  const cells = [];
  for (let i = 29; i >= 0; i--) {
    const t = today.getTime() - i * DAY_MS;
    const secs = buckets.get(t) ?? 0;
    // 0 = nothing, 1 = <5min, 2 = 5-15min, 3 = 15+ min
    const intensity =
      secs === 0 ? 0 : secs < 300 ? 1 : secs < 900 ? 2 : 3;
    cells.push({ t, secs, intensity });
  }

  const tone = (i: number) => {
    if (i === 0) return "bg-white/5";
    if (i === 1) return "bg-[#91b149]/30";
    if (i === 2) return "bg-[#91b149]/55";
    return "bg-[#91b149]";
  };

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
        {locale === "en" ? "Last 30 days" : "آخر 30 يوم"}
      </div>
      <div className="grid grid-cols-10 gap-1">
        {cells.map((c) => (
          <div
            key={c.t}
            className={`aspect-square rounded-sm ${tone(c.intensity)}`}
            title={`${dayLabel(c.t, locale)} — ${
              formatDuration(c.secs, locale) ||
              (locale === "en" ? "Nothing" : "لا شيء")
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-[10px] text-white/40">
        <span>{locale === "en" ? "Less" : "أقل"}</span>
        <div className="w-3 h-3 rounded-sm bg-white/5" />
        <div className="w-3 h-3 rounded-sm bg-[#91b149]/30" />
        <div className="w-3 h-3 rounded-sm bg-[#91b149]/55" />
        <div className="w-3 h-3 rounded-sm bg-[#91b149]" />
        <span>{locale === "en" ? "More" : "أكتر"}</span>
      </div>
    </div>
  );
}

function MoodSummary({
  records,
  locale,
}: {
  records: SessionRecord[];
  locale: "ar" | "en";
}) {
  const withMoods = records.filter(
    (r) =>
      typeof r.moodBefore === "number" && typeof r.moodAfter === "number",
  );
  if (withMoods.length === 0) {
    return (
      <p className="text-xs text-white/40 leading-relaxed">
        {locale === "en"
          ? "Log your mood before and after a session to see the difference here."
          : "سجّل مزاجك قبل وبعد الجلسة عشان تشوف الفرق هنا."}
      </p>
    );
  }
  const totalDelta = withMoods.reduce(
    (acc, r) => acc + (r.moodAfter! - r.moodBefore!),
    0,
  );
  const avgDelta = totalDelta / withMoods.length;
  const improved = withMoods.filter(
    (r) => r.moodAfter! > r.moodBefore!,
  ).length;
  const improvedPct = Math.round((improved / withMoods.length) * 100);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 rounded-2xl p-4">
        <div className="text-3xl font-black font-display text-[#91b149] mb-1">
          {avgDelta > 0 ? "+" : ""}
          {avgDelta.toFixed(1)}
        </div>
        <div className="text-[10px] text-white/50 leading-relaxed">
          {locale === "en"
            ? "Average mood improvement after a session"
            : "متوسط تحسّن المزاج بعد الجلسة"}
        </div>
      </div>
      <div className="bg-white/5 rounded-2xl p-4">
        <div className="text-3xl font-black font-display text-[#91b149] mb-1">
          {improvedPct}%
        </div>
        <div className="text-[10px] text-white/50 leading-relaxed">
          {locale === "en"
            ? "of sessions improved your mood"
            : "من الجلسات حسّنت مزاجك"}
        </div>
      </div>
    </div>
  );
}

function SessionList({
  records,
  favorites,
  onToggleFavorite,
  locale,
}: {
  records: SessionRecord[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  locale: "ar" | "en";
}) {
  const sorted = [...records].sort((a, b) => b.completedAt - a.completedAt);
  return (
    <div className="flex flex-col gap-2">
      {sorted.length === 0 && (
        <div className="text-center py-10 text-white/40 text-xs">
          {locale === "en"
            ? "No sessions yet — start your first one"
            : "لسه مفيش جلسات — ابدأ أول واحدة"}
        </div>
      )}
      {sorted.slice(0, 50).map((r, idx) => {
        const s = getSession(r.sessionId);
        const isFav = favorites.includes(r.sessionId);
        const dt = new Date(r.completedAt);
        const timeStr = `${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;
        const delta =
          typeof r.moodBefore === "number" && typeof r.moodAfter === "number"
            ? r.moodAfter - r.moodBefore
            : null;
        return (
          <motion.div
            key={`${r.completedAt}-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02, duration: 0.25 }}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-2xl p-3 border border-white/5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#91b149]/15 flex items-center justify-center text-lg flex-shrink-0">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0 text-right">
              <div className="text-white text-sm font-bold truncate">
                {s.name}
              </div>
              <div className="text-white/40 text-[11px] flex items-center gap-2 mt-0.5">
                <span>{dayLabel(r.completedAt, locale, true)}</span>
                <span>·</span>
                <span>{timeStr}</span>
                <span>·</span>
                <span>{formatDuration(r.durationSec, locale)}</span>
                {delta !== null && (
                  <>
                    <span>·</span>
                    <span
                      className={
                        delta > 0
                          ? "text-[#91b149]"
                          : delta < 0
                            ? "text-amber-400"
                            : "text-white/40"
                      }
                    >
                      {locale === "en"
                        ? delta > 0
                          ? `+${delta} mood`
                          : delta < 0
                            ? `${delta} mood`
                            : "mood unchanged"
                        : delta > 0
                          ? `+${delta} مزاج`
                          : delta < 0
                            ? `${delta} مزاج`
                            : "مزاج ثابت"}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => onToggleFavorite(r.sessionId)}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isFav
                  ? "text-[#91b149] bg-[#91b149]/15"
                  : "text-white/30 hover:text-white/70 hover:bg-white/5"
              }`}
              aria-label={
                isFav
                  ? locale === "en"
                    ? "Remove from favorites"
                    : "إزالة من المفضلة"
                  : locale === "en"
                    ? "Add to favorites"
                    : "أضف للمفضلة"
              }
              aria-pressed={isFav}
            >
              {isFav ? "⭐" : "☆"}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

function JourneyRings({
  progress,
  locale,
}: {
  progress: ReturnType<typeof readJourneyProgress>;
  locale: "ar" | "en";
}) {
  const active = JOURNEYS.filter((j) => {
    const p = progress[j.id];
    return p && p.completedDays.length > 0;
  });
  if (active.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      {active.map((j) => {
        const p = progress[j.id];
        const done = p.completedDays.length;
        const total = j.days.length;
        const pct = Math.round((done / total) * 100);
        return (
          <Link
            key={j.id}
            href={`/therapy-room`}
            className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 no-underline transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{j.icon}</span>
              <span className="text-white text-xs font-bold truncate">
                {j.name}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#91b149] rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-[10px] text-white/50 mt-1.5 font-bold">
              {locale === "en"
                ? `${done} / ${total} days (${pct}%)`
                : `${done} / ${total} يوم (${pct}%)`}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function TherapyHistoryPage() {
  const { locale } = useTranslations();
  const isEn = locale === "en";
  const { records, settings, stats, toggleFavorite } = useSessionHistory();
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const journeyProgress = useMemo(() => readJourneyProgress(), []);

  const totalSessions = records.length;
  const totalMinutes = stats.totalMinutes;
  const longest = records.reduce(
    (max, r) => (r.durationSec > max ? r.durationSec : max),
    0,
  );
  const mostPlayed = (() => {
    const counts = new Map<string, number>();
    for (const r of records) {
      counts.set(r.sessionId, (counts.get(r.sessionId) ?? 0) + 1);
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    if (!top) return null;
    return {
      session: SESSIONS.find((s) => s.id === top[0]),
      count: top[1],
    };
  })();

  /* ─────────── Export / Import ─────────── */
  const handleExport = () => {
    const payload = {
      schema: "waaha-meditation-v1",
      exportedAt: new Date().toISOString(),
      history: records,
      settings,
      journeyProgress,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waaha-meditation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.schema !== "waaha-meditation-v1") {
        setImportError(
          isEn
            ? "File isn't from Waaha or the format is outdated"
            : "الملف مش من واحة أو الصيغة قديمة",
        );
        return;
      }
      if (parsed.history) {
        localStorage.setItem(
          "waaha_meditation_history",
          JSON.stringify(parsed.history),
        );
      }
      if (parsed.settings) {
        localStorage.setItem(
          "waaha_meditation_settings",
          JSON.stringify(parsed.settings),
        );
      }
      if (parsed.journeyProgress) {
        localStorage.setItem(
          "waaha_journey_progress_v1",
          JSON.stringify(parsed.journeyProgress),
        );
      }
      window.location.reload();
    } catch {
      setImportError(
        isEn ? "File is corrupt or not valid JSON" : "الملف تالف أو مش JSON صحيح",
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-[#070d15] text-white px-4 py-6 pb-24"
      dir={isEn ? "ltr" : "rtl"}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/therapy-room"
          className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-full px-3 h-9 text-xs font-bold border border-white/10 transition-colors no-underline"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>{isEn ? "Therapy Room" : "غرفة التأمل"}</span>
        </Link>
        <h1 className="font-display text-lg font-black">
          {isEn ? "Your history" : "تاريخك"}
        </h1>
        <div className="w-20" />
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Hero stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 rounded-2xl p-3">
            <div className="text-2xl font-display font-black text-[#91b149]">
              {totalSessions}
            </div>
            <div className="text-[10px] text-white/50 mt-1">
              {isEn ? "sessions" : "جلسة"}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3">
            <div className="text-2xl font-display font-black text-[#91b149]">
              {totalMinutes}
            </div>
            <div className="text-[10px] text-white/50 mt-1">
              {isEn ? "minutes" : "دقيقة"}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3">
            <div className="text-2xl font-display font-black text-[#91b149]">
              {stats.streak}
            </div>
            <div className="text-[10px] text-white/50 mt-1">
              {isEn ? "🔥 day streak" : "🔥 يوم متواصل"}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <Heatmap records={records} locale={locale} />

        {/* Mood summary */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
            {isEn ? "Mood improvement" : "تحسّن المزاج"}
          </div>
          <MoodSummary records={records} locale={locale} />
        </div>

        {/* Personal bests */}
        {longest > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/5 rounded-2xl p-3">
              <div className="text-[10px] text-white/50 mb-1">
                {isEn ? "Longest session" : "أطول جلسة"}
              </div>
              <div className="text-lg font-black text-white font-mono">
                {formatDuration(longest, locale)}
              </div>
            </div>
            {mostPlayed?.session && (
              <div className="bg-white/5 rounded-2xl p-3">
                <div className="text-[10px] text-white/50 mb-1">
                  {isEn ? "Most played" : "الأكتر تكراراً"}
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {mostPlayed.session.icon} {mostPlayed.session.name}
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">
                  {isEn
                    ? `${mostPlayed.count} times`
                    : `${mostPlayed.count} مرة`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Journey rings */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
            {isEn ? "Journeys" : "الرحلات"}
          </div>
          <JourneyRings progress={journeyProgress} locale={locale} />
        </div>

        {/* Session list */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
            {isEn ? "All sessions" : "كل الجلسات"}
          </div>
          <SessionList
            records={records}
            favorites={settings.favorites}
            onToggleFavorite={toggleFavorite}
            locale={locale}
          />
        </div>

        {/* Export / Import */}
        <div className="border-t border-white/10 pt-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
            {isEn ? "Your data" : "بياناتك"}
          </div>
          <p className="text-xs text-white/50 mb-3 leading-relaxed">
            {isEn
              ? "Your full history is stored only on your device — no server. Move it to another device by exporting the file and importing it there."
              : "كل التاريخ محفوظ على جهازك فقط — بدون سيرفر. نقله لجهاز تاني بتحميل الملف واستيراده هناك."}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full text-xs border border-white/10 transition-colors"
            >
              📥 {isEn ? "Export data" : "صدّر البيانات"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full text-xs border border-white/10 transition-colors"
            >
              📤 {isEn ? "Import" : "استورد"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          {importError && (
            <p className="text-xs text-amber-400 mt-3">{importError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
