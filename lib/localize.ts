/**
 * Locale-aware data accessors.
 *
 * Source data lives in Arabic in `data/siteData.ts` and `data/
 * environmentChapters.ts`. English translations live in
 * `data/translations/*.en.ts` keyed by entity ID. These helpers merge
 * the two: when locale === "en", they overlay the English fields onto
 * the Arabic record (English wins), and any missing English field
 * silently falls back to the Arabic original.
 *
 * That way callers can keep using the existing `dest.name` /
 * `chapter.intro` shape — no scattered `locale === "en" ? a : b`
 * branches in the rendering code.
 */

import type { Locale } from "./i18n";
import type { DestinationFull } from "@/data/siteData";
import type { EnvironmentChapter } from "@/data/environmentChapters";
import { DESTINATIONS_EN } from "@/data/translations/destinations.en";
import { CHAPTERS_EN } from "@/data/translations/chapters.en";

export function localizeDestination(
  dest: DestinationFull,
  locale: Locale,
): DestinationFull {
  if (locale !== "en") return dest;
  const en = DESTINATIONS_EN[dest.id];
  if (!en) return dest;

  return {
    ...dest,
    name: en.name ?? dest.name,
    environment: en.environment ?? dest.environment,
    treatments: en.treatments ?? dest.treatments,
    description: en.description ?? dest.description,
    longDescription: en.longDescription ?? dest.longDescription,
    benefits: en.benefits ?? dest.benefits,
    reasons: en.reasons ?? dest.reasons,
    trustSignal: en.trustSignal ?? dest.trustSignal,
    features: en.features ?? dest.features,
    duration: en.duration ?? dest.duration,
    costFrom: en.costFrom ?? dest.costFrom,
    difficulty: en.difficulty ?? dest.difficulty,
    audience: en.audience ?? dest.audience,
    pitch: en.pitch ?? dest.pitch,
  };
}

export function localizeChapter(
  chapter: EnvironmentChapter,
  locale: Locale,
): EnvironmentChapter {
  if (locale !== "en") return chapter;
  const en = CHAPTERS_EN[chapter.key];
  if (!en) return chapter;
  return {
    ...chapter,
    name: en.name ?? chapter.name,
    tagline: en.tagline ?? chapter.tagline,
    intro: en.intro ?? chapter.intro,
  };
}
