"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPricing, type Tier, type Package } from "@/data/pricingPackages";

interface Props {
  destinationId: string;
  destinationName: string;
  /** Scrolls to the lead form when "احجز" is clicked. Caller passes the
   *  selector of the form section. */
  bookCtaTarget?: string;
}

const TIER_META: Record<Tier, { label: string; color: string; bg: string; ring: string }> = {
  basic: {
    label: "أساسي",
    color: "text-[#1d5770]",
    bg: "bg-[#f5f8fa] dark:bg-[#162033]",
    ring: "ring-gray-200 dark:ring-[#1e3a5f]",
  },
  standard: {
    label: "موصى به ⭐",
    color: "text-white",
    bg: "bg-gradient-to-br from-[#1d5770] to-[#12394d]",
    ring: "ring-[#91b149] ring-2",
  },
  premium: {
    label: "متكامل",
    color: "text-[#92400e] dark:text-[#fcd34d]",
    bg: "bg-[#FEF9EB] dark:bg-[#92400e]/20",
    ring: "ring-[#d97706]/40",
  },
};

function formatEGP(amount: number): string {
  // 8500 → "8,500"
  return amount.toLocaleString("en-US");
}

/**
 * Pull a numeric night-count out of a free-form duration string. We use
 * this to compute a per-night price for the "psychological framing"
 * trick — 8,500 ج total feels expensive; 1,700 ج/ليلة feels reasonable.
 *
 * Examples handled:
 *   "5 أيام / 4 ليالي" → 4
 *   "10 أيام / 9 ليالي" → 9
 *   "يومين / ليلة"     → 1
 *   "يوم واحد"         → 0 (return null, no per-night meaningful)
 *   "نصف يوم"          → null
 */
function extractNights(duration: string): number | null {
  // Arabic-Indic digits → ASCII so the regex catches them.
  const ascii = duration.replace(/[٠-٩]/g, (d) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(d)),
  );
  // Match "X ليلة" or "X ليالي".
  const m = ascii.match(/(\d+)\s*ليال?ي?ة?/);
  if (m) {
    const n = parseInt(m[1], 10);
    return n > 0 ? n : null;
  }
  // "ليلة" with no number = 1
  if (/ليلة/.test(duration)) return 1;
  return null;
}

/**
 * Rough breakdown of where the price goes — calibrated against typical
 * package compositions for healing tourism in Egypt. Used purely for
 * visualisation: bars that show ~60% accommodation, ~25% treatment,
 * ~15% transport+meals.
 *
 * The numbers shift slightly per tier (premium has more treatment %).
 */
function breakdownFor(tier: "basic" | "standard" | "premium"): {
  label: string;
  percent: number;
  color: string;
}[] {
  if (tier === "premium") {
    return [
      { label: "الإقامة", percent: 50, color: "#1d5770" },
      { label: "العلاج والإشراف الطبي", percent: 30, color: "#91b149" },
      { label: "الأكل والمواصلات", percent: 20, color: "#d97706" },
    ];
  }
  if (tier === "standard") {
    return [
      { label: "الإقامة", percent: 55, color: "#1d5770" },
      { label: "العلاج", percent: 25, color: "#91b149" },
      { label: "الأكل والمواصلات", percent: 20, color: "#d97706" },
    ];
  }
  return [
    { label: "الإقامة", percent: 60, color: "#1d5770" },
    { label: "العلاج", percent: 20, color: "#91b149" },
    { label: "الأكل والمواصلات", percent: 20, color: "#d97706" },
  ];
}

