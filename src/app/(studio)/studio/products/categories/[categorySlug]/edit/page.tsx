import { apiServer, HydrateClient } from '@/core/api/api.server'
import { getServerSession } from '@/core/auth/auth.server'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { notFound, redirect } from 'next/navigation'
import CategoryEditForm from '@/module/category/category.component.edit-form'

export const metadata = {
  title: 'Edit Category',
  description: 'Edit a category for your store',
}

export default async function EditCategoryPage({
  params,
  searchParams,
}: PageProps<'/studio/products/categories/[categorySlug]/edit'>) {
  const { categorySlug: slug } = await params
  const { id } = await searchParams
  const { session } = await getServerSession()
  if (!session) return redirect(PATH.ROOT)

  const { data } = await apiServer.category.get({
    params: {
      id: String(id),
      slug,
    },
  })

  if ((!id && !slug) || !data) {
    notFound()
  }

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection {...metadata}>
            <CategoryEditForm category={data} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
