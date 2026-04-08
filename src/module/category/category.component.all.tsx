import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";
import type { GetCategoryWithSubcategoriesOutput } from "./category.types";
import CategoryCard from "./category-card";

export const CategoryItem = ({ data }: { data: GetCategoryWithSubcategoriesOutput["data"] }) => {
  if (!data) return null;

  const subs = data.subcategories ?? [];
  if (subs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-muted-foreground max-w-md text-sm">
          There are no subcategories to browse in this category yet. Explore the rest of the store or go back to all
          categories.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.STORE.ROOT as Route}>Shop all</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={PATH.STORE.CATEGORIES.ROOT as Route}>All categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-rows-auto grid h-full w-full grid-cols-4">
      {subs.map((subcategory) => (
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
