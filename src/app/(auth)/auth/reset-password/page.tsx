import { getServerSession } from '@/core/auth/auth.server'
import ResetPasswordForm from '@/module/auth/components/auth.reset-password'
import { redirect } from 'next/navigation'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; error: string }>
}) {
  const { token, error } = await searchParams
  const { session } = await getServerSession()
  if (session) redirect('/')
  return (
    <div className="flex h-screen items-center justify-center">
      <ResetPasswordForm
        token={token}
        error={error}
      />
    </div>
  )
}
