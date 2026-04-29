"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TESTIMONIALS_BY_DEST,
  type Testimonial,
} from "@/data/testimonials";
import { TESTIMONIALS_EN } from "@/data/translations/testimonials.en";
import { useTranslations } from "@/components/site/LocaleProvider";

interface Props {
  destId: string;
  destName: string;
}

/**
 * Per-destination testimonials block with condition filter + aggregate rating.
 */
export default function Testimonials({ destId, destName }: Props) {
  const { locale } = useTranslations();
  const rawList = TESTIMONIALS_BY_DEST[destId] || [];
  // Overlay English translations on top of the Arabic source so quote/role/
  // condition/duration switch with the locale. Names stay as-is.
  const all = useMemo(() => {
    if (locale !== "en") return rawList;
    const enMap = TESTIMONIALS_EN[destId] ?? {};
    return rawList.map((t) => {
      const en = enMap[t.name];
      if (!en) return t;
      return {
        ...t,
        quote: en.quote ?? t.quote,
        role: en.role ?? t.role,
        condition: en.condition ?? t.condition,
        duration: en.duration ?? t.duration,
      };
    });
  }, [rawList, locale, destId]);

  const [activeCondition, setActiveCondition] = useState<string>("all");

  const conditions = useMemo(() => {
    const set = new Set<string>();
    all.forEach((t) => {
      if (t.condition) set.add(t.condition);
    });
    return Array.from(set);
  }, [all]);

  const filtered = useMemo(() => {
    if (activeCondition === "all") return all;
    return all.filter(
      (t) =>
        t.condition?.includes(activeCondition) ||
        // Soft match — if user's "need" is "جلد", match condition like
        // "صدفية مزمنة" because صدفية is a skin condition.
        (activeCondition === "جلد" &&
          /صدفية|جلد|إكزيما/.test(t.condition || "")) ||
        (activeCondition === "مفاصل" &&
          /مفاصل|روماتيزم|ظهر/.test(t.condition || "")) ||
        (activeCondition === "تنفس" &&
          /ربو|حساسية|تنفس/.test(t.condition || "")) ||
        (activeCondition === "استرخاء" &&
          /قلق|توتر|نفسي|إجهاد/.test(t.condition || "")),
    );
  }, [all, activeCondition]);

  if (all.length === 0) return null;

  // Aggregate stats for the banner
  const avgRating = all.reduce((s, t) => s + t.rating, 0) / all.length;
  const matchedCount =
    activeCondition === "all" ? null : filtered.length;

  return (
    <section
      id="testimonials"
      className="py-16 bg-white dark:bg-[#0d1b2a]"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header + aggregate */}
        <div className="text-center mb-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
            {locale === "en" ? "Real experiences" : "تجارب حقيقية"}
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#12394d] dark:text-white mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {locale === "en"
              ? `Visitors who came to ${destName} before you`
              : `ناس زارت ${destName} قبلك`}
          </h2>
          <div className="inline-flex items-center gap-3 bg-[#f5f8fa] dark:bg-[#162033] rounded-full px-4 py-2 text-sm">
            <span className="text-[#91b149] font-bold">
              {"★".repeat(Math.round(avgRating))}
              <span className="text-[#d0dde4] dark:text-[#1e3a5f]">
                {"★".repeat(5 - Math.round(avgRating))}
              </span>
            </span>
            <span className="text-[#12394d] dark:text-white font-bold">
              {avgRating.toFixed(1)} {locale === "en" ? "of 5" : "من 5"}
            </span>
            <span className="text-[#7b7c7d] dark:text-white/50 text-xs">
              · {all.length}{" "}
              {locale === "en"
                ? all.length === 1
                  ? "review"
                  : "reviews"
                : "تقييم"}
            </span>
          </div>
        </div>

        {/* Filter chips — only render when there are conditions to filter by */}
        {conditions.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCondition("all")}
              className={`text-xs font-bold rounded-full px-3.5 py-1.5 transition-all ${
                activeCondition === "all"
                  ? "bg-[#1d5770] text-white"
                  : "bg-[#f5f8fa] dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 hover:bg-[#1d5770]/10"
              }`}
            >
              {locale === "en" ? "All experiences" : "كل التجارب"}
            </button>
            {conditions.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCondition(c)}
                className={`text-xs font-bold rounded-full px-3.5 py-1.5 transition-all ${
                  activeCondition === c
                    ? "bg-[#91b149] text-[#0a0f14]"
                    : "bg-[#f5f8fa] dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 hover:bg-[#91b149]/15"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Targeted social-proof banner */}
        {matchedCount !== null && matchedCount > 0 && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#91b149]/10 text-[#91b149] text-xs font-bold rounded-full px-4 py-2">
              ✨{" "}
              {locale === "en" ? (
                <>
                  <span>{matchedCount}</span> {matchedCount === 1 ? "person" : "people"} with a similar condition healed here
                </>
              ) : (
                <>
                  <span>{matchedCount}</span> شخص بحالة شبه حالتك تعالجوا هنا
                </>
              )}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-[#7b7c7d] dark:text-white/50 text-sm">
            {locale === "en"
              ? `No experiences yet for this condition in ${destName}. `
              : `مفيش تجارب لهذه الحالة في ${destName} حالياً. `}
            <button
              onClick={() => setActiveCondition("all")}
              className="text-[#1d5770] dark:text-[#91b149] font-bold hover:underline"
            >
              {locale === "en" ? "Show all" : "اعرض الكل"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-[#f5f8fa] dark:bg-[#162033] border border-transparent dark:border-[#1e3a5f] rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-shadow"
    >
      {/* Quote */}
      <div
        className="text-4xl leading-none mb-3"
        style={{ color: t.avatarColor }}
      >
        &ldquo;
      </div>
      <p className="text-sm text-[#12394d] dark:text-white/80 leading-relaxed mb-5">
        {t.quote}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#d0dde4] dark:border-[#1e3a5f]">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: t.avatarColor }}
        >
          <span className="text-white font-bold">{t.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-[#12394d] dark:text-white truncate">
            {t.name}
          </div>
          <div className="text-[10px] text-[#7b7c7d] dark:text-white/40 truncate">
            {t.role}
          </div>
        </div>
        <div className="text-[#91b149] text-xs whitespace-nowrap">
          {"★".repeat(t.rating)}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {t.condition && (
          <span className="px-2 py-0.5 bg-[#91b149]/15 text-[#91b149] text-[10px] font-bold rounded-full">
            {t.condition}
          </span>
        )}
        <span className="text-[10px] text-[#7b7c7d] dark:text-white/30">
          {t.duration}
        </span>
      </div>
    </motion.div>
  );
}
