import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import SiteLayout from "@/components/site/SiteLayout";
import BlogShareButton from "@/components/site/BlogShareButton";
import BlogReadingTracker from "@/components/site/BlogReadingTracker";
import JsonLd from "@/components/site/JsonLd";
import {
  LOCALE_COOKIE,
  normaliseLocale,
  getTranslation,
} from "@/lib/i18n";
import { localizeBlogPost, localizeDestination } from "@/lib/localize";
import {
  BLOG_POSTS,
  DESTINATIONS,
  getBlogPost,
  type BlogPost,
  type DestinationFull,
} from "@/data/siteData";
import { SITE_NAME, SITE_URL } from "@/lib/siteMeta";
import { articleSchema, breadcrumbSchema } from "@/lib/structuredData";

/**
 * Map blog posts → relevant destinations for cross-linking.
 *
 * SEO win: each blog post gets 1-3 anchor links to destination pages,
 * which Google uses both for crawl discovery and to attribute relevance.
 * Destination pages also benefit because each gets multiple inbound
 * internal links from topically-related articles.
 *
 * Strategy: scan post content for destination names + treatments, take
 * the top 3 hits.
 */
function getRelatedDestinations(post: BlogPost): DestinationFull[] {
  const haystack = (
    post.title +
    " " +
    post.excerpt +
    " " +
    (post.content?.flatMap((s) => s.paragraphs).join(" ") ?? "")
  ).toLowerCase();

  const scored = DESTINATIONS.map((d) => {
    let score = 0;
    if (haystack.includes(d.name.toLowerCase())) score += 5;
    if (haystack.includes(d.nameEn.toLowerCase())) score += 2;
    for (const t of d.treatments ?? []) {
      if (haystack.includes(t.toLowerCase())) score += 1;
    }
    return { d, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((x) => x.d);
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post)
    return {
      title: `المقال غير موجود — ${SITE_NAME}`,
      description: "Article not found / المقال غير موجود",
    };
  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.id}`,
      images: [post.image],
      type: "article",
      publishedTime: post.date,
    },
  };
}

function fmtDate(iso: string, locale: "ar" | "en"): string {
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

/** Pick 3 most recent posts excluding the current one. */
function relatedPosts(current: BlogPost): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.id !== current.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawPost = getBlogPost(slug);
  if (!rawPost) notFound();

  // Read locale from cookie on the server so SSR markup, schema.org,
  // and visible copy all match the user's preference on first paint.
  const cookieStore = await cookies();
  const locale = normaliseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const t = (key: string) => getTranslation(locale, key);

  const post = localizeBlogPost(rawPost, locale);
  const related = relatedPosts(rawPost).map((p) =>
    localizeBlogPost(p, locale),
  );
  const relatedDestinations = getRelatedDestinations(rawPost).map((d) =>
    localizeDestination(d, locale),
  );

  return (
    <SiteLayout>
      {/* Track scroll progress per-post so the blog list can show
          "كمل من حيث وقفت" on cards the user has partially read. */}
      <BlogReadingTracker postId={post.id} />

      {/* SEO: structured data — Article + Breadcrumb. Goes in the SSR HTML
          since this is a server component. */}
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            image: post.image,
            datePublished: post.date,
            url: `${SITE_URL}/blog/${post.id}`,
          }),
          breadcrumbSchema([
            {
              name: locale === "en" ? "Home" : "الرئيسية",
              url: `${SITE_URL}/home`,
            },
            {
              name: locale === "en" ? "Blog" : "المدونة",
              url: `${SITE_URL}/blog`,
            },
            { name: post.title, url: `${SITE_URL}/blog/${post.id}` },
          ]),
        ]}
      />

      {/* ── Hero ── */}
      <header className="relative w-full h-[46vh] min-h-[340px] overflow-hidden">
        <Image
          src={post.image}
          alt={
            locale === "en"
              ? `${post.title} — Therapeutic tourism blog in Egypt`
              : `${post.title} — مدونة السياحة الاستشفائية في مصر`
          }
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        <div
          className="absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-4xl mx-auto"
          dir={locale === "en" ? "ltr" : "rtl"}
        >
          <div className="flex items-center gap-3 mb-3 text-[11px]">
            <Link
              href="/blog"
              className="text-white/70 hover:text-white no-underline transition-colors"
            >
              ← {t("nav.blog")}
            </Link>
            <span className="text-white/30">·</span>
            <span className="rounded-full bg-[#91b149] px-3 py-1 text-white font-semibold">
              {post.category}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white/70">
              {post.readTime} {t("blogPost.minutesRead")}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl mb-3">
            {post.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-4 text-xs text-white/50">
            {t("blogPost.publishedOn")} {fmtDate(post.date, locale)}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <article
        className="bg-white dark:bg-[#0d1b2a] py-14"
        dir={locale === "en" ? "ltr" : "rtl"}
      >
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          {post.content && post.content.length > 0 ? (
            post.content.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="font-display text-xl md:text-2xl font-bold text-[#1d5770] dark:text-[#91b149] mb-4">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-4">
                  {section.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="text-[#12394d] dark:text-white/80 text-base md:text-[1.05rem] leading-[1.95]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="text-[#7b7c7d] dark:text-white/60 italic">
              {post.excerpt}
            </p>
          )}

          {/* Smart cross-link: destinations mentioned in this article.
              Improves SEO (internal anchor distribution) and conversion
              (article reader → destination → lead form). */}
          {relatedDestinations.length > 0 && (
            <div className="not-prose mt-10 rounded-2xl bg-gradient-to-br from-[#f0f7ed] to-white dark:from-[#162033] dark:to-[#0a151f] border border-[#91b149]/30 p-5 md:p-6">
              <p className="text-xs font-bold text-[#91b149] uppercase tracking-wider mb-3">
                {t("blogPage.relatedDestinationsTitle")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedDestinations.map((d) => (
                  <Link
                    key={d.id}
                    href={`/destination/${d.id}`}
                    className="group flex items-center gap-3 bg-white dark:bg-[#0a151f] hover:bg-[#1d5770]/5 dark:hover:bg-[#91b149]/10 border border-gray-100 dark:border-[#1e3a5f] rounded-xl p-3 transition-all no-underline"
                  >
                    <span className="text-2xl flex-shrink-0">
                      {d.envIcon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-display font-bold text-[#12394d] dark:text-white group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors truncate">
                        {d.name}
                      </div>
                      <div className="text-[11px] text-[#7b7c7d] dark:text-white/50 truncate">
                        {d.pitch}
                      </div>
                    </div>
                    <span className="text-[#91b149] flex-shrink-0">←</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Footer: share + back ── */}
          <div className="pt-8 border-t border-gray-200 dark:border-[#1e3a5f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#1d5770] dark:text-[#91b149] font-display font-bold text-sm no-underline hover:gap-3 transition-all"
            >
              <span>←</span>
              <span>{t("blogPage.back")}</span>
            </Link>
            <BlogShareButton title={post.title} />
          </div>
        </div>
      </article>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section
          className="bg-[#f5f8fa] dark:bg-[#0a151f] py-14"
          dir={locale === "en" ? "ltr" : "rtl"}
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-2xl font-bold text-[#12394d] dark:text-white mb-8 text-center">
              {t("blogPage.alsoRead")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.id}`}
                  className="group block bg-white dark:bg-[#162033] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-[#1e3a5f] no-underline"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={r.image}
                      alt={
                        locale === "en"
                          ? `${r.title} — Therapeutic tourism in Egypt`
                          : `${r.title} — السياحة الاستشفائية في مصر`
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 right-3 rounded-full bg-[#91b149] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                      {r.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-[#12394d] dark:text-white text-base mb-2 line-clamp-2 group-hover:text-[#1d5770] dark:group-hover:text-[#91b149] transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-[#7b7c7d] dark:text-white/60 text-xs leading-relaxed line-clamp-2">
                      {r.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
