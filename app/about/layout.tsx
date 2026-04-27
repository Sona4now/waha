import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn ? `About us — ${SITE_NAME}` : `من نحن — ${SITE_NAME}`,
    description: isEn
      ? "Waaha is a digital content platform raising awareness of sustainable eco-tourism and natural healing in Egypt."
      : "واحة منصة محتوى رقمية للتوعية بالسياحة البيئية المستدامة والاستشفاء من الطبيعة في مصر.",
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
      title: isEn ? `About us — ${SITE_NAME}` : `من نحن — ${SITE_NAME}`,
      description: isEn
        ? "A digital content platform for eco-tourism and natural healing in Egypt."
        : "منصة محتوى رقمية للسياحة البيئية والاستشفاء من الطبيعة في مصر.",
      url: `${SITE_URL}/about`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
