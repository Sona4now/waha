"use client";

import { useEffect, useMemo, useState } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import EmptyState from "@/components/site/EmptyState";
import DestinationCard from "@/components/site/DestinationCard";
import { DESTINATIONS, type DestinationFull } from "@/data/siteData";
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
  { key: "distance", label: "الأقرب أولاً" },
  { key: "cost", label: "الأرخص أولاً" },
  { key: "duration", label: "الأقصر أولاً" },
  { key: "name", label: "الترتيب الأبجدي" },
];

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

/**
 * Higher score = more relevant to the user's stored recommendation.
 *   · +10 if this destination IS the one the intro matched
 *   · +3 per treatment overlap with the need's treatment set
 *   · +2 for environment match (normalizes "mountains" ↔ "mountain")
 * Returns 0 when no recommendation exists (sort becomes a stable no-op).
 */
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

/* ── Component ──────────────────────────────────────────── */
export default function DestinationsPage() {
  const [treatment, setTreatment] = useState("all");
  const [distance, setDistance] = useState("all");
  const [budget, setBudget] = useState("all");
  const [duration, setDuration] = useState("all");
  const [sort, setSort] = useState("distance");
  const [showFilters, setShowFilters] = useState(false);
  const [recoBannerDismissed, setRecoBannerDismissed] = useState(false);

  // Reads /public intro outcome from localStorage (client-only).
  // `loaded` goes true on the first client effect — before that, we render
  // the default "distance" sort and no banner. Avoids hydration mismatch.
  const { recommendation, loaded } = useRecommendation();

  // One-shot: apply smart defaults once the recommendation hydrates.
  // Intentionally narrow deps → fires once per load, never overrides a
  // user's manual filter/sort change.
  useEffect(() => {
    if (!loaded || !recommendation) return;
    setSort((prev) => (prev === "distance" ? "relevance" : prev));
    if (recommendation.need && treatment === "all") {
      const primary = NEED_TO_TREATMENTS[recommendation.need]?.[0];
      if (primary) setTreatment(primary);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, recommendation]);

  const filtered = useMemo(() => {
    let result = DESTINATIONS.filter((dest) => {
      // Treatment filter
      if (treatment !== "all") {
        if (!dest.treatments?.some((t) => t.includes(treatment))) return false;
      }

      // Distance filter
      if (distance !== "all") {
        const km = dest.distanceKm ?? 999;
        if (distance === "near" && km >= 200) return false;
        if (distance === "mid" && (km < 200 || km > 500)) return false;
        if (distance === "far" && km <= 500) return false;
      }

      // Budget filter
      if (budget !== "all") {
        const cost = parseCost(dest.costFrom);
        if (budget === "low" && cost >= 5000) return false;
        if (budget === "mid" && (cost < 5000 || cost > 10000)) return false;
        if (budget === "high" && cost <= 10000) return false;
      }

      // Duration filter
      if (duration !== "all") {
        const days = parseDuration(dest.duration);
        const isDay = dest.duration?.includes("يوم واحد") || days === 1;
        if (duration === "day" && !isDay) return false;
        if (duration === "week" && (isDay || days > 7)) return false;
        if (duration === "long" && days <= 7) return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sort === "relevance") {
        const diff =
          relevanceScore(b, recommendation) - relevanceScore(a, recommendation);
        if (diff !== 0) return diff;
        // Stable tiebreak — nearer first.
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      }
      if (sort === "distance") return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      if (sort === "cost") return parseCost(a.costFrom) - parseCost(b.costFrom);
      if (sort === "duration") return parseDuration(a.duration) - parseDuration(b.duration);
      return a.name.localeCompare(b.name, "ar");
    });

    return result;
  }, [treatment, distance, budget, duration, sort, recommendation]);

  const activeFilterCount =
    (treatment !== "all" ? 1 : 0) +
    (distance !== "all" ? 1 : 0) +
    (budget !== "all" ? 1 : 0) +
    (duration !== "all" ? 1 : 0);

  const resetAll = () => {
    setTreatment("all");
    setDistance("all");
    setBudget("all");
    setDuration("all");
  };

  return (
    <SiteLayout>
      <PageHero
        title="الأماكن الاستشفائية"
        subtitle="اكتشف وجهات الشفاء الطبيعية في قلب مصر"
      />

      <section className="py-10 md:py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-6xl mx-auto" dir="rtl">
          {/* ── Primary treatment filter (always visible) ── */}
          <Reveal>
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

          {/* ── Recommendation banner — shows only when we actually applied
                 the smart default so the user knows why a chip is pre-selected.
                 Auto-hides if they pick a different treatment manually. ── */}
          {loaded &&
            recommendation?.need &&
            !recoBannerDismissed &&
            treatment === NEED_TO_TREATMENTS[recommendation.need]?.[0] && (
              <Reveal delay={0.05}>
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

          {/* ── Advanced filters toggle ── */}
          <Reveal delay={0.1}>
            <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b border-[#d0dde4] dark:border-[#1e3a5f]">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d1d5db] dark:border-[#1e3a5f] hover:border-[#91b149] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>فلاتر متقدمة</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-[#91b149] text-white text-[10px] font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7b7c7d] dark:text-white/50 hidden sm:block">
                  ترتيب:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-[#162033] text-[#12394d] dark:text-white border border-[#d1d5db] dark:border-[#1e3a5f] cursor-pointer focus:outline-none focus:border-[#91b149]"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Reveal>

          {/* ── Advanced filters panel ── */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 p-5 bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] rounded-2xl">
              {/* Distance */}
              <div>
                <h4 className="text-xs font-bold mb-2 text-[#12394d] dark:text-white flex items-center gap-1.5">
                  <span>📍</span>
                  <span>المسافة من القاهرة</span>
                </h4>
                <div className="flex flex-col gap-1.5">
                  {DISTANCE_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setDistance(f.key)}
                      className={`text-right px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        distance === f.key
                          ? "bg-[#91b149]/15 text-[#91b149]"
                          : "text-[#7b7c7d] dark:text-white/50 hover:bg-[#f5f8fa] dark:hover:bg-[#0a151f]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <h4 className="text-xs font-bold mb-2 text-[#12394d] dark:text-white flex items-center gap-1.5">
                  <span>💰</span>
                  <span>الميزانية</span>
                </h4>
                <div className="flex flex-col gap-1.5">
                  {BUDGET_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setBudget(f.key)}
                      className={`text-right px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        budget === f.key
                          ? "bg-[#91b149]/15 text-[#91b149]"
                          : "text-[#7b7c7d] dark:text-white/50 hover:bg-[#f5f8fa] dark:hover:bg-[#0a151f]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h4 className="text-xs font-bold mb-2 text-[#12394d] dark:text-white flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>مدة الرحلة</span>
                </h4>
                <div className="flex flex-col gap-1.5">
                  {DURATION_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setDuration(f.key)}
                      className={`text-right px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        duration === f.key
                          ? "bg-[#91b149]/15 text-[#91b149]"
                          : "text-[#7b7c7d] dark:text-white/50 hover:bg-[#f5f8fa] dark:hover:bg-[#0a151f]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Results count ── */}
          <Reveal delay={0.15}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[#7b7c7d] dark:text-white/50">
                <span className="font-bold text-[#12394d] dark:text-white">
                  {filtered.length}
                </span>{" "}
                وجهة متاحة
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

          {/* ── Destinations grid ──
               Mobile (1 col): horizontal cards, tighter gap.
               Desktop (2-3 cols): vertical cards, original gap. */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filtered.map((dest, i) => (
                <Reveal key={dest.id} delay={i * 0.06}>
                  <DestinationCard
                    dest={dest}
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
    </SiteLayout>
  );
}
