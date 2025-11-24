import { apiServer, HydrateClient } from '@/core/api/api.server'
import { getServerSession } from '@/core/auth/auth.server'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { notFound, redirect } from 'next/navigation'
import ProductEditForm from '@/module/product/product-edit-form'

export const metadata = {
  title: 'Edit Product',
  description: 'Edit a product for your store',
}

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps<'/studio/products/[productSlug]/edit'>) {
  const { productSlug: slug } = await params
  const { id } = await searchParams
  const { session } = await getServerSession()
  if (!session) return redirect(PATH.ROOT)

  const { data } = await apiServer.product.get({
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
            <ProductEditForm product={data} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
