import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { SubCategoryItem } from "@/module/subcategory/subcategory-listing";
import Shell from "@/shared/components/layout/shell";
import { breadcrumbJsonLd } from "@/shared/seo/json-ld";
import { JsonLdScript } from "@/shared/seo/json-ld-script";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";
import { absoluteUrl } from "@/shared/seo/site-origin";
import { getStoreCategoryTitle } from "@/shared/seo/store-breadcrumb";
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

  const title = subCategory.metaTitle ?? subCategory.title;
  const description = subCategory.metaDescription ?? subCategory.description ?? subCategory.title;
  const imageUrl = getImageSrc(subCategory.image);
  const ogImages = imageUrl ? [imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl)] : undefined;

  return buildPageMetadata({
    title,
    description,
    canonicalPath: `/store/${categorySlug}/${slug}`,
    ogImageUrls: ogImages,
    ogType: "website",
  });
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

  const categoryTitle = await getStoreCategoryTitle(categorySlug);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Store", path: "/store" },
    { name: categoryTitle, path: `/store/${categorySlug}` },
    { name: data.subcategoryData.title, path: `/store/${categorySlug}/${slug}` },
  ]);

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
      <JsonLdScript id="jsonld-breadcrumb-subcategory" data={breadcrumbLd} />
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
