import { getServerSession } from '@/core/auth/auth.server'
import { AuthPageComponent } from '@/module/auth/components/auth.page'
import { AuthCard } from '@/shared/components/layout/section/auth.card-layout'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Get on board',
  description: 'Get on board with our platform.',
}

export default async function AuthPage() {
  const { session } = await getServerSession()
  if (session) redirect(PATH.SITE.ROOT)
  return (
    <Shell>
      <AuthCard {...metadata}>
        <AuthPageComponent />
      </AuthCard>
    </Shell>
  )
}
