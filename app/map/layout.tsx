import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn
      ? `Interactive map — ${SITE_NAME}`
      : `الخريطة التفاعلية — ${SITE_NAME}`,
    description: isEn
      ? "An interactive map of every therapeutic destination in Egypt — each location, distance from Cairo, and the types of therapy available."
      : "خريطة تفاعلية لكل الوجهات الاستشفائية في مصر — موقع كل وجهة، مسافتها من القاهرة، وأنواع العلاج المتاحة.",
    alternates: { canonical: `${SITE_URL}/map` },
    openGraph: {
      title: isEn ? `Waaha interactive map` : `خريطة واحة التفاعلية`,
      description: isEn
        ? "Therapeutic destinations in Egypt on the map."
        : "الوجهات الاستشفائية في مصر على الخريطة.",
      url: `${SITE_URL}/map`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
