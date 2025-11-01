'use client'

import { Button } from '@/shared/components/ui/button'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'

import type { Route } from 'next'
import { PATH } from '@/shared/config/routes'
import { Separator } from '@/shared/components/ui/separator'
import Link from 'next/link'
import { Lock, UserIcon } from 'lucide-react'

type NavItem<T extends string = string> = {
  href: T
  label: string
  icon: React.ReactNode
  id: string
}

const sections: NavItem<Route>[] = [
  { id: 'profile', label: 'Profile', href: PATH.ACCOUNT.PROFILE as Route, icon: <UserIcon size={14} /> },
  { id: 'security', label: 'Security', href: PATH.ACCOUNT.SECURITY as Route, icon: <Lock size={14} /> },
  { id: 'sessions', label: 'Sessions', href: PATH.ACCOUNT.SESSIONS as Route, icon: <Lock size={14} /> },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Sections</CardTitle>
        <CardDescription>View & Manage Account</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="px-4">
        <nav className="flex-1">
          <ul className="space-y-4">
            {sections.map((section) => {
              const isActive = pathname === section.href
              return (
                <li key={section.id}>
                  <Link href={section.href}>
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className="flex w-full items-center justify-start text-left text-xs"
                    >
                      {section.icon}
                      <span className="font-medium">{section.label}</span>
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </CardContent>
      <Separator />
      <CardFooter></CardFooter>
    </Card>
  )
}
