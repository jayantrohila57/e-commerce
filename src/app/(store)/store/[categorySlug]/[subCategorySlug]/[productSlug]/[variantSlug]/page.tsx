import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { PDPProduct } from "@/module/product/product-pdp";
import Section from "@/shared/components/layout/section/section";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export const revalidate = 300;

type ROUTE = "/store/[categorySlug]/[subCategorySlug]/[productSlug]/[variantSlug]";

export async function generateMetadata({ params }: PageProps<ROUTE>) {
  const { variantSlug } = await params;

  const { data } = await apiServer.product.getPDPProductByVariant({
    params: { slug: variantSlug },
  });

  if (!data) {
    return {
      title: "Product not found",
      description: "The requested product variant does not exist.",
    };
  }

  const imageUrl = getImageSrc(data.product.baseImage);
  const meta = {
    title: data.product.metaTitle ?? data.product.title,
    description: data.product.metaDescription ?? data.product.description,
  };
  return {
    ...meta,
    openGraph: { ...meta, ...(imageUrl && { images: [{ url: imageUrl }] }) },
    twitter: {
      card: "summary_large_image" as const,
      ...meta,
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
  };
}

export default async function ProductVariantPage({ params }: PageProps<ROUTE>) {
  const { variantSlug } = await params;
  const { data } = await apiServer.product.getPDPProductByVariant({
    params: {
      slug: variantSlug,
    },
  });
  if (!data) return notFound();

  return (
    <HydrateClient>
      <Section>
        <PDPProduct data={data} slug={variantSlug} />
      </Section>
    </HydrateClient>
  );
}
