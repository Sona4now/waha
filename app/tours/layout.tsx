import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `جولات 360° — ${SITE_NAME}`,
  description:
    "جولات افتراضية 360° لأهم الوجهات الاستشفائية في مصر — استكشف سفاجا، سيوة، والصحراء البيضاء كأنك هناك.",
  alternates: { canonical: `${SITE_URL}/tours` },
  openGraph: {
    title: `جولات افتراضية 360° — ${SITE_NAME}`,
    description: "استكشف الوجهات الاستشفائية بتجربة غامرة.",
    url: `${SITE_URL}/tours`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
