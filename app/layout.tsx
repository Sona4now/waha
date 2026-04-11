import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "واحة — السياحة الاستشفائية في مصر",
    template: "%s | واحة",
  },
  description:
    "اكتشف وجهتك العلاجية المثالية في مصر. سفاجا، سيوة، سيناء، الفيوم، الواحات البحرية — رحلة شفاء من قلب الطبيعة.",
  keywords: [
    "سياحة استشفائية",
    "علاج طبيعي",
    "مصر",
    "سفاجا",
    "سيوة",
    "سيناء",
    "الفيوم",
    "واحات",
    "بحر أحمر",
    "عيون كبريتية",
    "رمال سوداء",
  ],
  authors: [{ name: "واحة — مشروع أكاديمي" }],
  creator: "واحة",
  publisher: "كلية السياحة والفنادق",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "واحة",
    title: "واحة — السياحة الاستشفائية في مصر",
    description:
      "اكتشف وجهتك العلاجية المثالية في مصر — رحلة شفاء من قلب الطبيعة.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "واحة — السياحة الاستشفائية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "واحة — السياحة الاستشفائية في مصر",
    description:
      "اكتشف وجهتك العلاجية المثالية في مصر — رحلة شفاء من قلب الطبيعة.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html lang="ar" dir="rtl" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&family=Cairo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "واحة — WAHA",
              alternateName: "Waaha Therapeutic Tourism",
              url: "https://wahaeg.com",
              description:
                "منصة محتوى رقمية للتوعية حول السياحة البيئية والاستشفاء من الطبيعة في مصر",
              inLanguage: "ar-EG",
              publisher: {
                "@type": "EducationalOrganization",
                name: "جامعة القاهرة — كلية الإعلام",
                department: "قسم الإعلام الرقمي",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://wahaeg.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
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
                  console.log('[Analytics]', event, data);
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
