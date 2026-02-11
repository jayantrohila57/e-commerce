import Section from '@/shared/components/layout/section/section'
import { apiServer } from '@/core/api/api.server'
import { CategoryBanner } from '../category/category.banner'

export default async function SiteHero() {
  const { data } = await apiServer.category.getMany({
    query: {},
  })
  return (
    <Section variant="full">
      <CategoryBanner data={data} />
    </Section>
  )
}
