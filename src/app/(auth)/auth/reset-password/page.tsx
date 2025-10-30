import { getServerSession } from '@/core/auth/auth.server'
import ResetPasswordForm from '@/module/auth/components/auth.reset-password'
import { redirect } from 'next/navigation'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { type NextUrls } from '@/shared/config/next-urls'

const metadata = {
  title: 'Reset Password',
  description: 'Reset Password',
}
export default async function ResetPasswordPage({ searchParams }: PageProps<NextUrls['RESET_PASSWORD']>) {
  const { token, error } = await searchParams
  const { session } = await getServerSession()
  if (session) redirect(PATH.ROOT)
  if (!token) redirect(PATH.AUTH.FORGOT_PASSWORD)
  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <ResetPasswordForm
            token={token as string}
            error={error as string}
          />
        </Section>
      </Shell.Section>
    </Shell>
  )
}