export default function PricingPackages({
  destinationId,
  destinationName,
  bookCtaTarget = "#lead-capture",
}: Props) {
  const pricing = getPricing(destinationId);
  const [openTier, setOpenTier] = useState<Tier | null>(null);

  if (!pricing || pricing.packages.length === 0) return null;

  function handleBook(tier: Tier) {
    if (typeof window === "undefined") return;
    // Stash the chosen tier so the lead form can pre-fill ملاحظات
    try {
      sessionStorage.setItem("waaha_chosen_tier", tier);
    } catch {}
    const target = document.querySelector(bookCtaTarget);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-[#0a151f]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-[#91b149] uppercase tracking-wider mb-3">
            الأسعار والباقات
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-black text-[#12394d] dark:text-white mb-3">
            اختر اللي يناسبك في {destinationName}
          </h2>
          <p className="text-[#7b7c7d] dark:text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ٣ باقات مختلفة — من تجربة قصيرة لبرنامج علاجي كامل. كل الأسعار شاملة
            الإقامة والوجبات والعلاج. مفيش مفاجآت في الفاتورة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {pricing.packages.map((pkg) => (
            <PackageCard
              key={pkg.tier}
              pkg={pkg}
              isOpen={openTier === pkg.tier}
              onToggleDetails={() =>
                setOpenTier(openTier === pkg.tier ? null : pkg.tier)
              }
              onBook={() => handleBook(pkg.tier)}
            />
          ))}
        </div>

        {pricing.note && (
          <p className="mt-6 text-center text-xs text-[#7b7c7d] dark:text-white/50 italic max-w-2xl mx-auto leading-relaxed">
            {pricing.note}
          </p>
        )}
      </div>
    </section>
  );
}

function PackageCard({
  pkg,
  isOpen,
  onToggleDetails,
  onBook,
}: {
  pkg: Package;
  isOpen: boolean;
  onToggleDetails: () => void;
  onBook: () => void;
}) {
  const meta = TIER_META[pkg.tier];
  const isFeatured = pkg.tier === "standard";

  return (
    <div
      className={`relative flex flex-col rounded-3xl ${meta.bg} ring-1 ${meta.ring} ${
        isFeatured ? "md:scale-105 shadow-[0_20px_60px_-15px_rgba(29,87,112,0.4)]" : ""
      } transition-all overflow-hidden`}
    >
      {/* Tier label */}
      <div className="px-6 pt-6 pb-2">
        <span
          className={`inline-block text-[11px] font-bold ${meta.color} uppercase tracking-wider mb-1`}
        >
          {meta.label}
        </span>
        <h3
          className={`font-display text-2xl font-black ${
            isFeatured ? "text-white" : "text-[#12394d] dark:text-white"
          }`}
        >
          {pkg.name}
        </h3>
        <p
          className={`text-xs mt-1 ${
            isFeatured ? "text-white/70" : "text-[#7b7c7d] dark:text-white/60"
          }`}
        >
          {pkg.duration}
        </p>
      </div>

      {/* Price */}
      <div className="px-6 py-4">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-display text-4xl font-black ${
              isFeatured ? "text-white" : "text-[#12394d] dark:text-white"
            }`}
          >
            {formatEGP(pkg.pricePerPerson)}
          </span>
          <span
            className={`text-sm font-bold ${
              isFeatured ? "text-white/70" : "text-[#7b7c7d] dark:text-white/60"
            }`}
          >
            ج / للشخص
          </span>
        </div>
        {/* Per-night reframing — total prices feel large, per-night
            prices feel like everyday lifestyle decisions. */}
        {(() => {
          const nights = extractNights(pkg.duration);
          if (nights && nights > 0) {
            const perNight = Math.round(pkg.pricePerPerson / nights);
            return (
              <div
                className={`mt-1 text-xs ${
                  isFeatured
                    ? "text-[#91b149]"
                    : "text-[#1d5770] dark:text-[#91b149]"
                }`}
              >
                ≈ {formatEGP(perNight)} ج / ليلة
              </div>
            );
          }
          return null;
        })()}
        <p
          className={`text-xs mt-2 leading-relaxed ${
            isFeatured ? "text-white/80" : "text-[#7b7c7d] dark:text-white/60"
          }`}
        >
          {pkg.highlight}
        </p>

        {/* Cost breakdown bar — shows accommodation/treatment/meals
            split as a stacked bar. Helps the user understand "where
            does my money go" without reading bullet points. */}
        <div className="mt-3">
          <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
            {breakdownFor(pkg.tier).map((b) => (
              <div
                key={b.label}
                className="h-full"
                style={{
                  width: `${b.percent}%`,
                  backgroundColor: b.color,
                }}
                title={`${b.label} — ${b.percent}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {breakdownFor(pkg.tier).map((b) => (
              <span
                key={b.label}
                className={`text-[10px] inline-flex items-center gap-1 ${
                  isFeatured ? "text-white/70" : "text-[#7b7c7d] dark:text-white/60"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: b.color }}
                  aria-hidden
                />
                {b.label} {b.percent}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Includes */}
      <div className="px-6 pb-4 flex-1">
        <p
          className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${
            isFeatured ? "text-[#91b149]" : "text-[#1d5770] dark:text-[#91b149]"
          }`}
        >
          يشمل
        </p>
        <ul className="space-y-2">
          {pkg.includes.slice(0, 4).map((item, i) => (
            <li
              key={i}
              className={`flex items-start gap-2 text-sm ${
                isFeatured ? "text-white/90" : "text-[#12394d] dark:text-white/80"
              }`}
            >
              <span
                className={`flex-shrink-0 mt-0.5 ${
                  isFeatured ? "text-[#91b149]" : "text-[#91b149]"
                }`}
              >
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 mt-2">
                {pkg.includes.slice(4).map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-sm ${
                      isFeatured ? "text-white/90" : "text-[#12394d] dark:text-white/80"
                    }`}
                  >
                    <span className="text-[#91b149] flex-shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {pkg.notIncluded && pkg.notIncluded.length > 0 && (
                <>
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wider mt-4 mb-2 ${
                      isFeatured ? "text-white/50" : "text-[#7b7c7d]"
                    }`}
                  >
                    غير شامل
                  </p>
                  <ul className="space-y-1.5">
                    {pkg.notIncluded.map((item, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2 text-xs ${
                          isFeatured ? "text-white/50" : "text-[#7b7c7d] dark:text-white/40"
                        }`}
                      >
                        <span className="flex-shrink-0 mt-0.5 opacity-60">×</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {pkg.includes.length > 4 && (
          <button
            onClick={onToggleDetails}
            className={`mt-3 text-xs font-bold underline-offset-2 ${
              isFeatured
                ? "text-[#91b149] hover:underline"
                : "text-[#1d5770] dark:text-[#91b149] hover:underline"
            }`}
          >
            {isOpen ? "إخفاء التفاصيل" : "عرض كل التفاصيل ←"}
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <button
          onClick={onBook}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-display font-bold transition-all ${
            isFeatured
              ? "bg-[#91b149] hover:bg-[#a3c45a] text-[#12394d]"
              : "bg-[#1d5770] hover:bg-[#174860] text-white dark:bg-[#91b149] dark:text-[#12394d] dark:hover:bg-[#a3c45a]"
          }`}
        >
          احجز الآن ←
        </button>
      </div>
    </div>
  );
}
