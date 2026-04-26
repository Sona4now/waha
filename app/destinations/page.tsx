"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import EmptyState from "@/components/site/EmptyState";
import DestinationCard from "@/components/site/DestinationCard";
import EnvironmentChapter from "@/components/destination/EnvironmentChapter";
import ChapterNav from "@/components/destination/ChapterNav";
import { DESTINATIONS, type DestinationFull } from "@/data/siteData";
import { TESTIMONIALS_BY_DEST } from "@/data/testimonials";
import { ENVIRONMENT_CHAPTERS } from "@/data/environmentChapters";
import { isInSeasonNow } from "@/lib/season";
import {
  useRecommendation,
  NEED_TO_TREATMENTS,
  type Recommendation,
} from "@/hooks/useRecommendation";

/* ── Filter definitions ─────────────────────────────────── */
const TREATMENT_FILTERS = [
  { key: "all", label: "الكل", icon: "✨" },
  { key: "مفاصل", label: "مفاصل", icon: "🦴" },
  { key: "جلد", label: "جلد", icon: "🧴" },
  { key: "تنفس", label: "تنفس", icon: "🫁" },
  { key: "توتر", label: "توتر", icon: "🧠" },
  { key: "استرخاء", label: "استرخاء", icon: "🧘" },
];

const DISTANCE_FILTERS = [
  { key: "all", label: "كل المسافات" },
  { key: "near", label: "قريب (أقل من 200 كم)" },
  { key: "mid", label: "متوسط (200-500 كم)" },
  { key: "far", label: "بعيد (أكتر من 500 كم)" },
];

const BUDGET_FILTERS = [
  { key: "all", label: "كل الميزانيات" },
  { key: "low", label: "اقتصادي (أقل من 5,000 ج)" },
  { key: "mid", label: "متوسط (5,000-10,000 ج)" },
  { key: "high", label: "فاخر (أكتر من 10,000 ج)" },
];

const DURATION_FILTERS = [
  { key: "all", label: "أي مدة" },
  { key: "day", label: "يوم واحد" },
  { key: "week", label: "أسبوع أو أقل" },
  { key: "long", label: "أكتر من أسبوع" },
];

const SORT_OPTIONS = [
  { key: "relevance", label: "الأنسب لحالتك" },
  { key: "in-season", label: "اللي في موسمها" },
  { key: "distance", label: "الأقرب أولاً" },
  { key: "cost", label: "الأرخص أولاً" },
  { key: "rating", label: "الأعلى تقييماً" },
  { key: "duration", label: "الأقصر أولاً" },
  { key: "name", label: "الترتيب الأبجدي" },
];

/**
 * Intent presets — one click applies multiple filters at once.
 *
 * The treatment chips alone are too granular for users who don't yet know
 * what they need. Presets bundle the common patterns into single chips
 * with intent-based copy.
 */
const INTENT_PRESETS = [
  {
    key: "calm",
    label: "بحث عن الهدوء",
    icon: "🧘",
    color: "#1d5770",
    filters: { treatment: "استرخاء", distance: "all", budget: "all", duration: "all" },
  },
  {
    key: "treatment",
    label: "علاج طبيعي",
    icon: "⚕️",
    color: "#91b149",
    filters: { treatment: "مفاصل", distance: "all", budget: "all", duration: "long" },
  },
  {
    key: "adventure",
    label: "مغامرة وطاقة",
    icon: "⚡",
    color: "#d97706",
    filters: { treatment: "all", distance: "all", budget: "all", duration: "week" },
  },
  {
    key: "weekend",
    label: "إجازة قصيرة قريبة",
    icon: "📍",
    color: "#7c3aed",
    filters: { treatment: "all", distance: "near", budget: "all", duration: "day" },
  },
] as const;

