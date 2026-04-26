import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `مدونة السياحة الاستشفائية في مصر — ${SITE_NAME}`,
  description:
    "مقالات السياحة الاستشفائية في مصر — العلاج الطبيعي بالمياه الكبريتية والرمال السوداء، أفضل الوجهات العلاجية، ونصائح قبل السفر. دليلك الشامل للعلاج الطبيعي في مصر.",
  keywords: [
    "مدونة السياحة الاستشفائية",
    "مقالات السياحة العلاجية مصر",
    "العلاج الطبيعي مصر",
    "السياحة الاستشفائية في مصر",
    "مقالات صحية مصر",
    "blog wellness tourism Egypt",
  ],
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `مدونة السياحة الاستشفائية في مصر — ${SITE_NAME}`,
    description:
      "16+ مقال عن العلاج الطبيعي والسياحة الاستشفائية في مصر — العلاج بالمياه الكبريتية، الرمال السوداء، والمناخ الطبيعي.",
    url: `${SITE_URL}/blog`,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `مدونة السياحة الاستشفائية في مصر — ${SITE_NAME}`,
    description: "دليلك الشامل للعلاج الطبيعي والسياحة الاستشفائية في مصر.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
