import { HydrateClient, apiServer } from '@/core/api/api.server'
import { getServerSession } from '@/core/auth/auth.server'
import InventorySection from '@/module/inventory/inventory.component.section'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Inventory',
  description: 'Inventory Description',
}

export default async function Home() {
  const { session } = await getServerSession()
  if (!session) return redirect(PATH.ROOT)

  const { data } = await apiServer.inventory.getMany({ query: {} })

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            {...metadata}
            // action="Add Inventory"
            // actionUrl={PATH.STUDIO.INVENTORY.NEW as Route}
          >
            <InventorySection data={data} />
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
