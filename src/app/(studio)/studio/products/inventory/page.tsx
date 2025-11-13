import { HydrateClient } from '@/core/api/api.server'
import { getServerSession } from '@/core/auth/auth.server'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { type Route } from 'next'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Inventory',
  description: 'Inventory Description',
}

export default async function Home() {
  const { session } = await getServerSession()
  if (!session) return redirect(PATH.ROOT)

  return (
    <HydrateClient>
      <Shell>
        <Shell.Section variant="dashboard">
          <DashboardSection
            {...metadata}
            action="Add Inventory"
            actionUrl={PATH.STUDIO.INVENTORY.NEW as Route}
          >
            <div className=""></div>{' '}
          </DashboardSection>
        </Shell.Section>
      </Shell>
    </HydrateClient>
  )
}
