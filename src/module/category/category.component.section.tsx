import type { Route } from "next";
import { FormSection } from "@/shared/components/form/form.helper";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";
import { CategoryCard } from "./category.component.card";
import type { CategoryBase } from "./category.types";

type Category = CategoryBase;

type CategoriesByType = {
  featuredCategoryType: Category[];
  categoryVisibility: {
    publicCategoryType: Category[];
    privateCategoryType: Category[];
    hiddenCategoryType: Category[];
  };
  recentCategoryType: Category[];
  deletedCategoryType: Category[];
};

type CategorySectionProps = {
  title: string;
  description: string;
  categories: Category[];
  emptyMessage?: string;
};

const CategorySection = ({ title, description, categories, emptyMessage = "No categories" }: CategorySectionProps) => (
  <FormSection title={title + ` (${categories?.length})`} description={description}>
    <div className="grid grid-cols-1 gap-2">
      {categories?.length > 0 ? (
        categories?.map((cat) => (
          <CategoryCard href={PATH.STUDIO.SUB_CATEGORIES.ROOT(cat.slug) as Route} key={cat.id} category={cat} />
        ))
      ) : (
        <p className="text-muted-foreground px-2 text-sm">{emptyMessage}</p>
      )}
    </div>
  </FormSection>
);

export function CategoriesSection({ data }: { data: CategoriesByType | null }) {
  const {
    featuredCategoryType = [],
    categoryVisibility: { publicCategoryType = [], privateCategoryType = [], hiddenCategoryType = [] } = {},
    recentCategoryType = [],
    deletedCategoryType = [],
  } = data || { categoryVisibility: {} };

  return (
    <div className="flex flex-col gap-2">
      <CategorySection
        title="Featured Categories"
        description="Featured categories are displayed on the homepage"
        categories={featuredCategoryType}
        emptyMessage="No featured categories"
      />
      <Separator />

      <CategorySection
        title="Public Categories"
        description="Public categories are displayed on the homepage"
        categories={publicCategoryType}
        emptyMessage="No public categories"
      />
      <Separator />

      <CategorySection
        title="Private Categories"
        description="Private categories are displayed on the homepage"
        categories={privateCategoryType}
        emptyMessage="No private categories"
      />
      <Separator />

      <CategorySection
        title="Hidden Categories"
        description="Hidden categories are displayed on the homepage"
        categories={hiddenCategoryType}
        emptyMessage="No hidden categories"
      />
      <Separator />

      <CategorySection
        title="Recently Added"
        description="Recently added categories are displayed on the homepage"
        categories={recentCategoryType}
        emptyMessage="No recent categories"
      />
      <Separator />

      <CategorySection
        title="Recently Deleted"
        description="Recently deleted categories are displayed on the homepage"
        categories={deletedCategoryType}
        emptyMessage="No deleted categories"
      />
    </div>
  );
}
