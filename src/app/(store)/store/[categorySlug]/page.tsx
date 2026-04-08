import { notFound } from "next/navigation";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { CategoryItem } from "@/module/category/category.component.all";
import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import {
  breadcrumbGraphNode,
  buildSchemaGraph,
  collectionPageGraphNode,
  itemListGraphNode,
} from "@/shared/seo/json-ld";
import { JsonLdScript } from "@/shared/seo/json-ld-script";
import { buildPageMetadata } from "@/shared/seo/metadata-builders";
import { absoluteUrl } from "@/shared/seo/site-origin";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export async function generateMetadata({ params }: PageProps<"/store/[categorySlug]">) {
  const { categorySlug: slug } = await params;
  const { data: category } = await apiServer.category.get({
    params: {
      slug,
    },
  });

  if (!category) return notFound();

  const title = category.metaTitle ?? category.title;
  const description = category.metaDescription ?? category.description ?? category.title;
  const imageUrl = getImageSrc(category.image);
  const ogImages = imageUrl ? [imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl)] : undefined;

  return buildPageMetadata({
    title,
    description,
    canonicalPath: `/store/${slug}`,
    ogImageUrls: ogImages,
    ogType: "website",
  });
}

export default async function CartPage({ params }: PageProps<"/store/[categorySlug]">) {
  const { categorySlug: slug } = await params;
  const { data } = await apiServer.category.getCategoryWithSubCategories({
    params: {
      slug,
    },
  });
  if (!data) return notFound();

  const categoryLd = buildSchemaGraph([
    collectionPageGraphNode({
      name: data.title,
      description: data.description ?? data.metaDescription ?? data.title,
      path: `/store/${slug}`,
    }),
    itemListGraphNode({
      name: `Subcategories in ${data.title}`,
      path: `/store/${slug}`,
      idSuffix: "subcategories",
      items: (data.subcategories ?? []).map((s) => ({
        name: s.title,
        url: absoluteUrl(PATH.STORE.SUB_CATEGORIES.SUBCATEGORY(s.slug, slug)),
      })),
    }),
    breadcrumbGraphNode([
      { name: "Home", path: "/" },
      { name: "Store", path: "/store" },
      { name: data.title, path: `/store/${slug}` },
    ]),
  ]);

  return (
    <HydrateClient>
      <JsonLdScript id="jsonld-category" data={categoryLd} />
      <Shell>
        <Shell.Section>
          <ContentAnnouncementBar page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <ContentPromoBanner page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <ContentSplitBanner page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <Section title={`Shop by ${data.title}`} description={data.description ?? ""}>
            <CategoryItem data={data} />
          </Section>
        </Shell.Section>
        <Shell.Section>
          <ContentCTA page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <ContentOfferBanner page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <ContentFeatureHighlights page="store_category" />
        </Shell.Section>
      </Shell>
    </HydrateClient>
  );
}
