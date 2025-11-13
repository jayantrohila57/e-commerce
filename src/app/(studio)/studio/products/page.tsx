import { apiServer, HydrateClient } from '@/core/api/api.server'
import { getServerSession } from '@/core/auth/auth.server'
import CodePreview from '@/shared/components/common/code-preview'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { type Route } from 'next'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Products',
  description: 'Products Description',
}

export default async function Home() {
  const { session } = await getServerSession()
  if (!session) return redirect(PATH.ROOT)

  const { data } = await apiServer.product.getMany({
    query: {},
  })

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            {...metadata}
            action="Add Product"
            actionUrl={PATH.STUDIO.PRODUCTS.NEW as Route}
          >
            <CodePreview json={data} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
