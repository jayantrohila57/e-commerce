import { Shell } from '@/shared/components/layout/shell'
import DashboardSection from '@/shared/components/layout/section/section-dashboard'
import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Separator } from '@/shared/components/ui/separator'

export default async function Loading() {
  return (
    <Shell>
      <Shell.Main variant="dashboard">
        <Shell.Section variant="dashboard">
          <DashboardSection
            title={'Loading'}
            description={'Loading... Please wait.'}
          >
            <Card className="h-[calc(100vh-10.2rem)]">
              <Separator />
              <Skeleton className="h-full w-full" />
            </Card>
          </DashboardSection>
        </Shell.Section>
      </Shell.Main>
    </Shell>
  )
}