/* ── Helpers ────────────────────────────────────────────── */
function parseCost(s?: string): number {
  if (!s) return 99999;
  if (s.includes("رمزية")) return 50;
  const match = s.match(/\d[\d,]*/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 99999;
}

function parseDuration(s?: string): number {
  if (!s) return 0;
  const match = s.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function getRating(destId: string): number {
  const list = TESTIMONIALS_BY_DEST[destId] ?? [];
  if (list.length === 0) return 0;
  return list.reduce((s, t) => s + t.rating, 0) / list.length;
}

function relevanceScore(
  dest: DestinationFull,
  rec: Recommendation | null,
): number {
  if (!rec) return 0;
  let score = 0;
  if (rec.destinationId === dest.id) score += 10;
  if (rec.environment && dest.envClass) {
    const destEnv = dest.envClass.replace(/^env-/, "");
    const recEnv =
      rec.environment === "mountains" ? "mountain" : rec.environment;
    if (destEnv === recEnv) score += 2;
  }
  if (rec.need) {
    for (const w of NEED_TO_TREATMENTS[rec.need] ?? []) {
      if (dest.treatments?.some((t) => t.includes(w))) score += 3;
    }
  }
  return score;
}

/* ── localStorage keys ──────────────────────────────────── */
const FILTERS_KEY = "waaha_destinations_filters";
const RECENT_VIEWED_KEY = "waaha_recent_destinations";
const VIEW_DENSITY_KEY = "waaha_destinations_density";

/* ── Component ──────────────────────────────────────────── */
export default function DestinationsPage() {
  const [treatment, setTreatment] = useState("all");
  const [distance, setDistance] = useState("all");
  const [budget, setBudget] = useState("all");
  const [duration, setDuration] = useState("all");
  const [sort, setSort] = useState("distance");
  const [showFilters, setShowFilters] = useState(false);
  const [recoBannerDismissed, setRecoBannerDismissed] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [density, setDensity] = useState<"grid" | "list">("grid");
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [filtersHydrated, setFiltersHydrated] = useState(false);

  const { recommendation, loaded } = useRecommendation();

  /* ── Hydrate persisted state on mount ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(FILTERS_KEY);
      if (saved) {
        const f = JSON.parse(saved);
        if (f.treatment) setTreatment(f.treatment);
        if (f.distance) setDistance(f.distance);
        if (f.budget) setBudget(f.budget);
        if (f.duration) setDuration(f.duration);
        if (f.sort) setSort(f.sort);
        if (f.density === "grid" || f.density === "list") setDensity(f.density);
      }
    } catch {}

    try {
      const ds = localStorage.getItem(VIEW_DENSITY_KEY);
      if (ds === "grid" || ds === "list") setDensity(ds);
    } catch {}

    try {
      const recent = JSON.parse(
        localStorage.getItem(RECENT_VIEWED_KEY) || "[]",
      );
      if (Array.isArray(recent)) {
        // Filter out invalid IDs and dedupe
        const valid = recent.filter((id: string) =>
          DESTINATIONS.some((d) => d.id === id),
        );
        setRecentlyViewed(Array.from(new Set(valid)).slice(0, 3));
      }
    } catch {}

    setFiltersHydrated(true);
  }, []);

  /* ── Persist filters when they change (after hydration) ── */
  useEffect(() => {
    if (!filtersHydrated) return;
    try {
      localStorage.setItem(
        FILTERS_KEY,
        JSON.stringify({ treatment, distance, budget, duration, sort, density }),
      );
    } catch {}
  }, [treatment, distance, budget, duration, sort, density, filtersHydrated]);

  /* ── Persist density separately so it survives a filter reset ── */
  useEffect(() => {
    if (!filtersHydrated) return;
    try {
      localStorage.setItem(VIEW_DENSITY_KEY, density);
    } catch {}
  }, [density, filtersHydrated]);

  /* ── Smart defaults from recommendation (one-shot) ── */
  useEffect(() => {
    if (!loaded || !recommendation || !filtersHydrated) return;
    setSort((prev) => (prev === "distance" ? "relevance" : prev));
    if (recommendation.need && treatment === "all") {
      const primary = NEED_TO_TREATMENTS[recommendation.need]?.[0];
      if (primary) setTreatment(primary);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, recommendation, filtersHydrated]);

  /* ── Detect active preset for visual highlight ── */
  useEffect(() => {
    const match = INTENT_PRESETS.find(
      (p) =>
        p.filters.treatment === treatment &&
        p.filters.distance === distance &&
        p.filters.budget === budget &&
        p.filters.duration === duration,
    );
    setActivePreset(match?.key ?? null);
  }, [treatment, distance, budget, duration]);

  const filtered = useMemo(() => {
    const result = DESTINATIONS.filter((dest) => {
      if (treatment !== "all") {
        if (!dest.treatments?.some((t) => t.includes(treatment))) return false;
      }
      if (distance !== "all") {
        const km = dest.distanceKm ?? 999;
        if (distance === "near" && km >= 200) return false;
        if (distance === "mid" && (km < 200 || km > 500)) return false;
        if (distance === "far" && km <= 500) return false;
      }
      if (budget !== "all") {
        const cost = parseCost(dest.costFrom);
        if (budget === "low" && cost >= 5000) return false;
        if (budget === "mid" && (cost < 5000 || cost > 10000)) return false;
        if (budget === "high" && cost <= 10000) return false;
      }
      if (duration !== "all") {
        const days = parseDuration(dest.duration);
        const isDay = dest.duration?.includes("يوم واحد") || days === 1;
        if (duration === "day" && !isDay) return false;
        if (duration === "week" && (isDay || days > 7)) return false;
        if (duration === "long" && days <= 7) return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      if (sort === "relevance") {
        const diff =
          relevanceScore(b, recommendation) - relevanceScore(a, recommendation);
        if (diff !== 0) return diff;
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      }
      if (sort === "in-season") {
        const aIn = isInSeasonNow(a.bestMonths) ? 1 : 0;
        const bIn = isInSeasonNow(b.bestMonths) ? 1 : 0;
        if (aIn !== bIn) return bIn - aIn;
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      }
      if (sort === "distance")
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      if (sort === "cost") return parseCost(a.costFrom) - parseCost(b.costFrom);
      if (sort === "rating") return getRating(b.id) - getRating(a.id);
      if (sort === "duration")
        return parseDuration(a.duration) - parseDuration(b.duration);
      return a.name.localeCompare(b.name, "ar");
    });
  }, [treatment, distance, budget, duration, sort, recommendation]);

  const activeFilterCount =
    (treatment !== "all" ? 1 : 0) +
    (distance !== "all" ? 1 : 0) +
    (budget !== "all" ? 1 : 0) +
    (duration !== "all" ? 1 : 0);

  const inSeasonCount = filtered.filter((d) =>
    isInSeasonNow(d.bestMonths),
  ).length;

  const recentDestinations = recentlyViewed
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is DestinationFull => Boolean(d));

  /* ── Quick stats for the banner ── */
  const totalReviews = useMemo(() => {
    return Object.values(TESTIMONIALS_BY_DEST).reduce(
      (sum, list) => sum + list.length,
      0,
    );
  }, []);
  const environments = useMemo(() => {
    return new Set(DESTINATIONS.map((d) => d.environment)).size;
  }, []);

  function applyPreset(preset: (typeof INTENT_PRESETS)[number]) {
    setTreatment(preset.filters.treatment);
    setDistance(preset.filters.distance);
    setBudget(preset.filters.budget);
    setDuration(preset.filters.duration);
  }

  const resetAll = () => {
    setTreatment("all");
    setDistance("all");
    setBudget("all");
    setDuration("all");
  };

  return (
    <SiteLayout>
      <PageHero
        title="السياحة الاستشفائية في مصر"
        subtitle="7 وجهات علاجية طبيعية — من البحر الأحمر لصحاري سيوة وجبال سيناء"
      />

      <section className="py-10 md:py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-6xl mx-auto" dir="rtl">
          {/* ── Stats banner ── */}
          <Reveal>
            <div className="mb-6 grid grid-cols-3 gap-3 md:gap-6 text-center">
              <StatTile value={DESTINATIONS.length} label="وجهة استشفائية" />
              <StatTile value={environments} label="بيئة طبيعية" />
              <StatTile
                value={totalReviews}
                label="تجربة موثقة"
                accent
              />
            </div>
          </Reveal>

          {/* ── Recently viewed ── */}
          {recentDestinations.length > 0 && (
            <Reveal delay={0.05}>
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#12394d] dark:text-white flex items-center gap-2">
                    <span>👀</span>
                    <span>شفت مؤخراً</span>
                  </h3>
                  <button
                    onClick={() => {
                      setRecentlyViewed([]);
                      try {
                        localStorage.removeItem(RECENT_VIEWED_KEY);
                      } catch {}
                    }}
                    className="text-[11px] text-[#7b7c7d] hover:text-[#1d5770] dark:hover:text-[#91b149] hover:underline"
                  >
                    امسح السجل
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {recentDestinations.map((d) => (
                    <Link
                      key={d.id}
                      href={`/destination/${d.id}`}
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-white dark:bg-[#162033] border border-gray-200 dark:border-[#1e3a5f] rounded-full pl-3 pr-2 py-1.5 hover:border-[#1d5770] dark:hover:border-[#91b149] transition-colors no-underline"
                    >
                      <span className="text-lg">{d.envIcon}</span>
                      <span className="text-xs font-bold text-[#12394d] dark:text-white">
                        {d.name}
                      </span>
                      <span className="text-[#91b149] text-xs">←</span>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ── Intent presets — bundles of filters in one click ── */}
          <Reveal delay={0.08}>
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#7b7c7d] dark:text-white/60 mb-3 uppercase tracking-wider">
                اختار حسب احتياجك
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
                {INTENT_PRESETS.map((p) => {
                  const isActive = activePreset === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => applyPreset(p)}
                      className={`group relative flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-right transition-all ${
                        isActive
                          ? "shadow-lg scale-[1.02]"
                          : "hover:shadow-md hover:-translate-y-0.5"
                      }`}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${p.color}, ${p.color}dd)`
                          : undefined,
                        backgroundColor: isActive ? p.color : "white",
                        border: `1.5px solid ${
                          isActive ? p.color : `${p.color}33`
                        }`,
                      }}
                    >
                      <span
                        className={`flex-shrink-0 text-2xl ${
                          isActive ? "" : ""
                        }`}
                        aria-hidden
                      >
                        {p.icon}
                      </span>
                      <span
                        className={`text-xs md:text-sm font-display font-bold leading-tight ${
                          isActive ? "text-white" : "text-[#12394d]"
                        }`}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* ── Treatment filter ── */}
          <Reveal delay={0.1}>
            <div className="mb-5">
              <h3 className="text-base font-bold mb-3 text-[#12394d] dark:text-white flex items-center gap-2">
                <span>🩺</span>
                <span>أنت بتعاني من إيه؟</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {TREATMENT_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setTreatment(f.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                      treatment === f.key
                        ? "bg-[#1d5770] text-white border-[#1d5770] shadow-md"
                        : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 border-[#d1d5db] dark:border-[#1e3a5f] hover:border-[#1d5770] hover:text-[#1d5770]"
                    }`}
                  >
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Recommendation banner ── */}
          {loaded &&
            recommendation?.need &&
            !recoBannerDismissed &&
            treatment === NEED_TO_TREATMENTS[recommendation.need]?.[0] && (
              <Reveal delay={0.15}>
                <div className="mb-5 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#f0f7ed] dark:bg-[#91b149]/10 border border-[#91b149]/30">
                  <p className="text-xs md:text-sm text-[#12394d] dark:text-white">
                    <span aria-hidden="true">✦ </span>
                    فلترنا لك على{" "}
                    <strong className="text-[#91b149]">
                      {NEED_TO_TREATMENTS[recommendation.need]?.[0]}
                    </strong>{" "}
                    بناء على رحلتك
                  </p>
                  <button
                    onClick={() => {
                      setRecoBannerDismissed(true);
                      setTreatment("all");
                    }}
                    className="text-xs font-bold text-[#1d5770] dark:text-[#91b149] hover:underline whitespace-nowrap"
                  >
                    غيّر
                  </button>
                </div>
              </Reveal>
            )}

          {/* ── Advanced filters toggle + sort + view toggle ── */}
          <Reveal delay={0.18}>
            <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b border-[#d0dde4] dark:border-[#1e3a5f] flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d1d5db] dark:border-[#1e3a5f] hover:border-[#91b149] transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>فلاتر متقدمة</span>
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-[#91b149] text-white text-[10px] font-bold rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* View density toggle */}
                <div className="inline-flex items-center bg-white dark:bg-[#162033] border border-[#d1d5db] dark:border-[#1e3a5f] rounded-full p-1">
                  <button
                    onClick={() => setDensity("grid")}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                      density === "grid"
                        ? "bg-[#1d5770] text-white"
                        : "text-[#7b7c7d] hover:text-[#1d5770]"
                    }`}
                    aria-label="عرض شبكي"
                    title="عرض شبكي"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDensity("list")}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                      density === "list"
                        ? "bg-[#1d5770] text-white"
                        : "text-[#7b7c7d] hover:text-[#1d5770]"
                    }`}
                    aria-label="عرض قائمة"
                    title="عرض قائمة"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d1d5db] dark:border-[#1e3a5f] hover:border-[#91b149] transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </Reveal>

          {/* ── Advanced filters panel ── */}
          {showFilters && (
            <Reveal delay={0.2}>
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#7b7c7d] mb-2 block">
                    المسافة
                  </label>
                  <select
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d1d5db] dark:border-[#1e3a5f] focus:border-[#91b149] outline-none"
                  >
                    {DISTANCE_FILTERS.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#7b7c7d] mb-2 block">
                    الميزانية
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d1d5db] dark:border-[#1e3a5f] focus:border-[#91b149] outline-none"
                  >
                    {BUDGET_FILTERS.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#7b7c7d] mb-2 block">
                    المدة
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d1d5db] dark:border-[#1e3a5f] focus:border-[#91b149] outline-none"
                  >
                    {DURATION_FILTERS.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Reveal>
          )}

          {/* ── Stats line ── */}
          <Reveal delay={0.25}>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <p className="text-sm text-[#7b7c7d] dark:text-white/50">
                <span className="font-bold text-[#12394d] dark:text-white">
                  {filtered.length}
                </span>{" "}
                وجهة متاحة
                {inSeasonCount > 0 && filtered.length > 0 && (
                  <>
                    {" "}·{" "}
                    <span className="text-[#91b149] font-bold">
                      {inSeasonCount}
                    </span>{" "}
                    في موسمها دلوقتي ✨
                  </>
                )}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAll}
                  className="text-xs text-[#91b149] hover:underline font-bold"
                >
                  امسح الفلاتر
                </button>
              )}
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────────────────────
          Two render paths:
            · No filters active → full-bleed narrative chapters (default).
              The page reads like a journey: sea → mountain → oasis → desert.
            · Any filter active → flat grid/list of just the matches. We
              switch out of narrative because chapters with mixed/empty
              destinations break the storytelling. */}
      {activeFilterCount === 0 ? (
        <div className="bg-white dark:bg-[#0d1b2a]">
          {/* Sticky dot navigation — desktop only, jumps between chapters. */}
          <ChapterNav />
          {ENVIRONMENT_CHAPTERS.map((chapter, idx) => {
            const destsForChapter = filtered.filter((d) =>
              chapter.matchesEnvironment.includes(d.environment),
            );
            return (
              <EnvironmentChapter
                key={chapter.key}
                chapter={chapter}
                destinations={destsForChapter}
                index={idx}
              />
            );
          })}
        </div>
      ) : (
        <section className="py-10 md:py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]">
          <div className="max-w-6xl mx-auto" dir="rtl">
            {filtered.length > 0 ? (
              <div
                className={
                  density === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                    : "flex flex-col gap-3"
                }
              >
                {filtered.map((dest, i) => (
                  <Reveal key={dest.id} delay={Math.min(i * 0.06, 0.5)}>
                    <DestinationCard
                      dest={dest}
                      compact={density === "list"}
                      isRecommended={
                        !!recommendation &&
                        (dest.id === recommendation.destinationId ||
                          relevanceScore(dest, recommendation) >= 3)
                      }
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🏜️"
                title="ما لقيناش وجهات بالمواصفات دي"
                description="جرّب تعديل الفلاتر أو شيلها كلها عشان تشوف كل الوجهات المتاحة"
                action={
                  <button
                    onClick={resetAll}
                    className="px-6 py-3 rounded-full bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold text-sm hover:shadow-lg transition-all hover:scale-[1.03]"
                  >
                    امسح الفلاتر
                  </button>
                }
              />
            )}
          </div>
        </section>
      )}

      {/* ── Helper for the indecisive — bottom of page in either mode. */}
      {filtered.length > 0 && (
        <section className="bg-[#f5f8fa] dark:bg-[#0a151f] pb-16">
          <div className="max-w-6xl mx-auto px-4" dir="rtl">
            <Reveal delay={0.4}>
              <div className="text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f]">
                  <span className="text-2xl">🤔</span>
                  <p className="text-sm text-[#12394d] dark:text-white">
                    لسه مش متأكد؟
                  </p>
                  <Link
                    href="/symptoms"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold text-xs transition-colors no-underline"
                  >
                    جرّب فاحص الأعراض
                    <span>←</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

/* ── Sub-components ─────────────────────────────────────── */
function StatTile({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 md:p-5 ${
        accent
          ? "bg-gradient-to-br from-[#91b149] to-[#6a8435] text-white"
          : "bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f]"
      }`}
    >
      <div
        className={`font-display font-black text-2xl md:text-4xl leading-none ${
          accent ? "text-white" : "text-[#12394d] dark:text-white"
        }`}
      >
        {value}
      </div>
      <div
        className={`text-[11px] md:text-xs font-bold mt-1.5 ${
          accent ? "text-white/85" : "text-[#7b7c7d] dark:text-white/50"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
