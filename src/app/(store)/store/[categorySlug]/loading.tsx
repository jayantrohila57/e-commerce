import CategoryListingSkeleton from "@/module/category/category.component.all-skeleton";
import Section from "@/shared/components/layout/section/section";

export default async function CategoryLoading() {
  return (
    <Section>
      <CategoryListingSkeleton />
    </Section>
  );
}
