import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `الخريطة التفاعلية — ${SITE_NAME}`,
  description:
    "خريطة تفاعلية لكل الوجهات الاستشفائية في مصر — موقع كل وجهة، مسافتها من القاهرة، وأنواع العلاج المتاحة.",
  alternates: { canonical: `${SITE_URL}/map` },
  openGraph: {
    title: `خريطة واحة التفاعلية`,
    description: "الوجهات الاستشفائية في مصر على الخريطة.",
    url: `${SITE_URL}/map`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
