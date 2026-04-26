import type { Metadata, Viewport } from "next";
import { Cairo, Reem_Kufi } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/siteMeta";
import { organizationSchema } from "@/lib/structuredData";

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

// SEO note: the exact phrase "السياحة الاستشفائية في مصر" appears in:
// title, description, OG title/description, twitter, keywords. Repetition
// across signals tells Google this site is *the* canonical answer for that
// query. We also include common variants ("سياحة علاجية", "سياحة صحية")
// because Egyptian users phrase this multiple ways.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "السياحة الاستشفائية في مصر | واحة — احجز رحلتك العلاجية",
    template: "%s | السياحة الاستشفائية في مصر — واحة",
  },
  description:
    "السياحة الاستشفائية في مصر — منصة واحة لحجز رحلات العلاج الطبيعي في سفاجا، سيوة، سيناء، الفيوم، والواحات. علاج بالمياه الكبريتية، الرمال السوداء، والعلاج بالمناخ مع باقات مدروسة وأسعار شفافة.",
  keywords: [
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
  authors: [{ name: "واحة — WAHA" }],
  creator: "واحة",
  publisher: "واحة — WAHA",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    siteName: "واحة",
    title: "السياحة الاستشفائية في مصر | واحة",
    description:
      "احجز رحلتك العلاجية في مصر — سفاجا (الصدفية والروماتيزم)، سيوة (المياه الكبريتية)، سيناء (الجبال والربو)، الفيوم (الاسترخاء). أسعار شفافة وحجز عبر واتساب.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "السياحة الاستشفائية في مصر — واحة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "السياحة الاستشفائية في مصر | واحة",
    description:
      "احجز رحلتك العلاجية الطبيعية في مصر — أسعار شفافة وحجز عبر واتساب في 30 ثانية.",
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
  },
  category: "Travel — Wellness Tourism",
};

export const viewport: Viewport = {
  themeColor: "#1d5770",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`h-full ${cairo.variable} ${reemKufi.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        {/* JSON-LD: WebSite + Organization (root-level schemas).
            Page-specific schemas (TouristAttraction, Article, FAQPage,
            BreadcrumbList) are added in their respective pages via the
            JsonLd component.  */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "واحة — WAHA",
              alternateName: "Waaha Therapeutic Tourism",
              url: SITE_URL,
              description:
                "منصة محتوى رقمية للتوعية حول السياحة البيئية والاستشفاء من الطبيعة في مصر",
              inLanguage: "ar-EG",
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
        {children}
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
