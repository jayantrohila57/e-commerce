import { getServerSession } from '@/core/auth/auth.server'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Studio',
  description: 'Studio Description',
}

export default async function Home() {
  const { session } = await getServerSession()
  if (!session) return redirect(PATH.ROOT)

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...metadata}>
          <div className="">
            {JSON.stringify({
              session,
            })}
          </div>
        </DashboardSection>
      </Shell.Section>
    </Shell>
  )
}
