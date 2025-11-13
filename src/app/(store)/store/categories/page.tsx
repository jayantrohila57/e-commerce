import { apiServer, HydrateClient } from '@/core/api/api.server'
import CategoriesListing from '@/module/category/components/categories-listing'
import Section from '@/shared/components/layout/section/section'

export const metadata = {
  title: 'Categories',
  description: 'Update categories details',
}
export default async function CartPage() {
  const { data } = await apiServer.category.getMany({
    query: {},
  })

  return (
    <HydrateClient>
      <Section>
        <CategoriesListing data={data} />
      </Section>
    </HydrateClient>
  )
}
