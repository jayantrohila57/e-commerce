import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/shared/seo/site-origin";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/account/", "/auth/", "/api/", "/support/tickets", "/sentry-example-page/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: new URL(base).host,
  };
}
