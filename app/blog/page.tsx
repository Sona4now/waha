"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { getBlogProgress } from "@/components/site/BlogReadingTracker";
import { useTranslations } from "@/components/site/LocaleProvider";
import { BLOG_POSTS, type BlogPost } from "@/data/siteData";
import { localizeBlogPost } from "@/lib/localize";
import { BLOG_CATEGORY_EN } from "@/data/translations/blog.en";

/**
 * Category filter. The `id` matches `post.category` in data/siteData.ts
 * (canonical Arabic key); the label resolves through t() at render time
 * so it switches AR ↔ EN.
 */
const CATEGORIES = [
  { id: "all", labelKey: "blogPage.categories.all" },
  { id: "معلومات", labelKey: "blogPage.categories.knowledge" },
  { id: "وجهات", labelKey: "blogPage.categories.destinations" },
  { id: "صحة", labelKey: "blogPage.categories.health" },
  { id: "نصائح", labelKey: "blogPage.categories.tips" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "الأحدث" },
  { id: "oldest", label: "الأقدم" },
  { id: "shortest", label: "الأقصر" },
  { id: "longest", label: "الأطول" },
];

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** Strip Arabic diacritics + lowercase for forgiving search. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, "") // tashkeel
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

export default function BlogPage() {
  const { t, locale } = useTranslations();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");


  // Read per-post reading progress from localStorage. Updated on mount only;
  // we don't watch storage events because it changes only when the user
  // navigates to a post and back, at which point this page is remounted.
  const [progress, setProgress] = useState<Record<string, number>>({});
  useEffect(() => {
    const map: Record<string, number> = {};
    for (const p of BLOG_POSTS) {
      const v = getBlogProgress(p.id);
      if (typeof v === "number" && v > 5) map[p.id] = v;
    }
    setProgress(map);
  }, []);

  const filteredPosts = useMemo(() => {
    // Filter by category against the ORIGINAL Arabic key (canonical in
    // BLOG_POSTS), then map to localized for display. Keeps the filter
    // chip values stable across locales.
    let baseList =
      activeCategory === "all"
        ? [...BLOG_POSTS]
        : BLOG_POSTS.filter((post) => post.category === activeCategory);

    let list = baseList.map((p) => localizeBlogPost(p, locale));

    // Search across (localized) title + excerpt so EN users can search EN.
    if (search.trim()) {
      const q = normalize(search);
      list = list.filter(
        (p) =>
          normalize(p.title).includes(q) ||
          normalize(p.excerpt).includes(q),
      );
    }

    // Sort
    list.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.date.localeCompare(b.date);
        case "shortest":
          return a.readTime - b.readTime;
        case "longest":
          return b.readTime - a.readTime;
        case "newest":
        default:
          return b.date.localeCompare(a.date);
      }
    });

    return list;
  }, [activeCategory, sort, search, locale]);

  /** Featured = latest article — only shown when no filter/search active. */
  const featured: BlogPost | null = useMemo(() => {
    if (activeCategory !== "all" || search.trim() || sort !== "newest") {
      return null;
    }
    const latest = [...BLOG_POSTS].sort((a, b) =>
      b.date.localeCompare(a.date),
    )[0];
    return latest ? localizeBlogPost(latest, locale) : null;
  }, [activeCategory, search, sort, locale]);

  /** Posts to render in the grid (exclude featured to avoid duplication). */
  const gridPosts = useMemo(() => {
    if (!featured) return filteredPosts;
    return filteredPosts.filter((p) => p.id !== featured.id);
  }, [filteredPosts, featured]);

  const totalCount = BLOG_POSTS.length;
  const visibleCount = filteredPosts.length;

  function clearFilters() {
    setActiveCategory("all");
    setSearch("");
    setSort("newest");
  }

  return (
    <SiteLayout>
      <PageHero
        title={t("blogPage.title")}
        subtitle={t("blogPage.subtitle")}
        breadcrumb={[
          { label: t("nav.home"), href: "/home" },
          { label: t("blogPage.breadcrumb") },
        ]}
      />

      <section className="bg-[#f5f8fa] dark:bg-[#0a151f] py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* ── Featured Article ── */}
          <AnimatePresence mode="wait">
            {featured && (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12"
                dir="rtl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block w-1 h-5 bg-[#91b149] rounded-full" />
                  <h2 className="text-xs font-bold text-[#1d5770] dark:text-[#91b149] uppercase tracking-wider">
                    {t("blogPage.featuredLabel")}
                  </h2>
                </div>
                <Link
                  href={`/blog/${featured.id}`}
                  className="group block rounded-3xl overflow-hidden bg-white dark:bg-[#162033] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-[#1e3a5f] no-underline"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-56 md:h-auto md:min-h-[320px] overflow-hidden">
                      <Image
                        src={featured.image}
                        alt={featured.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/40 via-transparent to-transparent" />
                      <span className="absolute top-4 right-4 rounded-full bg-[#91b149] px-3 py-1 text-xs font-bold text-white">
                        {featured.category}
                      </span>
                    </div>
                    {/* Body */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3 text-xs text-[#7b7c7d] dark:text-white/50">
                        <span>{fmtDate(featured.date)}</span>
                        <span className="text-[#d0dde4]">·</span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {featured.readTime} دقائق قراءة
                        </span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-black text-[#12394d] dark:text-white mb-3 leading-tight group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors">
                        {featured.title}
                      </h3>
                      <p className="text-[#7b7c7d] dark:text-white/70 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
                        {featured.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-display font-bold text-[#1d5770] dark:text-[#91b149] group-hover:gap-3 transition-all">
                        <span>{t("blogPage.readArticle")}</span>
                        <span>←</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Search + Sort Row ── */}
          <div
            className="mb-8 flex flex-col md:flex-row md:items-center gap-3"
            dir="rtl"
          >
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b7c7d] dark:text-white/40 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search.placeholder")}
                // text-base (16px) prevents iOS zoom on focus
                className="w-full pr-11 pl-4 py-3 bg-white dark:bg-[#162033] border border-gray-200 dark:border-[#1e3a5f] rounded-full text-base text-[#12394d] dark:text-white placeholder:text-[#7b7c7d] dark:placeholder:text-white/40 focus:outline-none focus:border-[#1d5770] dark:focus:border-[#91b149] focus:ring-2 focus:ring-[#1d5770]/10 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-[#7b7c7d] dark:text-white/50 hover:text-[#12394d] dark:hover:text-white flex items-center justify-center transition-colors text-sm"
                  aria-label={locale === "en" ? "Clear search" : "مسح البحث"}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative md:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full md:w-auto appearance-none pr-10 pl-5 py-3 bg-white dark:bg-[#162033] border border-gray-200 dark:border-[#1e3a5f] rounded-full text-sm font-display font-semibold text-[#12394d] dark:text-white focus:outline-none focus:border-[#1d5770] dark:focus:border-[#91b149] focus:ring-2 focus:ring-[#1d5770]/10 cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b7c7d] dark:text-white/40 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* ── Category Filter ── */}
          <div
            className="mb-6 flex flex-wrap items-center gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar"
            dir="rtl"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-display font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#1d5770] text-white shadow-md shadow-[#1d5770]/20"
                      : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 hover:bg-[#1d5770]/10 hover:text-[#1d5770] dark:hover:text-[#91b149] border border-gray-200 dark:border-[#1e3a5f]"
                  }`}
                >
                  {t(cat.labelKey)}
                </button>
              );
            })}
          </div>

          {/* ── Stats line ── */}
          <div
            className="mb-8 flex items-center justify-between text-xs md:text-sm text-[#7b7c7d] dark:text-white/50"
            dir="rtl"
          >
            <span>
              {visibleCount === totalCount
                ? t("blogPage.showingAll").replace("{total}", String(totalCount))
                : t("blogPage.showingFiltered")
                    .replace("{shown}", String(visibleCount))
                    .replace("{total}", String(totalCount))}
            </span>
            {(activeCategory !== "all" || search.trim() || sort !== "newest") && (
              <button
                onClick={clearFilters}
                className="text-[#1d5770] dark:text-[#91b149] hover:underline font-bold"
              >
                {t("blogPage.clearFilters")}
              </button>
            )}
          </div>

          {/* ── Cards Grid ── */}
          <AnimatePresence mode="popLayout">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              dir="rtl"
            >
              {gridPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(i * 0.05, 0.4),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="group flex flex-col h-full bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-[#1e3a5f] no-underline"
                  >
                    {/* Card Image */}
                    <div className="relative h-48 md:h-52 overflow-hidden flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={`${post.title} — مقال في السياحة الاستشفائية في مصر`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                      <span className="absolute top-3 right-3 rounded-full bg-[#91b149] px-3 py-1 text-[11px] font-bold text-white">
                        {post.category}
                      </span>
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {post.readTime} د
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 flex flex-col p-5 md:p-6">
                      <h3 className="font-display text-lg font-bold text-[#12394d] dark:text-white mb-2 line-clamp-2 group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[#7b7c7d] dark:text-white/60 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Reading progress bar — shown if user has scrolled
                          ≥5% on this post in a previous visit. Tiny but
                          measurable retention nudge. */}
                      {progress[post.id] !== undefined && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-[#91b149] font-bold">
                              {progress[post.id] >= 90
                                ? `✓ ${t("blogPage.readingProgress.read")}`
                                : `${progress[post.id]}% ${t("blogPage.readingProgress.read")}`}
                            </span>
                            {progress[post.id] < 90 && (
                              <span className="text-[#7b7c7d] dark:text-white/40">
                                {t("blogPage.readingProgress.continueLabel")}
                              </span>
                            )}
                          </div>
                          <div className="h-1 bg-gray-100 dark:bg-[#1e3a5f] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#91b149]"
                              style={{ width: `${progress[post.id]}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-[#1e3a5f] pt-4 mt-auto">
                        <span className="text-xs text-[#7b7c7d] dark:text-white/50">
                          {fmtDate(post.date)}
                        </span>
                        <span className="text-xs font-display font-bold text-[#1d5770] dark:text-[#91b149] group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                          {progress[post.id] !== undefined &&
                          progress[post.id] < 90
                            ? t("blogPage.readingProgress.continueBtn")
                            : t("blogPage.readingProgress.readBtn")}{" "}
                          <span>←</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* ── Empty State ── */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
              dir="rtl"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1d5770]/10 dark:bg-[#91b149]/10 mb-5">
                <svg
                  className="h-10 w-10 text-[#1d5770] dark:text-[#91b149]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.5M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-[#12394d] dark:text-white mb-2">
                {search.trim()
                  ? t("blogPage.noResultsTitle")
                  : t("blogPage.noResultsCategory")}
              </h3>
              <p className="text-[#7b7c7d] dark:text-white/50 text-sm mb-5">
                {search.trim()
                  ? t("blogPage.noSearchResults").replace(
                      "{query}",
                      search,
                    )
                  : locale === "en"
                    ? "Pick a different category to see articles"
                    : "اختار تصنيف مختلف عشان تشوف مقالات"}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-full bg-[#1d5770] hover:bg-[#174860] text-white px-6 py-2.5 text-sm font-display font-bold transition-colors"
              >
                {t("blogPage.clearFilters")}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
