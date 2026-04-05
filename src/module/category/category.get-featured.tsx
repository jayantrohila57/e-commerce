import type { Route } from "next";
import { apiServer, HydrateClient } from "@/core/api/api.server";
import Section from "@/shared/components/layout/section/section";
import { PATH } from "@/shared/config/routes";
import CategoryCard from "./category-card";

export default async function GetFeaturedCategories() {
  const { data: categories } = await apiServer.category.getAllFeaturedCategories({
    query: {},
  });

  if (!categories) {
    return null;
  }

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
        <div className="grid grid-cols-1 h-full w-full border-b sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
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
