import type { MetadataRoute } from "next";
import { DESTINATIONS, BLOG_POSTS } from "@/data/siteData";
import { SITE_URL as BASE_URL } from "@/lib/siteMeta";
import { getDestinationRating } from "@/data/testimonials";

/**
 * Map a destination ID → SEO priority based on:
 *   - search demand (rough ranking: safaga/siwa > sinai/fayoum > rest)
 *   - rating × review count (more credible = higher priority)
 * Priority is clamped to [0.5, 1.0].
 */
function destinationPriority(destId: string): number {
  const tier1 = ["safaga", "siwa"]; // highest search volume
  const tier2 = ["sinai", "fayoum"]; // strong but less searched
  const rating = getDestinationRating(destId);
  // social-proof modifier: 0.0–0.05 bump
  const proof =
    rating.reviewCount > 0
      ? Math.min(0.05, (rating.reviewCount / 100) * (rating.ratingValue / 5))
      : 0;
  if (tier1.includes(destId)) return Math.min(1.0, 0.9 + proof);
  if (tier2.includes(destId)) return Math.min(1.0, 0.85 + proof);
  return Math.min(1.0, 0.75 + proof);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/home", priority: 0.9, changeFrequency: "weekly" as const },
    {
      url: "/destinations",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    { url: "/tours", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/map", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    {
      url: "/compare",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/team", priority: 0.7, changeFrequency: "monthly" as const },
    {
      url: "/contact",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/privacy",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      url: "/terms",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];

  const destinationRoutes = DESTINATIONS.map((d) => ({
    url: `/destination/${d.id}`,
    priority: destinationPriority(d.id),
    changeFrequency: "monthly" as const,
  }));

  const blogRoutes = BLOG_POSTS.map((p) => ({
    url: `/blog/${p.id}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...destinationRoutes, ...blogRoutes].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
