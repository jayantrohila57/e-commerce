import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { PDPProduct } from "@/module/product/product-pdp";
import Shell from "@/shared/components/layout/shell";
import { breadcrumbGraphNode, buildSchemaGraph, digitsOnlyGtin, productWithOfferGraphNode } from "@/shared/seo/json-ld";
import { JsonLdScript } from "@/shared/seo/json-ld-script";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";
import { computeVariantUnitPrice, formatSchemaPrice } from "@/shared/seo/pricing";
import { seoConfig } from "@/shared/seo/seo.config";
import { absoluteUrl } from "@/shared/seo/site-origin";
import { getStoreCategoryTitle, getStoreSubcategoryTitle } from "@/shared/seo/store-breadcrumb";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/store/[categorySlug]/[subCategorySlug]/[variantSlug]">) {
  const { categorySlug, subCategorySlug, variantSlug } = await params;

  const { data } = await apiServer.product.getPDPProductByVariantFullPath({
    params: {
      categorySlug,
      subcategorySlug: subCategorySlug,
      variantSlug,
    },
  });

  if (!data) {
    return buildPageMetadata({
      title: "Product not found",
      description: "The requested product variant does not exist.",
      canonicalPath: `/store/${categorySlug}/${subCategorySlug}/${variantSlug}`,
      robots: { index: false, follow: false },
    });
  }

  const primaryVariant = data.product.variants[0]!;
  const imageUrl = getImageSrc(primaryVariant.media?.[0]?.url) ?? getImageSrc(data.product.baseImage);
  const ogImages = imageUrl ? [imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl)] : undefined;

  return buildPageMetadata({
    title: data.product.metaTitle ?? data.product.title,
    description: data.product.metaDescription ?? data.product.description ?? data.product.title,
    canonicalPath: `/store/${categorySlug}/${subCategorySlug}/${variantSlug}`,
    ogImageUrls: ogImages,
    ogType: "product",
  });
}

export default async function ProductVariantPage({
  params,
}: PageProps<"/store/[categorySlug]/[subCategorySlug]/[variantSlug]">) {
  const { categorySlug, subCategorySlug, variantSlug } = await params;
  const { data } = await apiServer.product.getPDPProductByVariantFullPath({
    params: {
      categorySlug,
      subcategorySlug: subCategorySlug,
      variantSlug,
    },
  });
  if (!data) return notFound();

  const primaryVariant = data.product.variants[0]!;
  const canonicalPath = `/store/${categorySlug}/${subCategorySlug}/${variantSlug}`;
  const productUrl = absoluteUrl(canonicalPath);

  const imageUrls: string[] = [];
  const pushUnique = (src: string | null | undefined) => {
    const u = src ? getImageSrc(src) : null;
    if (!u) return;
    const abs = u.startsWith("http") ? u : absoluteUrl(u);
    if (!imageUrls.includes(abs)) imageUrls.push(abs);
  };
  for (const m of primaryVariant.media ?? []) {
    pushUnique(m.url);
  }
  pushUnique(data.product.baseImage);
  const images = (imageUrls.length ? imageUrls : [absoluteUrl("/opengraph-image")]).slice(0, 20);

  const price = formatSchemaPrice(computeVariantUnitPrice(data.product, primaryVariant));
  const currency = data.product.baseCurrency ?? "INR";
  const inv = data.seo.variantInventory;
  const availability =
    inv === undefined || inv === null
      ? undefined
      : inv.availableQuantity > 0
        ? ("https://schema.org/InStock" as const)
        : ("https://schema.org/OutOfStock" as const);

  const gtin = digitsOnlyGtin(inv?.barcode ?? null) ?? undefined;

  const reviewsForProduct =
    data.seo.reviewsForSchema?.map((r) => ({
      reviewBody: r.reviewBody,
      datePublished: r.datePublished,
      ratingValue: r.ratingValue,
    })) ?? undefined;

  const [categoryTitle, subcategoryTitle] = await Promise.all([
    getStoreCategoryTitle(categorySlug),
    getStoreSubcategoryTitle(categorySlug, subCategorySlug),
  ]);

  const pdpLd = buildSchemaGraph([
    productWithOfferGraphNode({
      name: data.product.title,
      description: (data.product.description ?? data.product.title).slice(0, 5000),
      images,
      sku: inv?.sku ?? undefined,
      gtin,
      brandName: seoConfig.siteName,
      productUrl,
      price,
      priceCurrency: currency,
      availability,
      aggregateRating: data.seo.reviewAggregate ?? undefined,
      reviews: reviewsForProduct,
    }),
    breadcrumbGraphNode([
      { name: "Home", path: "/" },
      { name: "Store", path: "/store" },
      { name: categoryTitle, path: `/store/${categorySlug}` },
      { name: subcategoryTitle, path: `/store/${categorySlug}/${subCategorySlug}` },
      { name: data.product.title, path: canonicalPath },
    ]),
  ]);

  return (
    <HydrateClient>
      <JsonLdScript id="jsonld-pdp" data={pdpLd} />
      <Shell>
        <Shell.Section>
          <PDPProduct data={data} slug={variantSlug} categorySlug={categorySlug} subcategorySlug={subCategorySlug} />
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
