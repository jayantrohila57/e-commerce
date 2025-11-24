import Section from '@/shared/components/layout/section/section'
import CategoriesListingSkeleton from '@/module/category/category.component.listing-skeleton'

export default async function CategoriesLoading() {
  return (
    <Section>
      <CategoriesListingSkeleton />
    </Section>
  )
}
