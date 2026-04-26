import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `دليل الأطباء — ${SITE_NAME}`,
  description:
    "أطباء واستشاريون متخصصون في الأمراض اللي بتستفيد من السياحة الاستشفائية في مصر. استشارة قبل وبعد رحلتك العلاجية.",
  alternates: { canonical: `${SITE_URL}/doctors` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
