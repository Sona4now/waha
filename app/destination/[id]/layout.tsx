import type { Metadata } from "next";
import { DESTINATIONS } from "@/data/siteData";
import { SITE_URL } from "@/lib/siteMeta";

/**
 * Per-destination metadata. Each title uses the exact target phrase
 * "السياحة الاستشفائية في مصر" because the destination pages are the
 * highest-intent landing pages — when someone searches for the phrase plus
 * a city ("سياحة استشفائية سفاجا"), we want this page to win.
 *
 * The description includes treatment keywords for that destination so
 * Google can match more specific queries.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dest = DESTINATIONS.find((d) => d.id === id);

  if (!dest) {
    return {
      title: "وجهة غير موجودة — واحة",
      robots: { index: false, follow: false },
    };
  }

  const treatments = dest.treatments?.slice(0, 3).join("، ") ?? "";
  const description = `${dest.description} علاج طبيعي بـ${treatments}. السياحة الاستشفائية في ${dest.name} — أسعار شفافة، حجز عبر واتساب.`;

  return {
    title: `السياحة الاستشفائية في ${dest.name} — ${dest.name} العلاجية | واحة`,
    description,
    keywords: [
      `سياحة استشفائية ${dest.name}`,
      `علاج طبيعي ${dest.name}`,
      `${dest.name} ${treatments}`,
      `${dest.name} العلاجية`,
      "السياحة الاستشفائية في مصر",
      "علاج طبيعي مصر",
      ...(dest.treatments ?? []).map((t) => `علاج ${t} ${dest.name}`),
    ],
    alternates: {
      canonical: `${SITE_URL}/destination/${dest.id}`,
    },
    openGraph: {
      title: `السياحة الاستشفائية في ${dest.name} | واحة`,
      description,
      url: `${SITE_URL}/destination/${dest.id}`,
      images: [
        {
          url: dest.heroBg || dest.image,
          width: 1200,
          height: 630,
          alt: `السياحة الاستشفائية في ${dest.name} — ${dest.description}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `السياحة الاستشفائية في ${dest.name} | واحة`,
      description,
      images: [dest.image],
    },
  };
}

export default function DestinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
