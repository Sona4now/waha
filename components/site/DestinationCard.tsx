"use client";

import Link from "next/link";
import Image from "next/image";
import { CompareButton } from "./ComparisonTray";
import { envBadgeClasses } from "@/lib/envColors";
import { getDestinationRating } from "@/data/testimonials";
import type { DestinationFull } from "@/data/siteData";

interface Props {
  dest: DestinationFull;
  /**
   * When true, the card shows a small "مناسب لك" hint on mobile.
   * Computed by the parent using `relevanceScore` from `/destinations`.
   */
  isRecommended?: boolean;
}

const MAX_MOBILE_CHIPS = 2;

/**
 * Destination card with a dual layout:
 *   - Mobile (< md): horizontal — 128×128 image on the right (RTL), body on
 *     the left. Total card height ≈ 150px. Optimized for density: you see
 *     2.5–3 cards in a mobile viewport vs 1.5 in the old design.
 *   - Desktop (md+): vertical — full-width 208px image on top, body below.
 *     Matches the previous look minus the redundant "اكتشف المزيد" footer.
 *
 * Price is the hero datapoint (`text-lg md:text-xl font-black`); env badge is
 * color-coded per `envClass`; treatments are truncated to 2 + "+N" on mobile.
 */
export default function DestinationCard({ dest, isRecommended }: Props) {
  const treatments = dest.treatments ?? [];
  const visibleMobile = treatments.slice(0, MAX_MOBILE_CHIPS);
  const extraMobile = Math.max(0, treatments.length - MAX_MOBILE_CHIPS);
  const rating = getDestinationRating(dest.id);

  return (
    <div className="relative group h-full">
      <CompareButton id={dest.id} />

      {/* Hover glow ring — desktop only (mobile tap would trigger it briefly) */}
      <div
        className="hidden md:block pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#91b149]/40 via-transparent to-[#1d5770]/40 blur-[2px]"
        aria-hidden="true"
      />

      <Link
        href={`/destination/${dest.id}`}
        className="relative flex flex-row md:flex-col bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 md:hover:-translate-y-2 border border-[#d0dde4] dark:border-[#1e3a5f] hover:border-[#91b149]/60 md:h-full no-underline"
      >
        {/* ── Image container ───────────────────────────────────────── */}
        <div className="relative w-32 h-32 md:w-full md:h-52 flex-shrink-0 overflow-hidden">
          <Image
            src={dest.image}
            alt={`${dest.name} — وجهة استشفائية`}
            fill
            sizes="(max-width: 768px) 128px, (max-width: 1024px) 50vw, 33vw"
            className="object-cover md:group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Gradient overlay (desktop only — name sits on it) */}
          <div
            className="absolute inset-0 md:bg-gradient-to-t md:from-black/75 md:via-black/25 md:to-transparent"
            aria-hidden="true"
          />

          {/* Desktop hover CTA */}
          <div
            className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-[#0a151f]/30 backdrop-blur-[2px]"
            aria-hidden="true"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 text-[#12394d] font-bold text-sm shadow-xl backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
              اكتشف المزيد
              <span className="text-base leading-none">←</span>
            </span>
          </div>

          {/* Distance chip — desktop only (mobile shows it in the body) */}
          {dest.distanceKm !== undefined && (
            <span className="hidden md:inline-flex absolute top-3 left-3 items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-black/50 backdrop-blur-sm z-[1]">
              📍 {dest.distanceKm} كم
            </span>
          )}

          {/* Trust signal: rating chip — only when we actually have reviews. */}
          {rating.reviewCount > 0 && (
            <span className="hidden md:inline-flex absolute top-3 right-3 items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-[#91b149]/85 backdrop-blur-sm z-[1]">
              ★ {rating.ratingValue.toFixed(1)} ({rating.reviewCount})
            </span>
          )}

          {/* Desktop: name overlayed on image */}
          <div className="hidden md:block absolute bottom-3 right-4 left-4 z-[1]">
            <h3 className="text-2xl font-bold text-white font-display drop-shadow-md">
              {dest.name}
            </h3>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 p-3 md:p-5 flex flex-col">
          {/* Row 1: env badge (colored) + optional "مناسب لك" hint */}
          <div className="flex items-center gap-2 mb-1.5 md:mb-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1.5 rounded-full ${envBadgeClasses(dest.envClass)}`}
            >
              {dest.envIcon} {dest.environment}
            </span>
            {/* Mobile rating: same trust signal as the desktop chip on the
                image, just sized to fit the dense mobile layout. */}
            {rating.reviewCount > 0 && (
              <span className="md:hidden inline-flex items-center gap-0.5 text-[10px] font-bold text-[#91b149]">
                ★ {rating.ratingValue.toFixed(1)} ({rating.reviewCount})
              </span>
            )}
            {isRecommended && (
              <span className="text-[10px] font-bold text-[#91b149] md:hidden">
                ✦ مناسب لك
              </span>
            )}
          </div>

          {/* Mobile-only name (desktop shows it over the image) */}
          <h3 className="md:hidden text-base font-bold text-[#12394d] dark:text-white line-clamp-1 mb-0.5">
            {dest.name}
          </h3>

          {/* Pitch / description — compact on mobile */}
          {dest.pitch ? (
            <p className="text-xs md:text-sm font-semibold text-[#12394d] dark:text-white leading-snug line-clamp-1 md:line-clamp-2 md:mb-3">
              {dest.pitch}
            </p>
          ) : (
            <p className="text-xs md:text-sm leading-relaxed line-clamp-1 md:line-clamp-2 text-[#7b7c7d] dark:text-white/60 md:mb-3">
              {dest.description}
            </p>
          )}

          {/* HERO datapoint: price */}
          {dest.costFrom && (
            <div className="mt-auto md:mt-0 md:mb-2 flex items-baseline gap-1.5">
              <span className="text-[10px] md:text-xs text-[#7b7c7d] dark:text-white/50">
                من
              </span>
              <span className="text-lg md:text-xl font-black text-[#12394d] dark:text-white leading-none">
                {dest.costFrom}
              </span>
            </div>
          )}

          {/* Secondary meta: duration · difficulty · (mobile only) distance */}
          <div className="flex items-center gap-x-2.5 gap-y-1 flex-wrap text-[10px] md:text-xs text-[#7b7c7d] dark:text-white/50 mt-1 md:mt-0 md:mb-3">
            {dest.duration && <span>⏱️ {dest.duration}</span>}
            {dest.difficulty && <span>⭐ {dest.difficulty}</span>}
            {dest.distanceKm !== undefined && (
              <span className="md:hidden">📍 {dest.distanceKm} كم</span>
            )}
          </div>

          {/* Treatment chips — full on desktop, capped + "+N" on mobile */}
          {treatments.length > 0 && (
            <>
              <div className="hidden md:flex flex-wrap gap-1.5 mt-auto">
                {treatments.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f7ed] dark:bg-[#91b149]/15 text-[#91b149] font-bold border border-transparent md:hover:bg-[#91b149] md:hover:text-white md:hover:scale-105 md:hover:border-[#91b149]/40 transition-all duration-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="md:hidden flex flex-wrap gap-1 mt-1.5">
                {visibleMobile.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f0f7ed] dark:bg-[#91b149]/15 text-[#91b149] font-bold"
                  >
                    {t}
                  </span>
                ))}
                {extraMobile > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full text-[#7b7c7d] dark:text-white/50 font-bold">
                    +{extraMobile}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
