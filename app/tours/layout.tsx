import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn ? `360° Tours — ${SITE_NAME}` : `جولات 360° — ${SITE_NAME}`,
    description: isEn
      ? "360° virtual tours of Egypt's top therapeutic destinations — explore Safaga, Siwa, and the White Desert as if you were there."
      : "جولات افتراضية 360° لأهم الوجهات الاستشفائية في مصر — استكشف سفاجا، سيوة، والصحراء البيضاء كأنك هناك.",
    alternates: { canonical: `${SITE_URL}/tours` },
    openGraph: {
      title: isEn
        ? `360° Virtual Tours — ${SITE_NAME}`
        : `جولات افتراضية 360° — ${SITE_NAME}`,
      description: isEn
        ? "Explore therapeutic destinations through an immersive experience."
        : "استكشف الوجهات الاستشفائية بتجربة غامرة.",
      url: `${SITE_URL}/tours`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
