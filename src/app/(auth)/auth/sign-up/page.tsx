import { getServerSession } from '@/core/auth/auth.server'
import { SignUpForm } from '@/module/auth/components/auth.sign-up'
import { redirect } from 'next/navigation'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'

const metadata = {
  title: 'Sign Up',
  description: 'Sign Up to your account',
}
export default async function SignUpPage() {
  const { session } = await getServerSession()
  if (session) redirect(PATH.ROOT)

  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <SignUpForm />
        </Section>
      </Shell.Section>
    </Shell>
  )
}
