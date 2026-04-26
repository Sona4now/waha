"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import DestinationCard from "@/components/site/DestinationCard";
import type { EnvironmentChapter as ChapterType } from "@/data/environmentChapters";
import type { DestinationFull } from "@/data/siteData";
import { TESTIMONIALS_BY_DEST } from "@/data/testimonials";
import { isInSeasonNow } from "@/lib/season";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

interface Props {
  chapter: ChapterType;
  destinations: DestinationFull[];
  /** Fade in the chapter once it scrolls into view. */
  index: number;
}

/**
 * One narrative chapter for /destinations.
 *
 * Two-part layout:
 *   1. Full-bleed parallax hero — chapter number, element name, tagline,
 *      and a coloured accent bar. Image scrolls slower than the page so
 *      the section "breathes" as you scroll past.
 *   2. Editorial body — opening paragraph in serif-leaning display font,
 *      followed by the destination cards belonging to this environment.
 *
 * If the chapter has no matching destinations (e.g. all filtered out), it
 * renders nothing — the parent decides what to show in that case.
 */
export default function EnvironmentChapter({
  chapter,
  destinations,
  index,
}: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallax: image translates at ~30% the speed of scroll. Skipped when
  // the user has prefers-reduced-motion.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  if (destinations.length === 0) return null;

  /* ── Derived stats for the fact strip ───────────────────────── */
  const avgDistance = useMemo(() => {
    const valid = destinations.filter((d) => d.distanceKm !== undefined);
    if (valid.length === 0) return null;
    const sum = valid.reduce((a, d) => a + (d.distanceKm ?? 0), 0);
    return Math.round(sum / valid.length);
  }, [destinations]);

  const inSeasonNow = useMemo(
    () => destinations.some((d) => isInSeasonNow(d.bestMonths)),
    [destinations],
  );

  /** Best-month union across all destinations in this chapter — used to
   *  show the chapter's overall "season window" as a list of month names.
   *  We dedupe and keep at most 4 to avoid wall-of-months. */
  const peakMonths = useMemo(() => {
    const months = new Set<number>();
    destinations.forEach((d) => {
      d.bestMonths?.forEach((m) => months.add(m));
    });
    return Array.from(months)
      .sort((a, b) => a - b)
      .slice(0, 4)
      .map((m) => MONTH_NAMES[m - 1]);
  }, [destinations]);

  /** Highest-rated testimonial across all destinations in this chapter.
   *  We surface this as a poetic quote BEFORE the cards so the chapter
   *  has a human voice, not just data and copy. */
  const featuredQuote = useMemo(() => {
    let best: {
      quote: string;
      name: string;
      role: string;
      destName: string;
      condition?: string;
    } | null = null;
    let bestRating = -1;
    for (const dest of destinations) {
      const list = TESTIMONIALS_BY_DEST[dest.id] ?? [];
      for (const t of list) {
        if (t.rating > bestRating) {
          bestRating = t.rating;
          best = {
            quote: t.quote,
            name: t.name,
            role: t.role,
            destName: dest.name,
            condition: t.condition,
          };
        }
      }
    }
    return best;
  }, [destinations]);

  return (
    <section
      id={`chapter-${chapter.key}`}
      className="relative"
      aria-label={`الفصل ${chapter.number}: ${chapter.name}`}
    >
      {/* ── Parallax hero ─────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative h-[70vh] min-h-[480px] w-full overflow-hidden"
      >
        <motion.div
          style={reduceMotion ? undefined : { y }}
          className="absolute inset-0 -top-[15%] -bottom-[15%] will-change-transform"
        >
          <Image
            src={chapter.heroImage}
            alt={`${chapter.name} — السياحة الاستشفائية في مصر`}
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover"
          />
        </motion.div>

        {/* Tinted overlay so the white text is legible regardless of image */}
        <div
          className="absolute inset-0"
          style={{ background: chapter.overlayGradient }}
          aria-hidden
        />

        {/* Content */}
        <div className="relative h-full flex items-end" dir="rtl">
          <div className="max-w-5xl mx-auto px-6 md:px-8 pb-16 md:pb-24 w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Chapter number — Arabic-Indic numerals, tracked wide */}
              <div
                className="font-display text-sm md:text-base font-bold tracking-[0.4em] mb-3"
                style={{ color: lighten(chapter.accent) }}
              >
                {chapter.number}
              </div>

              {/* Accent bar */}
              <div
                className="h-[3px] w-12 mb-5 rounded-full"
                style={{ backgroundColor: lighten(chapter.accent) }}
                aria-hidden
              />

              {/* Element name + icon */}
              <h2 className="font-display text-5xl md:text-7xl font-black text-white leading-none mb-4">
                <span
                  className="inline-block ml-3 align-middle text-4xl md:text-6xl"
                  aria-hidden
                >
                  {chapter.icon}
                </span>
                {chapter.name}
              </h2>

              {/* Tagline */}
              <p className="text-white/85 text-base md:text-2xl font-display max-w-2xl leading-tight">
                {chapter.tagline}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Editorial body ────────────────────────────────────────────── */}
      <div
        className="bg-[#f5f8fa] dark:bg-[#0a151f] py-12 md:py-20"
        dir="rtl"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* Editorial intro paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-8 md:mb-10"
          >
            <p className="font-display text-lg md:text-2xl leading-[2] text-[#12394d] dark:text-white/85 max-w-3xl">
              {chapter.intro}
            </p>
            <div
              className="mt-6 h-px w-24"
              style={{ backgroundColor: chapter.accent, opacity: 0.6 }}
              aria-hidden
            />
          </motion.div>

          {/* Fact strip — three concrete data tiles. Anchors the poetic
              intro in numbers so the user can plan, not just feel. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="grid grid-cols-3 gap-3 md:gap-5 mb-10"
          >
            <FactTile
              label={destinations.length === 1 ? "وجهة واحدة" : "عدد الوجهات"}
              value={String(destinations.length)}
              accent={chapter.accent}
            />
            {avgDistance !== null && (
              <FactTile
                label="متوسط البعد عن القاهرة"
                value={`${avgDistance} كم`}
                accent={chapter.accent}
              />
            )}
            <FactTile
              label="أفضل شهور الزيارة"
              value={peakMonths.length > 0 ? peakMonths.join(" · ") : "السنة كاملة"}
              accent={chapter.accent}
              highlight={inSeasonNow}
              highlightLabel={inSeasonNow ? "الآن ✨" : undefined}
              compact
            />
          </motion.div>

          {/* Inline testimonial — humanises the chapter before the cards.
              Only shown when we actually have a testimonial backing it. */}
          {featuredQuote && (
            <motion.figure
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="relative mb-10 md:mb-14 max-w-3xl"
            >
              <div
                className="absolute -top-2 right-0 text-7xl md:text-8xl font-black leading-none opacity-20 select-none pointer-events-none"
                style={{ color: chapter.accent }}
                aria-hidden
              >
                &ldquo;
              </div>
              <blockquote className="relative pr-8 md:pr-12">
                <p className="font-display text-base md:text-xl leading-relaxed text-[#12394d] dark:text-white/85 italic">
                  {featuredQuote.quote}
                </p>
                <figcaption className="mt-4 flex items-center gap-3 flex-wrap">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: chapter.accent }}
                  >
                    {featuredQuote.name.charAt(0)}
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-[#12394d] dark:text-white">
                      {featuredQuote.name}
                    </div>
                    <div className="text-[#7b7c7d] dark:text-white/50">
                      {featuredQuote.role}
                      {featuredQuote.condition && (
                        <>
                          <span className="mx-1.5">·</span>
                          <span style={{ color: chapter.accent }}>
                            {featuredQuote.condition}
                          </span>
                        </>
                      )}
                      <span className="mx-1.5">·</span>
                      <span>{featuredQuote.destName}</span>
                    </div>
                  </div>
                </figcaption>
              </blockquote>
            </motion.figure>
          )}

          {/* Destinations grid for this chapter */}
          <div
            className={
              destinations.length === 1
                ? "max-w-2xl"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            }
          >
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i * 0.08, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <DestinationCard dest={dest} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Lighten a hex color toward white — used to make the dark chapter accents
 * legible when they sit on top of dark photographs.
 */
