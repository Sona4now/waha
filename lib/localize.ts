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
import type { DestinationFull, BlogPost } from "@/data/siteData";
import type { EnvironmentChapter } from "@/data/environmentChapters";
import type { DestinationPricing, Package } from "@/data/pricingPackages";
import { DESTINATIONS_EN } from "@/data/translations/destinations.en";
import { CHAPTERS_EN } from "@/data/translations/chapters.en";
import { PRICING_EN } from "@/data/translations/packages.en";
import {
  BLOG_POSTS_EN,
  BLOG_CATEGORY_EN,
} from "@/data/translations/blog.en";

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

/**
 * Blog-post localizer. Returns the post with English overlays applied
 * (title, excerpt, category, content sections). Per-field fallback to
 * Arabic. Used by the blog list page and the blog detail page.
 */
export function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale !== "en") return post;
  const en = BLOG_POSTS_EN[post.id];
  // Category translation is the same map for every post.
  const localisedCategory = BLOG_CATEGORY_EN[post.category] ?? post.category;
  if (!en) {
    return { ...post, category: localisedCategory };
  }
  return {
    ...post,
    title: en.title ?? post.title,
    excerpt: en.excerpt ?? post.excerpt,
    category: en.category ?? localisedCategory,
    content: en.content ?? post.content,
  };
}

/**
 * Pricing-package localizer. Looks up the destination → tier overlay
 * and merges. Returns the original Arabic record when locale is "ar"
 * or the overlay is missing.
 */
export function localizePricing(
  pricing: DestinationPricing,
  locale: Locale,
): DestinationPricing {
  if (locale !== "en") return pricing;
  const en = PRICING_EN[pricing.destinationId];
  if (!en) return pricing;
  return {
    ...pricing,
    note: en.note ?? pricing.note,
    packages: pricing.packages.map((pkg): Package => {
      const tierOverlay = en.packages[pkg.tier];
      if (!tierOverlay) return pkg;
      return {
        ...pkg,
        name: tierOverlay.name ?? pkg.name,
        duration: tierOverlay.duration ?? pkg.duration,
        highlight: tierOverlay.highlight ?? pkg.highlight,
        includes: tierOverlay.includes ?? pkg.includes,
        notIncluded: tierOverlay.notIncluded ?? pkg.notIncluded,
      };
    }),
  };
}
