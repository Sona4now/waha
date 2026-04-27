import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn ? `Contact us — ${SITE_NAME}` : `تواصل معنا — ${SITE_NAME}`,
    description: isEn
      ? "Get in touch with the Waaha team — we're happy to answer your questions."
      : "تواصل مع فريق واحة — نحن سعداء بالإجابة على استفساراتك.",
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
      title: isEn ? `Contact Waaha` : `تواصل مع واحة`,
      description: isEn
        ? "The Waaha team is ready to answer your questions."
        : "فريق واحة جاهز للإجابة على استفساراتك.",
      url: `${SITE_URL}/contact`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
