import CategoriesListingSkeleton from "@/module/category/category.component.listing-skeleton";
import Section from "@/shared/components/layout/section/section";

export default async function CategoriesLoading() {
  return (
    <Section>
      <CategoriesListingSkeleton />
    </Section>
  );
}
