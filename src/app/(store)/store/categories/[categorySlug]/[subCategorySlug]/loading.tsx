import SubCategoriesListingSkeleton from '@/module/subcategory/components/subcategory-listing-skeleton'
import Section from '@/shared/components/layout/section/section'

export default async function CategoryLoading() {
  return (
    <Section>
      <SubCategoriesListingSkeleton />
    </Section>
  )
}
