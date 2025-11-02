import { PATH } from '@/shared/config/routes'

import { User, Shield, Settings, KeyRound, UserCog } from 'lucide-react'
import { ContentStack } from './account.stack'

export const accountSections = {
  user: [
    {
      id: 'user',
      name: 'User',
      icon: UserCog,
      sections: [
        {
          name: 'Profile',
          description: 'View and edit your personal information and avatar.',
          icon: User,
          link: PATH.ACCOUNT.PROFILE,
        },
        {
          name: 'Security',
          description: 'Manage passwords, two-factor auth, and connected devices.',
          icon: Shield,
          link: PATH.ACCOUNT.SECURITY,
        },
        {
          name: 'Sessions',
          description: 'View and revoke active login sessions across devices.',
          icon: KeyRound,
          link: PATH.ACCOUNT.SESSIONS,
        },
        {
          name: 'Settings',
          description: 'Adjust preferences, themes, and account-wide configurations.',
          icon: Settings,
          link: PATH.ACCOUNT.SETTINGS,
        },
      ],
    },
  ],
}

export default function AccountUserComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>
      <ContentStack data={accountSections.user} />
    </div>
  )
}
