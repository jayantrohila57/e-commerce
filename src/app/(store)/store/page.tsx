import type { Route } from "next";
import Link from "next/link";
import { apiServer } from "@/core/api/api.server";
import CategoryCard from "@/module/category/category-card";
import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import { BlurImage } from "@/shared/components/common/image";
import Section from "@/shared/components/layout/section/section";
import Shell from "@/shared/components/layout/shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";
import { getImageSrc } from "@/shared/utils/lib/image.utils";

export const metadata = {
  title: "Store",
  description: "Store Home",
};

export default async function StorePage() {
  const { data } = await apiServer.category.getManyWithSubcategories({
    query: {},
  });

  return (
    <Shell>
      {/* <Shell.Section>
        <ContentAnnouncementBar page="store" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="store" />
      </Shell.Section> */}
      {/* <Shell.Section>
        <ContentSplitBanner page="store" />
      </Shell.Section> */}
      <Shell.Section>
        {data?.map((category) => (
          <Section
            key={category.id}
            title={category.title}
            description={category.description ?? ""}
            action="View All "
            actionLink={PATH.STORE.CATEGORIES.CATEGORY(category.slug) as Route}
          >
            <div className="grid mb-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {category?.subcategories?.map((subcategory) => (
                <CategoryCard
                  key={subcategory.id}
                  id={subcategory.id}
                  href={PATH.STORE.SUB_CATEGORIES.SUBCATEGORY(subcategory?.slug, category.slug) as Route}
                  title={subcategory.title}
                  description={subcategory.description}
                  image={subcategory.image}
                />
              ))}
            </div>
          </Section>
        ))}
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="store" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="store" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="store" />
      </Shell.Section>
    </Shell>
  );
}
