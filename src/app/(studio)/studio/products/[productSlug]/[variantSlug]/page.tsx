import { apiServer, HydrateClient } from '@/core/api/api.server'
import CodePreview from '@/shared/components/common/code-preview'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { slugToTitle } from '@/shared/utils/lib/url.utils'

export default async function ProductVariantPage({
  params,
}: PageProps<'/studio/products/[productSlug]/[variantSlug]'>) {
  const { variantSlug: slug } = await params
  const { data } = await apiServer.productVariant.getBySlug({
    params: {
      slug,
    },
  })

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={slugToTitle(slug)}
            description="Manage your product variant categories and subcategories"
          >
            <CodePreview json={data} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
