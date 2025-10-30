import { getServerSession } from '@/core/auth/auth.server'
import { EmailVerification } from '@/module/auth/components/auth.verify-email'
import { redirect } from 'next/navigation'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'

const metadata = {
  title: 'Verify Email',
  description: 'Verify Email',
}
export default async function VerifyEmail({ searchParams }: { searchParams: Promise<{ email: string }> }) {
  const { email } = await searchParams
  const { session } = await getServerSession()
  if (session) redirect(PATH.ROOT)

  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <EmailVerification email={email} />
        </Section>
      </Shell.Section>
    </Shell>
  )
}
