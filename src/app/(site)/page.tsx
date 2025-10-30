import { getServerSession } from '@/core/auth/auth.server'
import { AuthSignOutButton } from '@/module/auth/components/auth.sign-out-button'
import Section from '@/shared/components/layout/section/section'
import Shell from '@/shared/components/layout/shell'
import { Button } from '@/shared/components/ui/button'
import { PATH } from '@/shared/config/routes'
import Link from 'next/link'
import { type NextUrls } from '@/shared/config/next-urls'

export const metadata = {
  title: 'Home',
  description: 'Home Description',
}
export default async function Home({}: PageProps<NextUrls['ROOT']>) {
  const { session, user } = await getServerSession()

  return (
    <Shell>
      <Shell.Section>
        <Section {...metadata}>
          <div className="my-6 px-4">
            <div className="space-y-6 text-left">
              {session == null ? (
                <div className="flex flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                  >
                    <Link href={PATH.AUTH.SIGN_IN}>Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                  >
                    <Link href={PATH.AUTH.SIGN_UP}>Sign Up</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                  >
                    <Link href={PATH.AUTH.FORGOT_PASSWORD}>Forgot Password</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">Welcome {user?.name}!</h1>
                  <code className="whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</code>
                  <div className="flex justify-center gap-4">
                    <Button
                      asChild
                      size="lg"
                    >
                      <Link href={PATH.ACCOUNT.PROFILE}>Profile</Link>
                    </Button>
                    <AuthSignOutButton />
                  </div>
                </>
              )}
            </div>
          </div>
        </Section>
      </Shell.Section>
    </Shell>
  )
}
