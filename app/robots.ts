import type { MetadataRoute } from "next";

const BASE_URL = "https://wahaeg.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/gate", "/admin"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
