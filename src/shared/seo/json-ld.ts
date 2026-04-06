import { siteConfig } from "@/shared/config/site";
import { brandLogoSchemaPath } from "./brand-icons";
import { seoConfig } from "./seo.config";
import { absoluteUrl } from "./site-origin";

export type BreadcrumbItem = { name: string; path: string };

const SCHEMA_CONTEXT = "https://schema.org";

export function organizationJsonLd() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(brandLogoSchemaPath),
    description: siteConfig.description,
    sameAs: seoConfig.socialProfileUrls,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contact.supportEmail,
        telephone: siteConfig.contact.phone,
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: [siteConfig.contact.address.line1, siteConfig.contact.address.line2].filter(Boolean).join(", "),
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.country,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: absoluteUrl("/"),
    description: seoConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/store")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type ProductJsonLdInput = {
  name: string;
  description: string;
  images: string[];
  sku?: string | null;
  brandName: string;
  productUrl: string;
  price: string;
  priceCurrency: string;
  availability?:
    | "https://schema.org/InStock"
    | "https://schema.org/OutOfStock"
    | "https://schema.org/PreOrder"
    | "https://schema.org/BackOrder";
  aggregateRating?: { ratingValue: number; reviewCount: number };
};

export function productWithOfferJsonLd(input: ProductJsonLdInput) {
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url: input.productUrl,
    priceCurrency: input.priceCurrency,
    price: input.price,
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
  if (input.availability) {
    offer.availability = input.availability;
  }

  const product: Record<string, unknown> = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.images,
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
    offers: offer,
  };

  if (input.sku) {
    product.sku = input.sku;
  }

  if (input.aggregateRating && input.aggregateRating.reviewCount > 0) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.aggregateRating.ratingValue,
      reviewCount: input.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return product;
}
