import { siteConfig } from "@/shared/config/site";
import { absoluteUrl, getSiteOrigin } from "./site-origin";

const defaultOgPath = "/opengraph-image";

function twitterHandleFromUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const m = url.match(/(?:twitter\.com|x\.com)\/([^/?#]+)/i);
  if (!m?.[1] || m[1] === "intent") return undefined;
  return `@${m[1]}`;
}

export const seoConfig = {
  siteName: siteConfig.name,
  shortName: siteConfig.name,
  description: siteConfig.description,
  domain: siteConfig.domain,
  /** Single-locale default; extend when adding i18n */
  locale: "en_US" as const,
  language: "en" as const,
  themeColorLight: siteConfig.colors.primary,
  themeColorDark: "#000000",
  backgroundColor: siteConfig.colors.background,
  twitterSite: twitterHandleFromUrl(siteConfig.socialLinks.find((l) => l.icon === "twitter")?.url),
  socialProfileUrls: siteConfig.socialLinks.map((l) => l.url),
  /** Relative path to default OG (Next file route or static asset) */
  defaultOgImagePath: defaultOgPath,
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
} as const;

export type SeoConfig = typeof seoConfig;

export function getDefaultOgImageUrl(): string {
  return absoluteUrl(seoConfig.defaultOgImagePath);
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
