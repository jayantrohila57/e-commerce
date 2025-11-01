import AuthPageLoading from '@/module/auth/components/auth.page-loading'
import { AuthCard } from '@/shared/components/layout/section/auth.card-layout'
import Shell from '@/shared/components/layout/shell'

export const metadata = {
  title: 'Loading...',
  description: 'Please wait while we loading...',
}

export default async function AuthPage() {
  return (
    <Shell>
      <AuthCard {...metadata}>
        <AuthPageLoading />
      </AuthCard>
    </Shell>
  )
}
