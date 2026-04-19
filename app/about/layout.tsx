import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `من نحن — ${SITE_NAME}`,
  description:
    "واحة منصة محتوى رقمية للتوعية بالسياحة البيئية المستدامة والاستشفاء من الطبيعة في مصر.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `من نحن — ${SITE_NAME}`,
    description:
      "منصة محتوى رقمية للسياحة البيئية والاستشفاء من الطبيعة في مصر.",
    url: `${SITE_URL}/about`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
