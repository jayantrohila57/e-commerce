import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { SubCategoryItem } from "@/module/subcategory/subcategory-listing";
import Section from "@/shared/components/layout/section/section";
import { clientEnv } from "@/shared/config/env.client";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export async function generateMetadata({ params }: PageProps<"/store/[categorySlug]/[subCategorySlug]">) {
  const { categorySlug, subCategorySlug: slug } = await params;
  const { data } = await apiServer.subcategory.getBySlug({
    params: {
      slug,
      categorySlug,
    },
  });

  const subCategory = data?.subcategoryData;
  if (!subCategory) return notFound();

  const imageUrl = getImageSrc(subCategory.image);

  return {
    title: subCategory?.title,
    description: subCategory?.description,
    openGraph: {
      title: subCategory?.title,
      description: subCategory?.description,
      url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/store/${categorySlug}/${slug}`,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function SubCategoryPage({ params }: PageProps<"/store/[categorySlug]/[subCategorySlug]">) {
  const { categorySlug, subCategorySlug: slug } = await params;
  const { data } = await apiServer.subcategory.getBySlug({
    params: {
      slug,
      categorySlug,
    },
  });
  if (!data?.subcategoryData) return notFound();

  // Type assertion to handle Drizzle's optional deletedAt field
  const products = data.products as unknown as {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    basePrice: number;
    baseImage: string | null;
    categorySlug: string;
    subcategorySlug: string;
    variants: {
      id: string;
      slug: string;
      title: string;
      productId: string;
      priceModifierType: string;
      priceModifierValue: string;
      attributes: { title: string; type: string; value: string }[] | null;
      media: { url: string }[] | null;
      createdAt: Date;
      updatedAt: Date | null;
      deletedAt: Date | null;
    }[];
  }[];

  return (
    <HydrateClient>
      <Section>
        <SubCategoryItem data={data} products={products} />
      </Section>
    </HydrateClient>
  );
}
