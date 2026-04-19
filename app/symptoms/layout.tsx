import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `فاحص الأعراض — ${SITE_NAME}`,
  description:
    "أداة ذكية بترشحلك الوجهة الاستشفائية الأنسب لحالتك الصحية بناءً على أعراضك.",
  alternates: { canonical: `${SITE_URL}/symptoms` },
  openGraph: {
    title: `فاحص الأعراض — واحة`,
    description: "اعرف الوجهة المناسبة لحالتك الصحية.",
    url: `${SITE_URL}/symptoms`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
