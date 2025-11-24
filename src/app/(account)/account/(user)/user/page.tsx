import { getServerSession } from '@/core/auth/auth.server'
import { AccountSidebar } from '@/module/account/account-sidebar'
import AccountUserComponent from '@/module/account/account.user-layout'
import Section from '@/shared/components/layout/section/section'
import { PATH } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Account',
  description: 'Account settings',
}

export default async function AccountPage() {
  const session = await getServerSession()
  if (!session) return redirect(PATH.ROOT)
  return (
    <Section
      className="bg-muted p-4"
      {...metadata}
    >
      <div className="grid h-full min-h-[800px] w-full grid-cols-12 gap-4 shadow-none">
        <div className="col-span-2 h-full w-full">
          <AccountSidebar />
        </div>
        <div className="col-span-10 h-full w-full">
          <AccountUserComponent />
        </div>
      </div>
    </Section>
  )
}
