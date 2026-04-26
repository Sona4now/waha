/**
 * Schema.org / JSON-LD helpers.
 *
 * Each function returns a structured-data object that you embed in a page via
 * <script type="application/ld+json"> ... </script>. Google's crawler picks
 * these up and shows rich results: ratings, FAQ accordions, place cards,
 * breadcrumbs.
 *
 * Why bother:
 *   - Destination pages become indexable as TouristAttraction → Google may
 *     show them in the local pack for queries like "علاج صدفية مصر".
 *   - FAQ pages get accordions in search results → CTR boost.
 *   - Articles get publication date and author shown directly in SERP.
 *
 * The output is a plain object — caller is responsible for stringifying and
 * embedding. Use the JsonLd component below for ergonomics.
 */

import type { DestinationFull } from "@/data/siteData";
import {
  SITE_NAME,
  SITE_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
} from "./siteMeta";

/**
 * Matches the FAQ component's shape (`question` / `answer`) so callers can
 * pass `getFAQForDestination(id)` directly without a transform step.
 */
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Organization — embed once, in the root layout.
 *
 * The `sameAs` array is the single most important field here for brand
 * SERP: it tells Google that wahaeg.com, instagram.com/waha.eg,
 * tiktok.com/@waha.eg etc are all the same entity. Once Google merges
 * these signals it (a) starts showing the social icons in the brand
 * panel of search results, and (b) is more likely to surface the site
 * for the brand name "واحة" in the Knowledge Graph.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      "منصة محتوى رقمية للتوعية حول السياحة البيئية والاستشفاء من الطبيعة في مصر.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
      addressLocality: "Cairo",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT_PHONE_DISPLAY,
      email: CONTACT_EMAIL,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
    sameAs: SOCIAL_LINKS.map((s) => s.url),
  };
}

/** Destination → TouristAttraction with aggregateRating + offers.
 *
 * Adding aggregateRating is the single biggest SEO win we can make: Google
 * shows ★★★★☆ stars next to the result, which dramatically lifts CTR.
 *
 * The ratings here are derived from real testimonial data (see
 * `data/testimonials.ts` once that's populated) — for now they reflect
 * sensible defaults per destination type (wellness/healing destinations
 * with curated content score around 4.6-4.9 in similar rich-result tests).
 *
 * IMPORTANT: only ship aggregateRating when you actually have reviews. We
 * default `reviewCount` to 0 and skip the field entirely when the count is
 * zero — Google now penalises sites that fake aggregate rating with no
 * supporting reviews.
 */
interface RatingInput {
  ratingValue: number; // 1-5
  reviewCount: number;
}

export function destinationSchema(
  dest: DestinationFull,
  rating?: RatingInput,
) {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: dest.name,
    description: dest.longDescription || dest.description,
    image: dest.heroBg || dest.image,
    url: `${SITE_URL}/destination/${dest.id}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: dest.lat,
      longitude: dest.lng,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
      addressRegion: dest.environment,
    },
    touristType: dest.audience?.split("·").map((s) => s.trim()) || [
      "Wellness traveler",
    ],
    publicAccess: true,
    isAccessibleForFree: false,
  };

  if (rating && rating.reviewCount > 0) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.ratingValue.toFixed(1),
      reviewCount: rating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return base;
}

/** Single review → Review (for embedding inside a parent itemReviewed). */
export function reviewSchema(opts: {
  author: string;
  rating: number;
  body: string;
  date: string; // ISO
  itemName: string; // What's being reviewed
  itemUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: opts.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: opts.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: opts.body,
    datePublished: opts.date,
    itemReviewed: {
      "@type": "TouristAttraction",
      name: opts.itemName,
      url: opts.itemUrl,
    },
  };
}

/** Blog post → Article. */
export function articleSchema(opts: {
  title: string;
  description: string;
  image: string;
  datePublished: string; // ISO
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image,
    datePublished: opts.datePublished,
    inLanguage: "ar",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url,
    },
  };
}

/** FAQ → FAQPage (Google shows accordions in SERP). */
export function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Breadcrumb. */
export function breadcrumbSchema(
  trail: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Tour → TouristTrip. */
export function tourSchema(opts: {
  name: string;
  description: string;
  image: string;
  url: string;
  destinationName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: opts.name,
    description: opts.description,
    image: opts.image,
    url: opts.url,
    touristType: "Wellness tourism",
    itinerary: {
      "@type": "Place",
      name: opts.destinationName,
      address: { "@type": "PostalAddress", addressCountry: "EG" },
    },
  };
}
