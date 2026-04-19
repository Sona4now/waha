import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `المدونة — ${SITE_NAME}`,
  description:
    "مقالات توعوية عن السياحة الاستشفائية في مصر — العلاج الطبيعي، الوجهات، ونصائح قبل السفر.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `مدونة واحة`,
    description: "مقالات السياحة الاستشفائية والعلاج الطبيعي في مصر.",
    url: `${SITE_URL}/blog`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
