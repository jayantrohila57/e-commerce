import { getServerSession } from '@/core/auth/auth.server'
import { SignUpForm } from '@/module/auth/auth.sign-up'
import { redirect } from 'next/navigation'
import Shell from '@/shared/components/layout/shell'
import { PATH } from '@/shared/config/routes'
import { AuthCard, AuthFooterNote } from '@/shared/components/layout/section/auth.card-layout'
import { AuthProviders } from '@/module/auth/auth.providers'

export const metadata = {
  title: 'Sign Up',
  description: 'Sign Up to your account',
}
export default async function SignUpPage() {
  const { session } = await getServerSession()
  if (session) redirect(PATH.ROOT)

  return (
    <Shell>
      <AuthCard
        {...metadata}
        footer={
          <AuthFooterNote
            hint="Already have an account?"
            action="Sign in"
            href={PATH.AUTH.SIGN_IN}
          />
        }
      >
        <SignUpForm />
        <div className="relative text-center">
          <span className="text-muted-foreground bg-card relative z-10 px-2 text-xs">or</span>
          <div
            className="border-border absolute inset-x-0 top-1/2 -translate-y-1/2 border-t"
            aria-hidden
          />
        </div>
        <AuthProviders />
      </AuthCard>
    </Shell>
  )
}
