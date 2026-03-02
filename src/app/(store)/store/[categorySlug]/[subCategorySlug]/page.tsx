import { apiServer, HydrateClient } from "@/core/api/api.server";
import Section from "@/shared/components/layout/section/section";
import { clientEnv } from "@/shared/config/env.client";
import { notFound } from "next/navigation";
import { SubCategoryItem } from "@/module/subcategory/subcategory-listing";

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
  return {
    title: subCategory?.title,
    description: subCategory?.description,
    openGraph: {
      title: subCategory?.title,
      description: subCategory?.description,
      url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/store/${slug}`,
      images: [
        {
          url: subCategory?.image,
        },
      ],
    },
  };
}

export default async function CartPage({ params }: PageProps<"/store/[categorySlug]/[subCategorySlug]">) {
  const { categorySlug, subCategorySlug: slug } = await params;
  const { data } = await apiServer.subcategory.getBySlug({
    params: {
      slug,
      categorySlug,
    },
  });
  if (!data?.subcategoryData) return notFound();

  return (
    <HydrateClient>
      <Section>
        <SubCategoryItem data={data} />
      </Section>
    </HydrateClient>
  );
}
