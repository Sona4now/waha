"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { DESTINATIONS, type DestinationFull } from "@/data/siteData";
import { useTranslations } from "@/components/site/LocaleProvider";

/**
 * Seasonal calendar — 12-month view of which destinations are best to visit
 * in each month.
 *
 * Data source: `bestMonths[]` and `okMonths[]` on every DestinationFull.
 * UI: a 7x12 heat table (destination rows × month columns) — green = best,
 * amber = ok, gray = avoid. Click a cell to jump to the destination.
 *
 * Bonus: pick a month → scroll focus + show the top 3 destinations for it.
 */

const MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Intensity = 0 | 1 | 2; // 0 avoid / 1 ok / 2 best

function intensityFor(
  dest: DestinationFull,
  monthIdx: number,
): Intensity {
  // `bestMonths` / `okMonths` in siteData are 1-indexed (Jan = 1).
  const m = monthIdx + 1;
  if (dest.bestMonths?.includes(m)) return 2;
  if (dest.okMonths?.includes(m)) return 1;
  return 0;
}

function toneClass(i: Intensity): string {
  if (i === 2) return "bg-[#91b149] hover:bg-[#7a9a3b] text-white";
  if (i === 1) return "bg-amber-400/80 hover:bg-amber-400 text-amber-950";
  return "bg-[#d0dde4]/40 dark:bg-white/5 hover:bg-[#d0dde4] dark:hover:bg-white/10 text-[#7b7c7d] dark:text-white/30";
}

function labelFor(i: Intensity, locale: "ar" | "en"): string {
  if (locale === "en") {
    if (i === 2) return "Best";
    if (i === 1) return "Acceptable";
    return "Avoid";
  }
  if (i === 2) return "الأفضل";
  if (i === 1) return "مناسب";
  return "يُفضّل تجنّبه";
}

