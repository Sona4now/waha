import type { NextConfig } from "next";

/**
 * Security headers applied to every route.
 * - CSP is intentionally pragmatic: allows Vercel analytics + Google Fonts
 *   + Unsplash + inline scripts (we use `dangerouslySetInnerHTML` for JSON-LD
 *   and analytics bootstrap). Tighten further once you migrate to nonces.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://*.b-cdn.net https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://server.arcgisonline.com https://tile.opentopomap.org https://*.opentopomap.org https://unpkg.com",
      "media-src 'self' https://cdn.freesound.org https://*.freesound.org https://*.b-cdn.net blob: data:",
      "connect-src 'self' https://*.vercel.com https://vercel.live https://api.anthropic.com https://cdn.freesound.org https://*.b-cdn.net",
      "frame-src 'self' https://kuula.co https://iframe.mediadelivery.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
