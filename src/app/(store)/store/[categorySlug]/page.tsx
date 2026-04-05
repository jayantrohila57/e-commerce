import type { Route } from "next";
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
import { clientEnv } from "@/shared/config/env.client";
import { PATH } from "@/shared/config/routes";

export async function generateMetadata({ params }: PageProps<"/store/[categorySlug]">) {
  const { categorySlug: slug } = await params;
  const { data } = await apiServer.category.get({
    params: {
      slug,
    },
  });

  const category = data;
  if (!category) return notFound();
  return {
    title: category?.title,
    description: category?.description,
    openGraph: {
      title: category?.title,
      description: category?.description,
      url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/store/${slug}`,
      images: [
        {
          url: category?.image,
        },
      ],
    },
  };
}

export default async function CartPage({ params }: PageProps<"/store/[categorySlug]">) {
  const { categorySlug: slug } = await params;
  const { data } = await apiServer.category.getCategoryWithSubCategories({
    params: {
      slug,
    },
  });
  if (!data) return notFound();

  return (
    <HydrateClient>
      <Shell>
        {/* <Shell.Section>
          <ContentAnnouncementBar page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <ContentPromoBanner page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <ContentSplitBanner page="store_category" />
        </Shell.Section> */}
        <Shell.Section>
          <Section title={`Shop by ${data.title}`} description={data.description ?? ""}>
            <CategoryItem data={data} />
          </Section>
        </Shell.Section>
        <Shell.Section>
          <ContentCTA page="store_category" />
        </Shell.Section>
        {/*
        <Shell.Section>
          <ContentOfferBanner page="store_category" />
        </Shell.Section>
        <Shell.Section>
          <ContentFeatureHighlights page="store_category" />
        </Shell.Section> */}
      </Shell>
    </HydrateClient>
  );
}
