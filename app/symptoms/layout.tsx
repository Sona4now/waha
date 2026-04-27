import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn
      ? `Symptom checker — ${SITE_NAME}`
      : `فاحص الأعراض — ${SITE_NAME}`,
    description: isEn
      ? "A smart tool that recommends the most suitable therapeutic destination for your health condition based on your symptoms."
      : "أداة ذكية بترشحلك الوجهة الاستشفائية الأنسب لحالتك الصحية بناءً على أعراضك.",
    alternates: { canonical: `${SITE_URL}/symptoms` },
    openGraph: {
      title: isEn ? `Symptom checker — Waaha` : `فاحص الأعراض — واحة`,
      description: isEn
        ? "Find the destination that fits your health condition."
        : "اعرف الوجهة المناسبة لحالتك الصحية.",
      url: `${SITE_URL}/symptoms`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
