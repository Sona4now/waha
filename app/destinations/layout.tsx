import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `الأماكن الاستشفائية — ${SITE_NAME}`,
  description:
    "استكشف 7 وجهات للسياحة الاستشفائية في مصر: سفاجا، سيوة، سيناء، الفيوم، الواحات البحرية، وادي دجلة، ومزارع شجيع.",
  alternates: { canonical: `${SITE_URL}/destinations` },
  openGraph: {
    title: `الأماكن الاستشفائية — ${SITE_NAME}`,
    description:
      "7 وجهات استشفائية مصرية — من البحر الأحمر لصحاري سيوة وجبال سيناء.",
    url: `${SITE_URL}/destinations`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
