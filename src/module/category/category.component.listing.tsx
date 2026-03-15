import type { Route } from "next";
import { PATH } from "@/shared/config/routes";
import type { GetCategoriesOutput } from "./category.types";
import CategoryCard from "./category-card";

export default function CategoriesListing({ data }: { data: GetCategoriesOutput["data"] }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 h-full w-full border-b sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data?.map((category) => (
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
    </div>
  );
}