function lighten(hex: string): string {
  // Quick approximation: blend 60% with white. Good enough for these 4
  // brand colours; we don't need general-purpose colour math here.
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const blend = (c: number) => Math.round(c + (255 - c) * 0.6);
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}

/**
 * Single tile in the chapter's fact strip. Compact mode shrinks the value
 * font so multi-month strings ("أبريل · مايو · أكتوبر · نوفمبر") still fit.
 */
function FactTile({
  label,
  value,
  accent,
  highlight,
  highlightLabel,
  compact,
}: {
  label: string;
  value: string;
  accent: string;
  highlight?: boolean;
  highlightLabel?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-3 md:p-4 ${
        highlight
          ? "border-2"
          : "border border-[#d0dde4] dark:border-[#1e3a5f]"
      } bg-white dark:bg-[#162033]`}
      style={highlight ? { borderColor: accent } : undefined}
    >
      <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#7b7c7d] dark:text-white/50 mb-1.5">
        {label}
      </div>
      <div
        className={`font-display font-black text-[#12394d] dark:text-white leading-tight ${
          compact ? "text-xs md:text-sm" : "text-base md:text-2xl"
        }`}
      >
        {value}
      </div>
      {highlight && highlightLabel && (
        <span
          className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {highlightLabel}
        </span>
      )}
    </div>
  );
}
