import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `أفضل وجهات السياحة الاستشفائية في مصر — ${SITE_NAME}`,
  description:
    "أفضل 7 وجهات للسياحة الاستشفائية في مصر: سفاجا (الصدفية والروماتيزم بالرمال السوداء)، سيوة (المياه الكبريتية)، سيناء (الجبال والربو)، الفيوم، الواحات البحرية، وادي دجلة، ومزارع شجيع. احجز رحلتك العلاجية الطبيعية.",
  keywords: [
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
    title: `أفضل وجهات السياحة الاستشفائية في مصر — ${SITE_NAME}`,
    description:
      "7 وجهات للسياحة الاستشفائية الطبيعية في مصر — مياه كبريتية، رمال علاجية، جبال، وواحات. أسعار شفافة وحجز عبر واتساب.",
    url: `${SITE_URL}/destinations`,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `أفضل وجهات السياحة الاستشفائية في مصر — ${SITE_NAME}`,
    description:
      "7 وجهات للسياحة الاستشفائية الطبيعية في مصر. حجز عبر واتساب.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
