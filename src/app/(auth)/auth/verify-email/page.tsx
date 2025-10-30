import { getServerSession } from '@/core/auth/auth.server'
import { EmailVerification } from '@/module/auth/components/auth.verify-email'
import { redirect } from 'next/navigation'

export default async function VerifyEmail({ searchParams }: { searchParams: Promise<{ email: string }> }) {
  const { email } = await searchParams
  const { session } = await getServerSession()
  if (session != null) redirect('/')
  return (
    <div className="flex h-screen items-center justify-center">
      <EmailVerification email={email} />
    </div>
  )
}
