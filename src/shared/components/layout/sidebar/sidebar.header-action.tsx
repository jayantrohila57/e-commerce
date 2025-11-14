'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { useSession } from '@/core/auth/auth.client'

const UserDropdown = dynamic(async () => await import('../user/nav-user').then((mod) => mod.UserDropdown), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
})

const ModeToggle = dynamic(async () => await import('@/core/theme/theme.selector').then((mod) => mod.ModeToggle), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
})

const SignOutIcon = dynamic(
  async () => await import('@/module/auth/auth.sign-out-icon').then((mod) => mod.SignOutIcon),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-9 rounded-md" />,
  },
)

export function SidebarHeaderActions() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex flex-row gap-1 sm:gap-2 md:gap-4">
        <ModeToggle />
        <UserDropdown user={session?.user} />
        <SignOutIcon />
      </div>
    )
  }
}
