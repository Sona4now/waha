import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  return {
    title: isEn
      ? `Best therapeutic tourism destinations in Egypt — ${SITE_NAME}`
      : `أفضل وجهات السياحة الاستشفائية في مصر — ${SITE_NAME}`,
    description: isEn
      ? "The 7 best therapeutic tourism destinations in Egypt: Safaga (psoriasis and rheumatism with black sand therapy), Siwa (sulfur springs), Sinai (mountains and asthma relief), Fayoum, Bahariya Oasis, Wadi Degla, and Shagie Farms. Book your natural healing trip."
      : "أفضل 7 وجهات للسياحة الاستشفائية في مصر: سفاجا (الصدفية والروماتيزم بالرمال السوداء)، سيوة (المياه الكبريتية)، سيناء (الجبال والربو)، الفيوم، الواحات البحرية، وادي دجلة، ومزارع شجيع. احجز رحلتك العلاجية الطبيعية.",
    keywords: isEn
      ? [
          "best therapeutic tourism destinations in Egypt",
          "Egyptian wellness destinations",
          "therapeutic tourism in Egypt",
          "natural healing places in Egypt",
          "natural therapy Egypt",
          "wellness tourism Egypt",
          "wellness tourism Egypt destinations",
        ]
      : [
          "أفضل وجهات السياحة الاستشفائية في مصر",
          "وجهات استشفائية مصرية",
          "السياحة الاستشفائية في مصر",
          "أماكن العلاج الطبيعي في مصر",
          "علاج طبيعي مصر",
          "السياحة العلاجية مصر",
          "wellness tourism Egypt destinations",
        ],
    alternates: { canonical: `${SITE_URL}/destinations` },
    openGraph: {
      title: isEn
        ? `Best therapeutic tourism destinations in Egypt — ${SITE_NAME}`
        : `أفضل وجهات السياحة الاستشفائية في مصر — ${SITE_NAME}`,
      description: isEn
        ? "7 natural therapeutic tourism destinations in Egypt — sulfur waters, healing sands, mountains, and oases. Transparent pricing and WhatsApp booking."
        : "7 وجهات للسياحة الاستشفائية الطبيعية في مصر — مياه كبريتية، رمال علاجية، جبال، وواحات. أسعار شفافة وحجز عبر واتساب.",
      url: `${SITE_URL}/destinations`,
      images: [DEFAULT_OG_IMAGE],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEn
        ? `Best therapeutic tourism destinations in Egypt — ${SITE_NAME}`
        : `أفضل وجهات السياحة الاستشفائية في مصر — ${SITE_NAME}`,
      description: isEn
        ? "7 natural therapeutic tourism destinations in Egypt. Book via WhatsApp."
        : "7 وجهات للسياحة الاستشفائية الطبيعية في مصر. حجز عبر واتساب.",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
