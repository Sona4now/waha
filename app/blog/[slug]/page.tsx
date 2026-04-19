import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteLayout from "@/components/site/SiteLayout";
import { BLOG_POSTS, getBlogPost, type BlogPost } from "@/data/siteData";
import { SITE_NAME, SITE_URL } from "@/lib/siteMeta";

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
  if (!post) return { title: `المقال غير موجود — ${SITE_NAME}` };
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

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
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
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = relatedPosts(post);

  return (
    <SiteLayout>
      {/* ── Hero ── */}
      <header className="relative w-full h-[46vh] min-h-[340px] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        <div
          className="absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-4xl mx-auto"
          dir="rtl"
        >
          <div className="flex items-center gap-3 mb-3 text-[11px]">
            <Link
              href="/blog"
              className="text-white/70 hover:text-white no-underline transition-colors"
            >
              ← المدونة
            </Link>
            <span className="text-white/30">·</span>
            <span className="rounded-full bg-[#91b149] px-3 py-1 text-white font-semibold">
              {post.category}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white/70">{post.readTime} دقائق قراءة</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl mb-3">
            {post.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-4 text-xs text-white/50">
            نُشر في {fmtDate(post.date)}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <article
        className="bg-white dark:bg-[#0d1b2a] py-14"
        dir="rtl"
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

          {/* ── Back link ── */}
          <div className="pt-8 border-t border-gray-200 dark:border-[#1e3a5f]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#1d5770] dark:text-[#91b149] font-display font-bold text-sm no-underline hover:gap-3 transition-all"
            >
              <span>←</span>
              <span>العودة لكل المقالات</span>
            </Link>
          </div>
        </div>
      </article>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section
          className="bg-[#f5f8fa] dark:bg-[#0a151f] py-14"
          dir="rtl"
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-2xl font-bold text-[#12394d] dark:text-white mb-8 text-center">
              اقرأ أيضاً
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
                      alt={r.title}
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
