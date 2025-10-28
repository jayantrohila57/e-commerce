import { getServerSession } from '@/core/auth/auth.server'
import { ForgotPasswordForm } from '@/module/auth/components/auth.forgot-password'
import { redirect } from 'next/navigation'

export default async function ForgotPasswordPage() {
  const { session } = await getServerSession()
  if (session) redirect('/')
  return (
    <div className="flex h-screen items-center justify-center">
      <ForgotPasswordForm />
    </div>
  )
}
