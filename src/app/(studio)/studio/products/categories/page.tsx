import { apiServer, HydrateClient } from '@/core/api/api.server'
import { CategoryCard } from '@/module/category/components/category-card'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { Route } from 'next'

export default async function Category() {
  const { data } = await apiServer.category.getMany({
    query: {
      limit: 50,
      offset: 0,
    },
  })
  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title="Category Management"
            description="Manage your product categories and subcategories"
            action="Add Category"
            actionUrl={PATH.STUDIO.PRODUCTS.CATEGORIES.NEW as Route}
          >
            <div className="grid h-auto w-full grid-cols-4 gap-2">
              {data?.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