export default function CalendarPage() {
  const { t, locale } = useTranslations();
  const MONTHS = locale === "en" ? MONTHS_EN : MONTHS_AR;
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());

  const destinationsForMonth = useMemo(() => {
    return DESTINATIONS.map((d) => ({
      dest: d,
      intensity: intensityFor(d, selectedMonth),
    }))
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 6);
  }, [selectedMonth]);

  return (
    <SiteLayout>
      <PageHero
        title={t("calendarPage.title")}
        subtitle={t("calendarPage.subtitle")}
        breadcrumb={[
          { label: t("nav.home"), href: "/home" },
          { label: t("nav.calendar") },
        ]}
      />

      <section className="py-10 md:py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div
          className="max-w-6xl mx-auto"
          dir={locale === "en" ? "ltr" : "rtl"}
        >
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-sm bg-[#91b149]" />
              <span className="text-[#12394d] dark:text-white/80 font-bold">
                {labelFor(2, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-sm bg-amber-400" />
              <span className="text-[#12394d] dark:text-white/80 font-bold">
                {labelFor(1, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-sm bg-[#d0dde4] dark:bg-white/10" />
              <span className="text-[#7b7c7d] dark:text-white/50">
                {labelFor(0, locale)}
              </span>
            </div>
          </div>

          {/* Heat table — horizontally scrollable on mobile */}
          <div className="bg-white dark:bg-[#162033] rounded-2xl border border-[#d0dde4] dark:border-[#1e3a5f] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#d0dde4] dark:border-[#1e3a5f]">
                    <th className="sticky right-0 bg-white dark:bg-[#162033] z-10 text-right text-[11px] font-bold text-[#7b7c7d] dark:text-white/60 p-3 w-40">
                      الوجهة
                    </th>
                    {MONTHS.map((m, i) => (
                      <th
                        key={m}
                        onClick={() => setSelectedMonth(i)}
                        className={`text-center text-[10px] font-bold p-2 cursor-pointer transition-colors ${
                          i === selectedMonth
                            ? "text-[#91b149] bg-[#91b149]/10"
                            : "text-[#7b7c7d] dark:text-white/50 hover:text-[#1d5770] dark:hover:text-[#91b149]"
                        }`}
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DESTINATIONS.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b last:border-0 border-[#d0dde4]/60 dark:border-[#1e3a5f]/50"
                    >
                      <td className="sticky right-0 bg-white dark:bg-[#162033] z-10 p-3 border-l border-[#d0dde4] dark:border-[#1e3a5f]">
                        <Link
                          href={`/destination/${d.id}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#12394d] dark:text-white hover:text-[#1d5770] dark:hover:text-[#91b149] no-underline transition-colors"
                        >
                          <span className="text-base">{d.envIcon}</span>
                          <span className="truncate">{d.name}</span>
                        </Link>
                      </td>
                      {MONTHS.map((_, i) => {
                        const intensity = intensityFor(d, i);
                        return (
                          <td
                            key={i}
                            className="p-1 text-center"
                            onClick={() => setSelectedMonth(i)}
                          >
                            <button
                              type="button"
                              className={`w-full aspect-square min-h-[32px] max-h-[48px] rounded-md transition-all ${toneClass(
                                intensity,
                              )} ${i === selectedMonth ? "ring-2 ring-[#91b149]" : ""}`}
                              aria-label={`${d.name} ${locale === "en" ? "in" : "في"} ${MONTHS[i]}: ${labelFor(intensity, locale)}`}
                              title={`${d.name} — ${MONTHS[i]}: ${labelFor(intensity, locale)}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected month focus */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl md:text-2xl font-bold text-[#12394d] dark:text-white">
                {locale === "en"
                  ? `Best destinations in ${MONTHS[selectedMonth]}`
                  : `أفضل الوجهات في ${MONTHS[selectedMonth]}`}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setSelectedMonth((m) => (m === 0 ? 11 : m - 1))
                  }
                  aria-label={locale === "en" ? "Previous month" : "الشهر السابق"}
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] text-[#12394d] dark:text-white flex items-center justify-center hover:bg-[#e4edf2] dark:hover:bg-[#1e3a5f] transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setSelectedMonth((m) => (m === 11 ? 0 : m + 1))
                  }
                  aria-label={locale === "en" ? "Next month" : "الشهر التالي"}
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#162033] border border-[#d0dde4] dark:border-[#1e3a5f] text-[#12394d] dark:text-white flex items-center justify-center hover:bg-[#e4edf2] dark:hover:bg-[#1e3a5f] transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {destinationsForMonth.filter((x) => x.intensity > 0).length === 0 ? (
              <div className="text-sm text-[#7b7c7d] dark:text-white/50 text-center py-10 bg-white dark:bg-[#162033] rounded-2xl border border-dashed border-[#d0dde4] dark:border-[#1e3a5f]">
                {locale === "en"
                  ? `No recommended destinations in ${MONTHS[selectedMonth]} — try a different month.`
                  : `مفيش وجهة مُفضّلة في ${MONTHS[selectedMonth]} — جرّب شهر تاني.`}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinationsForMonth
                  .filter((x) => x.intensity > 0)
                  .map(({ dest, intensity }, i) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/destination/${dest.id}`}
                        className="block bg-white dark:bg-[#162033] rounded-2xl overflow-hidden border border-[#d0dde4] dark:border-[#1e3a5f] no-underline hover:-translate-y-1 hover:shadow-lg transition-all"
                      >
                        <div className="relative h-36 overflow-hidden">
                          <Image
                            src={dest.image}
                            alt={dest.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <span
                            className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              intensity === 2
                                ? "bg-[#91b149] text-white"
                                : "bg-amber-400 text-amber-950"
                            }`}
                          >
                            {labelFor(intensity, locale)}
                          </span>
                          <div className="absolute bottom-3 right-4 left-4">
                            <h3 className="text-lg font-bold text-white font-display drop-shadow-md">
                              {dest.envIcon} {dest.name}
                            </h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-[#7b7c7d] dark:text-white/60 line-clamp-2 leading-relaxed">
                            {dest.pitch || dest.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-[#7b7c7d] dark:text-white/40 text-center mt-10 leading-relaxed">
            {locale === "en"
              ? "💡 Seasons are approximate and depend on Egypt's climate and the type of therapy. See each destination's page for full details."
              : "💡 المواسم تقريبية وتعتمد على مناخ مصر وطبيعة العلاج. راجع صفحة كل وجهة للتفاصيل الكاملة."}
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
