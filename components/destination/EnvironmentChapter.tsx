"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import DestinationCard from "@/components/site/DestinationCard";
import type { EnvironmentChapter as ChapterType } from "@/data/environmentChapters";
import type { DestinationFull } from "@/data/siteData";

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
            className="mb-10 md:mb-14"
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
