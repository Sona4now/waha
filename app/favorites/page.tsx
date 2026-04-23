"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import FavoriteButton from "@/components/site/FavoriteButton";
import EmptyState from "@/components/site/EmptyState";
import { useFavorites } from "@/hooks/useFavorites";
import { DESTINATIONS, BLOG_POSTS } from "@/data/siteData";

/**
 * Favorites page.
 *
 * Reads from useFavorites (single source of truth) and dereferences each
 * entry against DESTINATIONS/BLOG_POSTS to show the real name + image. If
 * an entry points at something that no longer exists (e.g. a blog post that
 * was deleted) we silently drop it rather than showing a broken row.
 */

type Tab = "all" | "dest" | "blog";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "all", label: "الكل", icon: "❤️" },
  { key: "dest", label: "وجهات", icon: "🏞️" },
  { key: "blog", label: "مقالات", icon: "📖" },
];

export default function FavoritesPage() {
  const { loaded, list, count } = useFavorites();
  const [tab, setTab] = useState<Tab>("all");

  const destItems = useMemo(
    () =>
      list("dest")
        .map((f) => ({
          fav: f,
          item: DESTINATIONS.find((d) => d.id === f.id),
        }))
        .filter((x): x is { fav: typeof x.fav; item: (typeof DESTINATIONS)[number] } => !!x.item),
    [list],
  );
  const blogItems = useMemo(
    () =>
      list("blog")
        .map((f) => ({
          fav: f,
          item: BLOG_POSTS.find((p) => p.id === f.id),
        }))
        .filter((x): x is { fav: typeof x.fav; item: (typeof BLOG_POSTS)[number] } => !!x.item),
    [list],
  );

  const showDest = tab === "all" || tab === "dest";
  const showBlog = tab === "all" || tab === "blog";
  const total = count();

  return (
    <SiteLayout>
      <PageHero
        title="مفضّلتك"
        subtitle="كل اللي حفظته في مكان واحد"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "المفضلة" },
        ]}
      />

      <section className="py-10 md:py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f] min-h-[50vh]">
        <div className="max-w-5xl mx-auto" dir="rtl">
          {/* Tab row */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    active
                      ? "bg-[#1d5770] text-white border-[#1d5770] shadow-md"
                      : "bg-white dark:bg-[#162033] text-[#7b7c7d] dark:text-white/60 border-[#d1d5db] dark:border-[#1e3a5f] hover:border-[#1d5770]"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {!loaded ? (
            <div className="text-center py-16 text-[#7b7c7d] text-sm">
              جاري التحميل…
            </div>
          ) : total === 0 ? (
            <EmptyState
              icon="🤍"
              title="لسه ما حفظتش حاجة"
              description="اضغط على زر ❤️ على أي وجهة أو مقالة وهتلاقيها هنا."
              action={
                <Link
                  href="/destinations"
                  className="px-6 py-3 rounded-full bg-gradient-to-l from-[#91b149] to-[#6a8435] text-white font-bold text-sm no-underline inline-block hover:shadow-lg transition-shadow"
                >
                  تصفّح الوجهات
                </Link>
              }
            />
          ) : (
            <div className="space-y-10">
              {/* Destinations */}
              {showDest && destItems.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                    🏞️ وجهات ({destItems.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence>
                      {destItems.map(({ item: d }) => (
                        <motion.div
                          key={`dest-${d.id}`}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative"
                        >
                          <Link
                            href={`/destination/${d.id}`}
                            className="block bg-white dark:bg-[#162033] rounded-2xl overflow-hidden border border-[#d0dde4] dark:border-[#1e3a5f] no-underline hover:-translate-y-1 transition-transform shadow-sm hover:shadow-lg"
                          >
                            <div className="relative h-44 overflow-hidden">
                              <Image
                                src={d.image}
                                alt={d.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                              <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#91b149] text-white">
                                {d.envIcon} {d.environment}
                              </span>
                              <div className="absolute top-3 left-3">
                                <FavoriteButton type="dest" id={d.id} />
                              </div>
                              <div className="absolute bottom-3 right-4 left-4">
                                <h3 className="text-xl font-bold text-white font-display drop-shadow">
                                  {d.name}
                                </h3>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-sm text-[#7b7c7d] dark:text-white/60 line-clamp-2">
                                {d.pitch || d.description}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Blog posts */}
              {showBlog && blogItems.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#91b149] font-bold mb-3">
                    📖 مقالات ({blogItems.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {blogItems.map(({ item: p }) => (
                        <motion.div
                          key={`blog-${p.id}`}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative"
                        >
                          <Link
                            href={`/blog/${p.id}`}
                            className="flex gap-3 bg-white dark:bg-[#162033] rounded-2xl overflow-hidden border border-[#d0dde4] dark:border-[#1e3a5f] no-underline hover:-translate-y-0.5 transition-transform shadow-sm hover:shadow-lg"
                          >
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <Image
                                src={p.image}
                                alt={p.title}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 p-3">
                              <h4 className="text-sm font-bold text-[#12394d] dark:text-white leading-snug line-clamp-2 mb-1">
                                {p.title}
                              </h4>
                              <p className="text-xs text-[#7b7c7d] dark:text-white/50 line-clamp-2">
                                {p.excerpt}
                              </p>
                              <div className="text-[10px] text-[#91b149] mt-1 font-bold">
                                {p.readTime} دقائق قراءة
                              </div>
                            </div>
                            <div className="self-start p-2">
                              <FavoriteButton
                                type="blog"
                                id={p.id}
                                variant="icon"
                              />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Per-tab empty state (total>0 but this tab is empty) */}
              {tab === "dest" && destItems.length === 0 && (
                <EmptyState
                  icon="🏞️"
                  title="ما حفظتش وجهات لسه"
                  description="افتح أي وجهة واضغط ❤️"
                />
              )}
              {tab === "blog" && blogItems.length === 0 && (
                <EmptyState
                  icon="📖"
                  title="ما حفظتش مقالات لسه"
                  description="افتح أي مقالة واضغط ❤️"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
