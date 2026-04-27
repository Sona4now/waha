"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { DESTINATIONS, type DestinationFull } from "@/data/siteData";
import { localizeDestination } from "@/lib/localize";
import { showToast } from "./Toast";
import { useTranslations } from "./LocaleProvider";

const STORAGE_KEY = "waaha_comparison";
const MAX_ITEMS = 3;

// Custom event to notify changes
const CHANGE_EVENT = "waaha_comparison_change";

export function useComparison() {
  const { locale } = useTranslations();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setIds(JSON.parse(saved));
    } catch {}

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      setIds(detail);
    };
    window.addEventListener(CHANGE_EVENT, onChange as EventListener);
    return () =>
      window.removeEventListener(CHANGE_EVENT, onChange as EventListener);
  }, []);

  const persist = useCallback((newIds: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    window.dispatchEvent(
      new CustomEvent(CHANGE_EVENT, { detail: newIds }) as Event
    );
    setIds(newIds);
  }, []);

  const add = useCallback(
    (id: string) => {
      if (ids.includes(id)) return;
      if (ids.length >= MAX_ITEMS) {
        showToast(
          locale === "en"
            ? "Maximum 3 destinations to compare"
            : "الحد الأقصى 3 وجهات للمقارنة",
          "warning"
        );
        return;
      }
      const rawDest = DESTINATIONS.find((d) => d.id === id);
      persist([...ids, id]);
      if (rawDest) {
        const dest = localizeDestination(rawDest, locale);
        showToast(
          locale === "en"
            ? `Added ${dest.name} to comparison ✓`
            : `تمت إضافة ${dest.name} للمقارنة ✓`,
          "success"
        );
      }
    },
    [ids, persist, locale]
  );

  const remove = useCallback(
    (id: string) => {
      persist(ids.filter((x) => x !== id));
    },
    [ids, persist]
  );

  const toggle = useCallback(
    (id: string) => {
      if (ids.includes(id)) {
        remove(id);
      } else {
        add(id);
      }
    },
    [ids, add, remove]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, add, remove, toggle, clear, has, count: ids.length };
}

const HIDDEN_PATHS = ["/", "/gate", "/compare"];

