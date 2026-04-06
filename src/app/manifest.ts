import type { MetadataRoute } from "next";
import { brandIconPaths } from "@/shared/seo/brand-icons";
import { seoConfig } from "@/shared/seo/seo.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.siteName,
    short_name: seoConfig.shortName,
    description: seoConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    categories: ["shopping", "ecommerce"],
    icons: brandIconPaths.map(({ src, sizes, type }) => ({
      src,
      sizes,
      type,
      purpose: "any",
    })),
  };
}
