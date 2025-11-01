import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import Link from 'next/link'
import { User, Settings, type LucideIcon } from 'lucide-react'

import type { Route } from 'next'

type NavItem<T extends string = string> = {
  href: T
  title: string
  description: string
  icon: LucideIcon
}

const accountSections: NavItem<Route>[] = [
  {
    title: 'Profile Update',
    href: '/account/profile' as Route,
    icon: User,
    description: 'Update your personal information, name, and email address',
  },
  // {
  //   title: 'Change Password',
  //   href: '/account/password',
  //   icon: Key,
  //   description: 'Update your password to keep your account secure',
  // },
  // {
  //   title: 'Two-Factor Authentication',
  //   href: '/account/two-factor',
  //   icon: Lock,
  //   description: 'Add an extra layer of security to your account',
  // },
  // {
  //   title: 'Passkey Management',
  //   href: '/account/passkeys',
  //   icon: Fingerprint,
  //   description: 'Manage your passkeys for passwordless authentication',
  // },
  {
    title: 'Session Management',
    href: '/account/sessions' as Route,
    icon: Settings,
    description: 'View and manage all active sessions across devices',
  },
  // {
  //   title: 'Account Linking',
  //   href: '/account/linking',
  //   icon: Link2,
  //   description: 'Connect your account with external providers',
  // },
  // {
  //   title: 'Account Deletion',
  //   href: '/account/delete',
  //   icon: Trash2,
  //   description: 'Permanently delete your account and all associated data',
  // },
]

export default function AccountRootComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {accountSections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.href}
              href={section.href}
            >
              <Card className="hover:bg-accent/50 motion-colors h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Icon className="text-primary h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{section.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