export default function ComparisonTray() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useTranslations();
  const { ids, remove, clear } = useComparison();

  if (HIDDEN_PATHS.includes(pathname)) return null;
  if (ids.length === 0) return null;

  const destinations = ids
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is DestinationFull => Boolean(d))
    .map((d) => localizeDestination(d, locale));

  function goToCompare() {
    const query = ids.join(",");
    router.push(`/compare?ids=${query}`);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        dir={locale === "en" ? "ltr" : "rtl"}
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[95%] max-w-2xl"
      >
        <div className="bg-white/95 dark:bg-[#0d1b2a]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-12px_rgba(29,87,112,0.35)] border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Label */}
            <div className="hidden sm:flex flex-col items-start flex-shrink-0 border-l border-[#d0dde4] dark:border-[#1e3a5f] pl-3">
              <span className="text-[10px] text-[#7b7c7d] uppercase tracking-wider">
                {locale === "en" ? "Compare" : "المقارنة"}
              </span>
              <span className="text-sm font-bold text-[#12394d] dark:text-white">
                {ids.length} / {MAX_ITEMS}
              </span>
            </div>

            {/* Items */}
            <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar min-w-0">
              <AnimatePresence mode="popLayout">
                {destinations.map((d) => (
                  <motion.div
                    key={d.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex items-center gap-2 bg-[#f5f8fa] dark:bg-[#162033] rounded-full pl-1 pr-3 py-1 flex-shrink-0 group"
                  >
                    <div
                      className="w-7 h-7 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-[#0d1b2a]"
                      style={{ backgroundImage: `url('${d.image}')` }}
                    />
                    <span className="text-xs font-semibold text-[#12394d] dark:text-white whitespace-nowrap">
                      {d.name}
                    </span>
                    <button
                      onClick={() => remove(d.id)}
                      className="w-4 h-4 rounded-full bg-[#d0dde4] dark:bg-[#1e3a5f] hover:bg-red-500 dark:hover:bg-red-500 text-[#7b7c7d] hover:text-white flex items-center justify-center transition-colors group-hover:bg-red-100 dark:group-hover:bg-red-900/40"
                      aria-label={locale === "en" ? `Remove ${d.name}` : `إزالة ${d.name}`}
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty slots */}
              {Array.from({ length: MAX_ITEMS - ids.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-7 h-7 rounded-full border-2 border-dashed border-[#d0dde4] dark:border-[#1e3a5f] flex-shrink-0"
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={clear}
                className="w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-[#7b7c7d] hover:text-red-500 flex items-center justify-center transition-colors"
                title={locale === "en" ? "Clear all" : "مسح الكل"}
                aria-label={locale === "en" ? "Clear all" : "مسح الكل"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button
                onClick={goToCompare}
                disabled={ids.length < 2}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all duration-300 ${
                  ids.length >= 2
                    ? "bg-gradient-to-l from-[#91b149] to-[#6a8435] hover:shadow-[0_8px_20px_-4px_rgba(145,177,73,0.5)] hover:scale-105 text-white"
                    : "bg-[#f5f8fa] dark:bg-[#162033] text-[#7b7c7d] cursor-not-allowed"
                }`}
              >
                {ids.length >= 2 ? (
                  <>
                    {locale === "en" ? "Compare now" : "قارن الآن"}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                ) : locale === "en" ? (
                  `Pick ${2 - ids.length}+`
                ) : (
                  `اختر ${2 - ids.length}+`
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Compact "Add to compare" button for destination cards
export function CompareButton({ id }: { id: string }) {
  const { locale } = useTranslations();
  const { has, toggle, count } = useComparison();
  const isAdded = has(id);
  const isFull = count >= MAX_ITEMS && !isAdded;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isFull) return;
    toggle(id);
  }

  // Desktop hover-expand: the button starts at 36px (icon only) and widens
  // to ~92px on group hover revealing a "قارن" label. A plain `+` glyph was
  // ambiguous — users didn't know it meant "compare". The balance/scale
  // icon + label makes the affordance unmistakable at first glance.
  return (
    <button
      onClick={handleClick}
      disabled={isFull}
      className={`absolute top-3 left-3 z-10 h-9 rounded-full flex items-center justify-center gap-1.5 overflow-hidden transition-all duration-300 backdrop-blur-md w-9 px-0 md:group-hover:w-[92px] md:group-hover:px-3 ${
        isAdded
          ? "bg-[#91b149] text-white scale-110 shadow-lg md:group-hover:scale-100 md:group-hover:w-[108px]"
          : isFull
            ? "bg-black/40 text-white/40 cursor-not-allowed"
            : "bg-white/90 dark:bg-[#0d1b2a]/90 text-[#1d5770] dark:text-white md:group-hover:bg-[#91b149] md:group-hover:text-white"
      }`}
      title={
        isAdded
          ? locale === "en"
            ? "Remove from comparison"
            : "إزالة من المقارنة"
          : isFull
            ? locale === "en"
              ? "Maximum 3 destinations"
              : "الحد الأقصى 3 وجهات"
            : locale === "en"
              ? "Add to comparison"
              : "أضف للمقارنة"
      }
      aria-label={
        isAdded
          ? locale === "en"
            ? "Remove from comparison"
            : "إزالة من المقارنة"
          : locale === "en"
            ? "Add to comparison"
            : "أضف للمقارنة"
      }
    >
      {isAdded ? (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="hidden md:group-hover:inline text-[11px] font-bold whitespace-nowrap">
            {locale === "en" ? "Added" : "مُضاف"}
          </span>
        </>
      ) : (
        <>
          {/* Balance / scales-of-justice icon = "compare". Recognizable in RTL. */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v18" />
            <path d="M5 7h14" />
            <path d="M8 7l-3 7a3 3 0 0 0 6 0L8 7" />
            <path d="M16 7l-3 7a3 3 0 0 0 6 0l-3-7" />
          </svg>
          <span className="hidden md:group-hover:inline text-[11px] font-bold whitespace-nowrap">
            {locale === "en" ? "Compare" : "قارن"}
          </span>
        </>
      )}
    </button>
  );
}
