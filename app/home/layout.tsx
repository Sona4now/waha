import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn ? `Home — ${SITE_NAME}` : `الرئيسية — ${SITE_NAME}`,
    description: isEn
      ? "Discover your healing journey in the heart of Egypt — natural therapeutic destinations, mineral water therapy, hot sands, and pure air."
      : "استكشف رحلة شفائك في قلب مصر — وجهات استشفائية طبيعية، علاج بالمياه المعدنية، الرمال الساخنة، والهواء النقي.",
    alternates: { canonical: `${SITE_URL}/home` },
    openGraph: {
      title: SITE_NAME,
      description: isEn
        ? "A healing journey from the heart of Egyptian nature."
        : "رحلة شفاء من قلب الطبيعة المصرية.",
      url: `${SITE_URL}/home`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
