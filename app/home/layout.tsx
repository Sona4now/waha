import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `الرئيسية — ${SITE_NAME}`,
  description:
    "استكشف رحلة شفائك في قلب مصر — وجهات استشفائية طبيعية، علاج بالمياه المعدنية، الرمال الساخنة، والهواء النقي.",
  alternates: { canonical: `${SITE_URL}/home` },
  openGraph: {
    title: SITE_NAME,
    description: "رحلة شفاء من قلب الطبيعة المصرية.",
    url: `${SITE_URL}/home`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
