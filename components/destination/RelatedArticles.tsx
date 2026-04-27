"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BLOG_POSTS, type BlogPost } from "@/data/siteData";
import { localizeBlogPost } from "@/lib/localize";
import { useTranslations } from "@/components/site/LocaleProvider";
import type { Locale } from "@/lib/i18n";

interface Props {
  destinationId: string;
  destinationName: string;
}

/**
 * Surface blog articles that mention this destination.
 *
 * Two SEO wins from this:
 *   1. Internal anchor distribution — destination pages now receive
 *      links from every article that talks about them, lifting their
 *      crawl priority and topical authority.
 *   2. Dwell-time boost — a user who lands on the destination page can
 *      keep reading in-context, which pushes ranking signals up.
 */
function findArticlesAboutDestination(
  destinationId: string,
  destinationName: string,
): BlogPost[] {
  const nameLower = destinationName.toLowerCase();
  const idLower = destinationId.toLowerCase();

  const scored = BLOG_POSTS.map((post) => {
    const haystack = (
      post.title +
      " " +
      post.excerpt +
      " " +
      (post.content?.flatMap((s) => s.paragraphs).join(" ") ?? "")
    ).toLowerCase();

    let score = 0;
    if (post.title.toLowerCase().includes(nameLower)) score += 5;
    if (post.id.includes(idLower)) score += 4; // e.g. "siwa-sulfur-springs"
    if (haystack.includes(nameLower)) score += 1;
    return { post, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((x) => x.post);
}

function fmtDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const monthsAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const monthsEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const months = locale === "en" ? monthsEn : monthsAr;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function RelatedArticles({
  destinationId,
  destinationName,
}: Props) {
  const { locale } = useTranslations();
  // Find candidates against canonical AR data, then localize each post
  // before rendering so titles/excerpts/categories render in the active
  // locale.
  const articles = findArticlesAboutDestination(
    destinationId,
    destinationName,
  ).map((p) => localizeBlogPost(p, locale));

  if (articles.length === 0) return null;

  return (
    <section className="py-14 bg-white dark:bg-[#0d1b2a]" dir={locale === "en" ? "ltr" : "rtl"}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold text-[#91b149] uppercase tracking-wider mb-2">
            {locale === "en" ? "Related articles" : "مقالات ذات صلة"}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-[#12394d] dark:text-white">
            {locale === "en"
              ? `Learn more about wellness tourism in ${destinationName}`
              : `اعرف أكتر عن السياحة الاستشفائية في ${destinationName}`}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/blog/${post.id}`}
                className="group block bg-[#f5f8fa] dark:bg-[#162033] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1e3a5f] hover:shadow-xl transition-all hover:-translate-y-1 no-underline"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={
                      locale === "en"
                        ? `${post.title} — article about wellness tourism in ${destinationName}`
                        : `${post.title} — مقال عن السياحة الاستشفائية في ${destinationName}`
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-[#91b149] px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {post.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-[#12394d] dark:text-white mb-2 line-clamp-2 group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#7b7c7d] dark:text-white/50 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#7b7c7d] dark:text-white/40">
                    <span>{fmtDate(post.date, locale)}</span>
                    <span className="font-bold text-[#1d5770] dark:text-[#91b149]">
                      {locale === "en" ? "Read →" : "اقرأ ←"}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
