import { getServerSession } from '@/core/auth/auth.server'
import { SignInForm } from '@/module/auth/components/auth.sign-in'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { redirect } from 'next/navigation'
import { PATH } from '@/shared/config/routes'

const metadata = {
  title: 'Sign In',
  description: 'Sign In to your account',
}
export default async function SignInPage() {
  const { session } = await getServerSession()
  if (session != null) redirect(PATH.ROOT)

  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <SignInForm />
        </Section>
      </Shell.Section>
    </Shell>
  )
}
