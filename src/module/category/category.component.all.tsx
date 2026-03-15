import type { Route } from "next";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import type { GetCategoryWithSubcategoriesOutput } from "./category.types";
import CategoryCard from "./category-card";

export const CategoryItem = ({ data }: { data: GetCategoryWithSubcategoriesOutput["data"] }) => {
  if (!data) return null;

  return (
    <div className="grid-rows-auto grid h-full w-full grid-cols-4">
      {data.subcategories?.map((subcategory) => (
        <CategoryCard
          key={subcategory.id}
          id={subcategory.id}
          href={PATH.STORE.SUB_CATEGORIES.SUBCATEGORY(subcategory.slug, data.slug) as Route}
          title={subcategory.title}
          description={subcategory.description}
          image={subcategory.image}
        />
      ))}
    </div>
  );
};
