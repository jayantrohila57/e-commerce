import type React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { User, Shield, Settings, type LucideIcon } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { getServerSession } from '@/core/auth/auth.server'
import { AuthSignOutButton } from '@/module/auth/components/auth.sign-out-button'
import { Button } from '@/shared/components/ui/button'

import type { Route } from 'next'

type NavItem<T extends string = string> = {
  href: T
  title: string
  icon: LucideIcon
  description: string
}

const accountSections: NavItem<Route>[] = [
  {
    title: 'Profile',
    href: '/account/profile',
    icon: User,
    description: 'Update your profile information',
  },
  {
    title: 'Security',
    href: '/account/security',
    icon: Shield,
    description: 'Manage your security settings',
  },
  {
    title: 'Sessions',
    href: '/account/sessions',
    icon: Settings,
    description: 'View and manage active sessions',
  },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-start gap-4">
                  <div className="">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt="User avatar"
                      />
                      <AvatarFallback className="text-lg">NA</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="">
                    <CardTitle>{session?.user?.name || 'User Profile'}</CardTitle>
                    <CardDescription>{session?.user?.email}</CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Badge>{session?.user?.role ?? 'User'}</Badge>
                </CardAction>
              </CardHeader>
              <Separator className="my-0" />
              <CardContent>
                <div className="mb-4 text-lg font-semibold">Account Setting</div>
                <nav className="flex flex-col gap-4">
                  {accountSections.map((section) => {
                    const Icon = section.icon
                    return (
                      <Link
                        key={section.href}
                        href={section.href}
                      >
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-start"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{section.title}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </nav>
              </CardContent>
              <Separator className="my-0" />
              <CardFooter>
                <AuthSignOutButton />
              </CardFooter>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
