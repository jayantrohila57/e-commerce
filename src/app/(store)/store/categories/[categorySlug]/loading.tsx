import Section from '@/shared/components/layout/section/section'
import CategoryListingSkeleton from '@/module/category/components/category-listing-skeleton'

export default async function CategoryLoading() {
  return (
    <Section>
      <CategoryListingSkeleton />
    </Section>
  )
}
