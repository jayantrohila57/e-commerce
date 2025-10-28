'use client'

import { signOut, useSession } from '@/core/auth/auth.client'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const { data: session, isPending: loading } = useSession()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="my-6 px-4">
      <div className="space-y-6 text-left">
        {session == null ? (
          <div className="flex flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/auth/forgot-password">Forgot Password</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome {session.user.name}!</h1>
            <code className="whitespace-pre-wrap">
              {JSON.stringify(session, null, 2)}
            </code>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/organizations">Organizations</Link>
              </Button>
              <Button onClick={() => signOut()} size="lg" variant="outline">
                Signout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
