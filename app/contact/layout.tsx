import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `تواصل معنا — ${SITE_NAME}`,
  description: "تواصل مع فريق واحة — نحن سعداء بالإجابة على استفساراتك.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `تواصل مع واحة`,
    description: "فريق واحة جاهز للإجابة على استفساراتك.",
    url: `${SITE_URL}/contact`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
