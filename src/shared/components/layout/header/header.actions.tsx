'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { type User, type Session } from 'better-auth'
import { Button } from '../../ui/button'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { UserDropdown } from '../user/nav-user'

const ModeToggle = dynamic(async () => await import('@/core/theme/theme.selector').then((mod) => mod.ModeToggle), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
})

export function HeaderActions({ user, session }: { user: User | undefined; session: Session | undefined }) {
  if (!session) {
    return (
      <div className="flex flex-row gap-1 sm:gap-2 md:gap-4">
        <ModeToggle />
        <Link href={PATH.AUTH.SIGN_UP}>
          <Button variant="outline">Sign Up</Button>
        </Link>
        <Link href={PATH.AUTH.SIGN_IN}>
          <Button variant="default">Sign In</Button>
        </Link>
      </div>
    )
  }
  if (session) {
    return (
      <div className="flex flex-row gap-1 sm:gap-2 md:gap-4">
        <ModeToggle />
        {user && <UserDropdown user={user} />}
      </div>
    )
  }
}
