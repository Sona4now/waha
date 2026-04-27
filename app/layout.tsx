import type { Metadata, Viewport } from "next";
import { Cairo, Reem_Kufi, Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/siteMeta";
import { organizationSchema } from "@/lib/structuredData";
import { LOCALE_COOKIE, normaliseLocale, localeDir } from "@/lib/i18n";
import LocaleProvider from "@/components/site/LocaleProvider";

/**
 * Self-hosted Arabic fonts via next/font.
 * - Weights trimmed to what we actually use (inspect with Lighthouse if bloated).
 * - `display: swap` → text is immediately visible in a system font, then
 *   restyled when the webfont arrives. No FOIT.
 * - `preload: true` for the primary body font only; Reem Kufi is display-only.
 * - CSS variables so Tailwind can reach them via `font-[var(--font-cairo)]`.
 */
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  variable: "--font-cairo",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false, // display font — not on critical path
  variable: "--font-reem-kufi",
});

// English fallback font — Inter is the standard "neutral, readable" pick.
// Cairo also has Latin glyphs but Inter renders English UI more cleanly
// and the file size is small with the trimmed weight set.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});

// SEO note: the exact phrase "السياحة الاستشفائية في مصر" appears in:
// title, description, OG title/description, twitter, keywords. Repetition
// across signals tells Google this site is *the* canonical answer for that
// query. We also include common variants ("سياحة علاجية", "سياحة صحية")
// because Egyptian users phrase this multiple ways.
//
// generateMetadata is async and reads the locale cookie at request time,
// so AR users see Arabic SEO copy and EN users see English copy.
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = normaliseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const isEn = locale === "en";

  const title = isEn
    ? "Therapeutic tourism in Egypt | Waaha — Book your healing trip"
    : "السياحة الاستشفائية في مصر | واحة — احجز رحلتك العلاجية";

  const description = isEn
    ? "Therapeutic tourism in Egypt — Waaha is a platform for booking natural-therapy trips in Safaga, Siwa, Sinai, Fayoum, and the oases. Sulphur water, black sand, and climate therapy with curated packages and transparent prices."
    : "السياحة الاستشفائية في مصر — منصة واحة لحجز رحلات العلاج الطبيعي في سفاجا، سيوة، سيناء، الفيوم، والواحات. علاج بالمياه الكبريتية، الرمال السوداء، والعلاج بالمناخ مع باقات مدروسة وأسعار شفافة.";

  const ogTitle = isEn
    ? "Therapeutic tourism in Egypt | Waaha"
    : "السياحة الاستشفائية في مصر | واحة";

  const ogDescription = isEn
    ? "Book your therapeutic trip in Egypt — Safaga (psoriasis & rheumatism), Siwa (sulphur water), Sinai (mountains & asthma), Fayoum (relaxation). Transparent pricing and WhatsApp booking."
    : "احجز رحلتك العلاجية في مصر — سفاجا (الصدفية والروماتيزم)، سيوة (المياه الكبريتية)، سيناء (الجبال والربو)، الفيوم (الاسترخاء). أسعار شفافة وحجز عبر واتساب.";

  const twitterDescription = isEn
    ? "Book your natural-therapy trip in Egypt — transparent pricing and WhatsApp booking in 30 seconds."
    : "احجز رحلتك العلاجية الطبيعية في مصر — أسعار شفافة وحجز عبر واتساب في 30 ثانية.";

  const ogAlt = isEn
    ? "Therapeutic tourism in Egypt — Waaha"
    : "السياحة الاستشفائية في مصر — واحة";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: isEn
        ? "%s | Therapeutic tourism in Egypt — Waaha"
        : "%s | السياحة الاستشفائية في مصر — واحة",
    },
    description,
    keywords: isEn
      ? [
          "therapeutic tourism Egypt",
          "wellness tourism Egypt",
          "natural therapy Egypt",
          "thermal therapy Egypt",
          "balneotherapy Safaga",
          "sulphur water therapy",
          "black sand therapy",
          "psoriasis treatment Safaga",
          "Siwa sulphur springs",
          "rheumatism natural therapy",
          "Safaga",
          "Siwa",
          "Sinai",
          "Fayoum",
          "Bahariya Oasis",
          "Red Sea",
          "climatherapy",
          "mud therapy",
        ]
      : [
          "السياحة الاستشفائية في مصر",
          "سياحة استشفائية",
          "السياحة العلاجية",
          "سياحة علاجية مصر",
          "علاج طبيعي مصر",
          "سياحة صحية",
          "العلاج بالمياه الكبريتية",
          "العلاج بالرمال السوداء",
          "علاج الصدفية في سفاجا",
          "عيون سيوة الكبريتية",
          "علاج الروماتيزم بالطبيعة",
          "wellness tourism Egypt",
          "thermal therapy Egypt",
          "balneotherapy Safaga",
          "سفاجا",
          "سيوة",
          "سيناء",
          "الفيوم",
          "الواحات البحرية",
          "البحر الأحمر",
          "العلاج بالمناخ",
          "العلاج الطبيعي بالطين",
        ],
    authors: [{ name: isEn ? "Waaha" : "واحة — WAHA" }],
    creator: isEn ? "Waaha" : "واحة",
    publisher: isEn ? "Waaha" : "واحة — WAHA",
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "ar_EG",
      alternateLocale: isEn ? ["ar_EG"] : ["en_US"],
      siteName: isEn ? "Waaha" : "واحة",
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: twitterDescription,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "ar-EG": SITE_URL,
        "en-US": SITE_URL,
        "x-default": SITE_URL,
      },
    },
    category: "Travel — Wellness Tourism",
  };
}

