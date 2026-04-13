import { FolderTree } from "lucide-react";
import type { Route } from "next";
import { ContentEmpty } from "@/shared/components/common/content-empty";
import { PATH } from "@/shared/config/routes";
import type { GetCategoriesOutput } from "./category.types";
import CategoryCard from "./category-card";

export default function CategoriesListing({ data }: { data: GetCategoriesOutput["data"] }) {
  const categories = data ?? [];

  if (categories.length === 0) {
    return (
      <ContentEmpty
        icon={FolderTree}
        title="No categories yet"
        description="Product categories will show up here once they are published in the catalog."
        primaryAction={{ label: "Back to store", href: PATH.STORE.ROOT }}
        secondaryAction={{ label: "Home", href: PATH.ROOT }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 h-full w-full border-b sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
    </div>
  );
}
