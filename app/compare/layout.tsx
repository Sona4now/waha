import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn
      ? `Compare destinations — ${SITE_NAME}`
      : `مقارنة الوجهات — ${SITE_NAME}`,
    description: isEn
      ? "Compare Egypt's therapeutic tourism destinations side by side — treatments, weather, duration, and cost."
      : "قارن بين وجهات السياحة الاستشفائية في مصر جنب بعض — العلاجات، الطقس، المدة، والتكلفة.",
    alternates: { canonical: `${SITE_URL}/compare` },
    openGraph: {
      title: isEn ? `Compare destinations — Waaha` : `قارن الوجهات — واحة`,
      description: isEn
        ? "A detailed comparison between Egyptian therapeutic destinations."
        : "مقارنة تفصيلية بين الوجهات الاستشفائية المصرية.",
      url: `${SITE_URL}/compare`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
