import { Sparkles } from "lucide-react";
import type { Route } from "next";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import { ContentEmpty } from "@/shared/components/common/content-empty";
import Section from "@/shared/components/layout/section/section";
import { PATH } from "@/shared/config/routes";
import CategoryCard from "./category-card";

type FeaturedCategoriesData = NonNullable<
  Awaited<ReturnType<typeof apiServer.category.getAllFeaturedCategories>>["data"]
>;

export default async function GetFeaturedCategories({
  prefetched,
}: {
  /** When set (e.g. from the homepage server component), avoids a duplicate fetch. */
  prefetched?: FeaturedCategoriesData;
} = {}) {
  const categories =
    prefetched ??
    (
      await apiServer.category.getAllFeaturedCategories({
        query: {},
      })
    ).data;

  const list = categories ?? [];

  return (
    <HydrateClient>
      <Section
        {...{
          title: "Featured",
          description: "Explore our featured categories",
          action: "View All",
          actionLink: PATH.STORE.CATEGORIES.ROOT,
        }}
      >
        {list.length === 0 ? (
          <ContentEmpty
            icon={Sparkles}
            title="No featured categories"
            description="Featured picks will appear here when the catalog is curated. You can still browse the full store."
            primaryAction={{ label: "Browse store", href: PATH.STORE.ROOT }}
            secondaryAction={{ label: "All categories", href: PATH.STORE.CATEGORIES.ROOT }}
          />
        ) : (
          <div className="grid grid-cols-1 h-full w-full border-b sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {list.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                href={PATH.STORE.CATEGORIES.CATEGORY(category.slug) as Route}
                title={category.title}
                description={category.description}
                image={category.image}
              />
            ))}
          </div>
        )}
      </Section>
    </HydrateClient>
  );
}