export const viewport: Viewport = {
  themeColor: "#1d5770",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the locale once on the server. Cookie wins; otherwise default to
  // Arabic. The same value is passed to <html lang/dir> AND to the client
  // LocaleProvider, so SSR + hydration stay in sync.
  const cookieStore = await cookies();
  const locale = normaliseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const dir = localeDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`h-full ${cairo.variable} ${reemKufi.variable} ${inter.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        {/* JSON-LD: WebSite + Organization (root-level schemas).
            Page-specific schemas (TouristAttraction, Article, FAQPage,
            BreadcrumbList) are added in their respective pages via the
            JsonLd component.  */}
        {/* Locale-aware hreflang alternates. With cookie-based locale
            switching (single URL serves both languages), we declare the
            same URL under both ar-EG and en-US plus x-default. Google
            will treat them as alternates of one another. For stronger
            EN SEO we'd migrate to per-locale URLs (e.g. /en/...) — that
            structural change is out of scope here. */}
        <link rel="alternate" hrefLang="ar-EG" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-US" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <meta
          property="og:locale"
          content={locale === "en" ? "en_US" : "ar_EG"}
        />
        <meta
          property="og:locale:alternate"
          content={locale === "en" ? "ar_EG" : "en_US"}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: locale === "en" ? "Waha (واحة)" : "واحة — WAHA",
              alternateName: "Waaha Therapeutic Tourism",
              url: SITE_URL,
              description:
                locale === "en"
                  ? "Digital editorial platform on wellness tourism and natural healing in Egypt"
                  : "منصة محتوى رقمية للتوعية حول السياحة البيئية والاستشفاء من الطبيعة في مصر",
              inLanguage: locale === "en" ? "en-US" : "ar-EG",
              publisher: {
                "@type": "Organization",
                name: "واحة — WAHA",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
      </head>
      <body className="h-full bg-[#070d15]">
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        <Analytics />
        <SpeedInsights />

        {/* Register Service Worker */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              }
            `,
          }}
        />

        {/* Analytics placeholder - replace with real analytics */}
        <Script
          id="analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.waaha_analytics = {
                events: [],
                track: function(event, data) {
                  this.events.push({ event, data, timestamp: Date.now() });
                  // analytics event stored
                }
              };
              // Track page views
              waaha_analytics.track('page_view', { path: window.location.pathname });
            `,
          }}
        />
      </body>
    </html>
  );
}
