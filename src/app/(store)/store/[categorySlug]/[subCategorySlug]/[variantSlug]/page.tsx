import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { PDPProduct } from "@/module/product/product-pdp";
import Shell from "@/shared/components/layout/shell";
import type { PageProps } from "@/shared/types/global.types";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug, subCategorySlug, variantSlug } = await params;

  const { data } = await apiServer.product.getPDPProductByVariantFullPath({
    params: {
      categorySlug,
      subcategorySlug: subCategorySlug,
      variantSlug,
    },
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

export default async function ProductVariantPage({ params }: PageProps) {
  const { categorySlug, subCategorySlug, variantSlug } = await params;
  const { data } = await apiServer.product.getPDPProductByVariantFullPath({
    params: {
      categorySlug,
      subcategorySlug: subCategorySlug,
      variantSlug,
    },
  });
  if (!data) return notFound();

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section>
          <PDPProduct data={data} slug={variantSlug} categorySlug={categorySlug} subcategorySlug={subCategorySlug} />
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
