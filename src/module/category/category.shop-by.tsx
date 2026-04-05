import type { Route } from "next";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import Section from "@/shared/components/layout/section/section";
import { PATH } from "@/shared/config/routes";
import CategoryCard from "./category-card";

export default async function ShopByCategoryGrid() {
  const { data: categories } = await apiServer.category.getMany({
    query: {},
  });

  if (!categories) {
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
          {categories?.slice(0, 4)?.map((category) => (
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
