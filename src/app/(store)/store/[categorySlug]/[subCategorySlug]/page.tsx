import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import { SubCategoryItem } from "@/module/subcategory/subcategory-listing";
import Shell from "@/shared/components/layout/shell";
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

  // New flattened variant structure
  const variants = data.variants as unknown as {
    id: string;
    slug: string;
    title: string;
    priceModifierType: string;
    priceModifierValue: string;
    attributes: { title: string; type: string; value: string }[] | null;
    media: { url: string }[] | null;
    productId: string;
    productTitle: string;
    productSlug: string;
    productDescription: string | null;
    productBasePrice: number;
    productBaseImage: string | null;
    finalPrice: number;
  }[];

  return (
    <HydrateClient>
      <Shell>
        {/* <Shell.Section>
          <ContentAnnouncementBar page="store_subcategory" />
        </Shell.Section>
        <Shell.Section>
          <ContentPromoBanner page="store_subcategory" />
        </Shell.Section>
        <Shell.Section>
          <ContentSplitBanner page="store_subcategory" />
        </Shell.Section> */}
        <Shell.Section>
          <SubCategoryItem data={data} variants={variants} />
        </Shell.Section>
        {/* <Shell.Section>
          <ContentCTA page="store_subcategory" />
        </Shell.Section> */}
        {/* <Shell.Section>
          <ContentOfferBanner page="store_subcategory" />
        </Shell.Section>
        <Shell.Section>
          <ContentFeatureHighlights page="store_subcategory" />
        </Shell.Section> */}
      </Shell>
    </HydrateClient>
  );
}
