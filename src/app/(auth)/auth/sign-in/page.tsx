import { getServerSession } from '@/core/auth/auth.server'
import { SignInForm } from '@/module/auth/components/auth.sign-in'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const { session } = await getServerSession()
  if (session != null) redirect('/')

  return (
    <div className="flex h-screen items-center justify-center">
      <SignInForm />
    </div>
  )
}
