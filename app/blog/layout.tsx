import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn
      ? `Therapeutic tourism blog in Egypt — ${SITE_NAME}`
      : `مدونة السياحة الاستشفائية في مصر — ${SITE_NAME}`,
    description: isEn
      ? "Articles on therapeutic tourism in Egypt — natural healing with sulfur waters and black sands, the best therapeutic destinations, and pre-travel tips. Your complete guide to natural healing in Egypt."
      : "مقالات السياحة الاستشفائية في مصر — العلاج الطبيعي بالمياه الكبريتية والرمال السوداء، أفضل الوجهات العلاجية، ونصائح قبل السفر. دليلك الشامل للعلاج الطبيعي في مصر.",
    keywords: isEn
      ? [
          "therapeutic tourism blog",
          "wellness tourism articles Egypt",
          "natural healing Egypt",
          "therapeutic tourism in Egypt",
          "health articles Egypt",
          "blog wellness tourism Egypt",
        ]
      : [
          "مدونة السياحة الاستشفائية",
          "مقالات السياحة العلاجية مصر",
          "العلاج الطبيعي مصر",
          "السياحة الاستشفائية في مصر",
          "مقالات صحية مصر",
          "blog wellness tourism Egypt",
        ],
    alternates: { canonical: `${SITE_URL}/blog` },
    openGraph: {
      title: isEn
        ? `Therapeutic tourism blog in Egypt — ${SITE_NAME}`
        : `مدونة السياحة الاستشفائية في مصر — ${SITE_NAME}`,
      description: isEn
        ? "16+ articles on natural healing and therapeutic tourism in Egypt — therapy with sulfur waters, black sands, and natural climate."
        : "16+ مقال عن العلاج الطبيعي والسياحة الاستشفائية في مصر — العلاج بالمياه الكبريتية، الرمال السوداء، والمناخ الطبيعي.",
      url: `${SITE_URL}/blog`,
      images: [DEFAULT_OG_IMAGE],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEn
        ? `Therapeutic tourism blog in Egypt — ${SITE_NAME}`
        : `مدونة السياحة الاستشفائية في مصر — ${SITE_NAME}`,
      description: isEn
        ? "Your complete guide to natural healing and therapeutic tourism in Egypt."
        : "دليلك الشامل للعلاج الطبيعي والسياحة الاستشفائية في مصر.",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
