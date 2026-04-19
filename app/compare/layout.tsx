import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `مقارنة الوجهات — ${SITE_NAME}`,
  description:
    "قارن بين وجهات السياحة الاستشفائية في مصر جنب بعض — العلاجات، الطقس، المدة، والتكلفة.",
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: {
    title: `قارن الوجهات — واحة`,
    description: "مقارنة تفصيلية بين الوجهات الاستشفائية المصرية.",
    url: `${SITE_URL}/compare`,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
