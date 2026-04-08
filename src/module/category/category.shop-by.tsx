import type { Route } from "next";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import Section from "@/shared/components/layout/section/section";
import { PATH } from "@/shared/config/routes";
import CategoryCard from "./category-card";

type ShopByCategoryData = NonNullable<Awaited<ReturnType<typeof apiServer.category.getMany>>["data"]>;

export default async function ShopByCategoryGrid({
  prefetched,
}: {
  /** When set, should be the visible slice (e.g. first 4) to match JSON-LD and avoid a duplicate fetch. */
  prefetched?: ShopByCategoryData;
} = {}) {
  const categories =
    prefetched ??
    (
      await apiServer.category.getMany({
        query: {},
      })
    ).data?.slice(0, 4);

  if (!categories?.length) {
    return null;
  }
  return (
    <HydrateClient>
      <Section
        {...{
          title: "Shop by Category",
          description: "Explore our products by category",
          action: "View All Categories",
          actionLink: PATH.STORE.CATEGORIES.ROOT as Route,
        }}
      >
        <div className="grid grid-cols-1 h-full w-full border-b sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {categories.map((category) => (
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
      </Section>
    </HydrateClient>
  );
}
