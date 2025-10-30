import { getServerSession } from '@/core/auth/auth.server'
import { ForgotPasswordForm } from '@/module/auth/components/auth.forgot-password'
import { redirect } from 'next/navigation'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'

export const metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password',
}
export default async function ForgotPasswordPage() {
  const { session } = await getServerSession()
  if (session) redirect(PATH.ROOT)

  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <ForgotPasswordForm />
        </Section>
      </Shell.Section>
    </Shell>
  )
}
