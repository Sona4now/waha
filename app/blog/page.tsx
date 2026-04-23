"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { BLOG_POSTS } from "@/data/siteData";

/** Category filter — values match `post.category` in data/siteData.ts. */
const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "معلومات", label: "معلومات" },
  { id: "وجهات", label: "وجهات" },
  { id: "صحة", label: "صحة" },
  { id: "نصائح", label: "نصائح" },
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

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = useMemo(() => {
    const list =
      activeCategory === "all"
        ? BLOG_POSTS
        : BLOG_POSTS.filter((post) => post.category === activeCategory);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [activeCategory]);

  return (
    <SiteLayout>
      <PageHero
        title="المدونة"
        subtitle="مقالات توعوية عن السياحة البيئية والاستشفاء من الطبيعة في مصر"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "المدونة" },
        ]}
      />

      <section className="bg-[#f5f8fa] dark:bg-[#0a151f] py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter Pills */}
          <div className="mb-12 flex flex-wrap justify-center gap-3" dir="rtl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-6 py-2.5 text-sm font-display font-semibold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-[#1d5770] text-white shadow-lg shadow-[#1d5770]/25"
                    : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 hover:bg-[#1d5770]/10 hover:text-[#1d5770] border border-gray-200 dark:border-[#1e3a5f]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Blog Cards Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            dir="rtl"
          >
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-[#1e3a5f] no-underline"
              >
                {/* Card Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Category Badge */}
                  <span className="absolute top-4 right-4 rounded-full bg-[#91b149] px-3 py-1 text-xs font-semibold text-white">
                    {post.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-[#12394d] dark:text-white mb-3 line-clamp-2 group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#7b7c7d] dark:text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-[#1e3a5f] pt-4">
                    <span className="text-xs text-[#7b7c7d] dark:text-white/50">
                      {fmtDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#7b7c7d] dark:text-white/50">
                      <svg
                        className="h-4 w-4"
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
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16" dir="rtl">
              <p className="text-[#7b7c7d] dark:text-white/50 text-lg font-display">
                لا توجد مقالات في هذا التصنيف حالياً
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
