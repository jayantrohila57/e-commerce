import { siteConfig } from "@/shared/config/site";
import { brandLogoSchemaPath } from "./brand-icons";
import { seoConfig } from "./seo.config";
import { absoluteUrl } from "./site-origin";

export type BreadcrumbItem = { name: string; path: string };

const SCHEMA_CONTEXT = "https://schema.org";

/** Stable @id fragments for JSON-LD graph linking */
export function organizationJsonLdId(): string {
  return `${absoluteUrl("/")}#organization`;
}

export function websiteJsonLdId(): string {
  return `${absoluteUrl("/")}#website`;
}

/**
 * Single graph payload for root layout (Organization + WebSite).
 */
export function buildSchemaGraph(nodes: Record<string, unknown>[]) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": nodes,
  };
}

export function organizationGraphNode(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": organizationJsonLdId(),
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

/**
 * WebSite node referencing Organization by @id.
 * SearchAction targets `/store?q=` which the store page implements as a visible filter.
 */
export function websiteGraphNode(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": websiteJsonLdId(),
    name: seoConfig.siteName,
    url: absoluteUrl("/"),
    description: seoConfig.description,
    publisher: { "@id": organizationJsonLdId() },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/store")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function globalStorefrontGraphJsonLd() {
  return buildSchemaGraph([organizationGraphNode(), websiteGraphNode()]);
}

/** @deprecated Use organizationGraphNode + buildSchemaGraph; kept for tests/docs */
export function organizationJsonLd() {
  return {
    "@context": SCHEMA_CONTEXT,
    ...organizationGraphNode(),
  };
}

/** @deprecated Use websiteGraphNode + buildSchemaGraph */
export function websiteJsonLd() {
  return {
    "@context": SCHEMA_CONTEXT,
    ...websiteGraphNode(),
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

export type WebPageJsonLdInput = {
  name: string;
  description: string;
  path: string;
};

export function webPageGraphNode(input: WebPageJsonLdInput): Record<string, unknown> {
  const url = absoluteUrl(input.path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: input.name,
    description: input.description,
    url,
    isPartOf: { "@id": websiteJsonLdId() },
    publisher: { "@id": organizationJsonLdId() },
  };
}

export function webPageJsonLd(input: WebPageJsonLdInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    ...webPageGraphNode(input),
  };
}

export type CollectionPageJsonLdInput = {
  name: string;
  description: string;
  path: string;
};

export function collectionPageGraphNode(input: CollectionPageJsonLdInput): Record<string, unknown> {
  const url = absoluteUrl(input.path);
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: input.name,
    description: input.description,
    url,
    isPartOf: { "@id": websiteJsonLdId() },
    publisher: { "@id": organizationJsonLdId() },
  };
}

export function collectionPageJsonLd(input: CollectionPageJsonLdInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    ...collectionPageGraphNode(input),
  };
}

export type ItemListElementInput = {
  name: string;
  url: string;
};

export type ItemListJsonLdInput = {
  name: string;
  description?: string;
  path: string;
  /** Fragment suffix for @id uniqueness when multiple lists share one URL */
  idSuffix?: string;
  items: ItemListElementInput[];
};

export function itemListGraphNode(input: ItemListJsonLdInput): Record<string, unknown> {
  const pageUrl = absoluteUrl(input.path);
  const listId = `${pageUrl}#itemlist${input.idSuffix ? `-${input.idSuffix}` : ""}`;
  return {
    "@type": "ItemList",
    "@id": listId,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((el, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: el.name,
      item: el.url.startsWith("http") ? el.url : absoluteUrl(el.url),
    })),
  };
}

export function itemListJsonLd(input: ItemListJsonLdInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    ...itemListGraphNode(input),
  };
}

export function breadcrumbGraphNode(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** GTIN fields in schema.org expect digits only; lengths 8/12/13/14 only. */
export function digitsOnlyGtin(barcode: string | null | undefined): string | null {
  if (!barcode) return null;
  const d = barcode.replace(/\D/g, "");
  if (![8, 12, 13, 14].includes(d.length)) return null;
  return d;
}

export type ProductReviewJsonLd = {
  reviewBody: string;
  datePublished: string;
  ratingValue: number;
};

export type ProductJsonLdInput = {
  name: string;
  description: string;
  images: string[];
  sku?: string | null;
  gtin?: string | null;
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
  reviews?: ProductReviewJsonLd[];
};

export function productWithOfferGraphNode(input: ProductJsonLdInput): Record<string, unknown> {
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
    "@type": "Product",
    "@id": `${input.productUrl}#product`,
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

  if (input.gtin) {
    const len = input.gtin.length;
    if (len === 8) product.gtin8 = input.gtin;
    else if (len === 12) product.gtin12 = input.gtin;
    else if (len === 13) product.gtin13 = input.gtin;
    else if (len === 14) product.gtin14 = input.gtin;
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

  if (input.reviews?.length) {
    product.review = input.reviews.map((r) => ({
      "@type": "Review",
      reviewBody: r.reviewBody,
      datePublished: r.datePublished,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: "Customer",
      },
    }));
  }

  return product;
}

export function productWithOfferJsonLd(input: ProductJsonLdInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    ...productWithOfferGraphNode(input),
  };
}
