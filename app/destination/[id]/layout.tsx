import type { Metadata } from "next";
import { DESTINATIONS } from "@/data/siteData";
import { SITE_URL } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";
import { localizeDestination } from "@/lib/localize";

/**
 * Per-destination metadata. Each title uses the exact target phrase
 * "السياحة الاستشفائية في مصر" because the destination pages are the
 * highest-intent landing pages — when someone searches for the phrase plus
 * a city ("سياحة استشفائية سفاجا"), we want this page to win.
 *
 * The description includes treatment keywords for that destination so
 * Google can match more specific queries. Both AR and EN metadata are
 * generated based on the cookie-stored locale at request time.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const rawDest = DESTINATIONS.find((d) => d.id === id);
  const { locale } = await getServerTranslations();
  const isEn = locale === "en";

  if (!rawDest) {
    return {
      title: isEn ? "Destination not found — Waaha" : "وجهة غير موجودة — واحة",
      robots: { index: false, follow: false },
    };
  }

  const dest = localizeDestination(rawDest, locale);
  const treatments =
    dest.treatments?.slice(0, 3).join(isEn ? ", " : "، ") ?? "";
  const description = isEn
    ? `${dest.description} Natural therapy with ${treatments}. Therapeutic tourism in ${dest.name} — transparent pricing, WhatsApp booking.`
    : `${dest.description} علاج طبيعي بـ${treatments}. السياحة الاستشفائية في ${dest.name} — أسعار شفافة، حجز عبر واتساب.`;

  const title = isEn
    ? `Therapeutic tourism in ${dest.name} — ${dest.name} healing | Waaha`
    : `السياحة الاستشفائية في ${dest.name} — ${dest.name} العلاجية | واحة`;

  const ogTitle = isEn
    ? `Therapeutic tourism in ${dest.name} | Waaha`
    : `السياحة الاستشفائية في ${dest.name} | واحة`;

  const ogAlt = isEn
    ? `Therapeutic tourism in ${dest.name} — ${dest.description}`
    : `السياحة الاستشفائية في ${dest.name} — ${dest.description}`;

  return {
    title,
    description,
    keywords: isEn
      ? [
          `therapeutic tourism ${dest.name}`,
          `natural therapy ${dest.name}`,
          `${dest.name} ${treatments}`,
          `${dest.name} healing`,
          "therapeutic tourism Egypt",
          "natural therapy Egypt",
          ...(dest.treatments ?? []).map((t) => `${t} ${dest.name}`),
        ]
      : [
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
      title: ogTitle,
      description,
      url: `${SITE_URL}/destination/${dest.id}`,
      images: [
        {
          url: dest.heroBg || dest.image,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
      type: "article",
      locale: isEn ? "en_US" : "ar_EG",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
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
