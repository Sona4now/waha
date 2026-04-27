"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DESTINATIONS, type DestinationFull } from "@/data/siteData";
import { useTranslations } from "@/components/site/LocaleProvider";
import { localizeDestination } from "@/lib/localize";

interface Props {
  currentDest: DestinationFull;
}

/**
 * Smart related destinations — matches based on:
 * 1. Shared treatments (more shared = more relevant)
 * 2. Environment similarity
 * 3. Distance proximity (for quick-getaway recommendations)
 */
export default function SmartRelated({ currentDest }: Props) {
  const { locale } = useTranslations();
  // Score against canonical Arabic data (treatments + environment) so the
  // matching is locale-stable, then localize each candidate for display.
  const scored = DESTINATIONS.filter((d) => d.id !== currentDest.id).map(
    (d) => {
      const sharedTreatments = d.treatments.filter((t) =>
        currentDest.treatments.includes(t),
      ).length;
      const sameEnv = d.environment === currentDest.environment ? 1 : 0;
      const score = sharedTreatments * 3 + sameEnv * 2;
      return {
        dest: localizeDestination(d, locale),
        score,
        sharedTreatments,
      };
    },
  );

  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <section
      id="related"
      className="py-16 bg-[#f5f8fa] dark:bg-[#0a151f]"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-2">
            {locale === "en" ? "Personalized picks" : "مقترحات مخصصة"}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#12394d] dark:text-white font-display">
            {locale === "en" ? "Try these too" : "جرب دي كمان"}
          </h2>
          <p className="text-sm text-[#7b7c7d] dark:text-white/40 mt-2">
            {locale === "en"
              ? `Destinations similar to ${currentDest.name} — based on treatment type and environment`
              : `وجهات مشابهة لـ ${currentDest.name} — بناءً على نوع العلاج والبيئة`}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {sorted.map((item, i) => (
            <motion.div
              key={item.dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/destination/${item.dest.id}`}
                className="group block bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-transparent dark:border-[#1e3a5f] hover:border-[#91b149]/40 dark:hover:border-[#91b149]/40 hover:-translate-y-1 transition-all duration-300 no-underline h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.dest.image}
                    alt={item.dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges on image */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    <span className="px-2.5 py-1 bg-[#91b149] text-white text-xs font-bold rounded-full shadow-md">
                      {item.dest.envIcon} {item.dest.environment}
                    </span>
                    {item.sharedTreatments > 0 && (
                      <span className="px-2.5 py-0.5 bg-white/90 text-[#12394d] text-[10px] font-bold rounded-full">
                        {locale === "en"
                          ? `${item.sharedTreatments} shared treatment${item.sharedTreatments > 1 ? "s" : ""}`
                          : `تشبه بـ ${item.sharedTreatments} علاج`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#12394d] dark:text-white mb-1 font-display group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors">
                    {item.dest.name}
                  </h3>
                  <p className="text-xs text-[#7b7c7d] dark:text-white/50 line-clamp-2 leading-relaxed mb-3">
                    {item.dest.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-[#7b7c7d] dark:text-white/40 pt-3 border-t border-[#d0dde4] dark:border-[#1e3a5f]">
                    {item.dest.distanceKm && (
                      <span>📍 {item.dest.distanceKm} {locale === "en" ? "km" : "كم"}</span>
                    )}
                    {item.dest.duration && <span>⏱️ {item.dest.duration}</span>}
                    {item.dest.costFrom && <span>💰 {item.dest.costFrom}</span>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
