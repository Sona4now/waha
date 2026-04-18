"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { CompareButton } from "@/components/site/ComparisonTray";
import Reveal from "@/components/site/Reveal";
import EmptyState from "@/components/site/EmptyState";
import { DESTINATIONS } from "@/data/siteData";

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

/* ── Component ──────────────────────────────────────────── */
export default function DestinationsPage() {
  const [treatment, setTreatment] = useState("all");
  const [distance, setDistance] = useState("all");
  const [budget, setBudget] = useState("all");
  const [duration, setDuration] = useState("all");
  const [sort, setSort] = useState("distance");
  const [showFilters, setShowFilters] = useState(false);

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
      if (sort === "distance") return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      if (sort === "cost") return parseCost(a.costFrom) - parseCost(b.costFrom);
      if (sort === "duration") return parseDuration(a.duration) - parseDuration(b.duration);
      return a.name.localeCompare(b.name, "ar");
    });

    return result;
  }, [treatment, distance, budget, duration, sort]);

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

          {/* ── Destinations grid ── */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((dest, i) => (
                <Reveal key={dest.id} delay={i * 0.08}>
                  <div className="relative group h-full">
                    <CompareButton id={dest.id} />
                    <Link
                      href={`/destination/${dest.id}`}
                      className="flex flex-col bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-2 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/40 h-full no-underline"
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={dest.image}
                          alt={`${dest.name} — وجهة استشفائية`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Environment badge */}
                        <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full text-white bg-[#91b149] shadow-lg">
                          {dest.envIcon} {dest.environment}
                        </span>

                        {/* Distance chip (left) */}
                        {dest.distanceKm !== undefined && (
                          <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-black/50 backdrop-blur-sm">
                            📍 {dest.distanceKm} كم
                          </span>
                        )}

                        {/* Name overlay at bottom */}
                        <div className="absolute bottom-3 right-4 left-4">
                          <h3 className="text-2xl font-bold text-white font-display drop-shadow-md">
                            {dest.name}
                          </h3>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex-1 flex flex-col">
                        {/* Pitch line */}
                        {dest.pitch ? (
                          <p className="text-sm font-bold text-[#12394d] dark:text-white leading-snug mb-3 line-clamp-2">
                            ✨ {dest.pitch}
                          </p>
                        ) : (
                          <p className="text-sm leading-relaxed mb-3 line-clamp-2 text-[#7b7c7d] dark:text-white/60">
                            {dest.description}
                          </p>
                        )}

                        {/* Quick facts bar */}
                        <div className="flex items-center gap-3 mb-4 text-[10px] text-[#7b7c7d] dark:text-white/50 flex-wrap">
                          {dest.duration && (
                            <span className="inline-flex items-center gap-1">
                              ⏱️ {dest.duration}
                            </span>
                          )}
                          {dest.costFrom && (
                            <span className="inline-flex items-center gap-1">
                              💰 {dest.costFrom}
                            </span>
                          )}
                          {dest.difficulty && (
                            <span className="inline-flex items-center gap-1">
                              ⭐ {dest.difficulty}
                            </span>
                          )}
                        </div>

                        {/* Treatments */}
                        {dest.treatments && dest.treatments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {dest.treatments.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f7ed] dark:bg-[#91b149]/15 text-[#91b149] font-bold"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* View details CTA */}
                        <div className="mt-4 pt-4 border-t border-[#d0dde4] dark:border-[#1e3a5f] flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1d5770] dark:text-[#91b149]">
                            اكتشف المزيد
                          </span>
                          <span className="text-[#1d5770] dark:text-[#91b149] group-hover:-translate-x-1 transition-transform">
                            ←
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
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
