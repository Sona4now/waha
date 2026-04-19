"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TREATMENT_CHIPS = [
  { key: "مفاصل", label: "مفاصل", icon: "🦴" },
  { key: "جلد", label: "جلد", icon: "🧴" },
  { key: "تنفس", label: "تنفس", icon: "🫁" },
  { key: "توتر", label: "توتر", icon: "🧠" },
  { key: "استرخاء", label: "استرخاء", icon: "🧘" },
] as const;

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  treatmentFilter: string | null;
  onFilterChange: (f: string | null) => void;
  /** Called when the search input gets focus — parent can collapse overlays etc. */
  onSearchFocus?: () => void;
}

/**
 * Floating top toolbar for the map — houses the search field and a
 * horizontal row of treatment filter chips.
 *
 * Positioned below the site nav (72px) and respects iOS safe areas.
 * Uses glass-morphism so the map stays visible behind it.
 */
export default function MapToolbar({
  searchQuery,
  onSearchChange,
  treatmentFilter,
  onFilterChange,
  onSearchFocus,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilter = treatmentFilter !== null;
  const hasQuery = searchQuery.length > 0;

  return (
    <div
      className="absolute z-[999] pointer-events-none"
      dir="rtl"
      style={{
        top: "calc(env(safe-area-inset-top) + 80px)",
        // Leave room on right/left for zoom + style switcher (44px + margins = ~60px).
        right: "68px",
        left: "68px",
      }}
    >
      <div className="pointer-events-auto flex flex-col gap-2 items-stretch max-w-md mx-auto">
        {/* Search pill */}
        <div className="relative flex items-center bg-[#12394d]/92 backdrop-blur-xl border border-white/15 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] overflow-hidden">
          <span
            className="flex-shrink-0 pr-3 pl-1 text-white/60"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            placeholder="ابحث عن وجهة أو موقع علاجي…"
            aria-label="ابحث في الخريطة"
            className="flex-1 bg-transparent text-white text-xs font-bold placeholder:text-white/45 focus:outline-none py-2.5 pr-0 pl-3 min-w-0"
          />
          {hasQuery && (
            <button
              onClick={() => onSearchChange("")}
              aria-label="مسح البحث"
              className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors ml-1"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "إخفاء الفلاتر" : "فلاتر العلاج"}
            className={`flex-shrink-0 flex items-center gap-1 px-3 h-9 ml-1 mr-1 rounded-full text-[11px] font-bold transition-colors ${
              hasActiveFilter
                ? "bg-[#91b149] text-[#0a0f14]"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="hidden xs:inline">
              {hasActiveFilter ? treatmentFilter : "فلتر"}
            </span>
          </button>
        </div>

        {/* Filter chip row */}
        <AnimatePresence>
          {(expanded || hasActiveFilter) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5"
              role="group"
              aria-label="فلاتر العلاج"
            >
              <button
                onClick={() => onFilterChange(null)}
                aria-pressed={!hasActiveFilter}
                className={`flex-shrink-0 inline-flex items-center gap-1 px-3 h-8 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  !hasActiveFilter
                    ? "bg-[#91b149] text-[#0a0f14] shadow-md"
                    : "bg-[#12394d]/92 backdrop-blur-md border border-white/15 text-white/80 hover:bg-[#12394d]"
                }`}
              >
                <span>✨</span>
                <span>الكل</span>
              </button>
              {TREATMENT_CHIPS.map((c) => (
                <button
                  key={c.key}
                  onClick={() =>
                    onFilterChange(treatmentFilter === c.key ? null : c.key)
                  }
                  aria-pressed={treatmentFilter === c.key}
                  className={`flex-shrink-0 inline-flex items-center gap-1 px-3 h-8 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                    treatmentFilter === c.key
                      ? "bg-[#91b149] text-[#0a0f14] shadow-md"
                      : "bg-[#12394d]/92 backdrop-blur-md border border-white/15 text-white/80 hover:bg-[#12394d]"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
