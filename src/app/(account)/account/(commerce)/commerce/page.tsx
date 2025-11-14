import { getServerSession } from '@/core/auth/auth.server'
import AccountCommerceComponent from '@/module/account/account.commerce-layout'
import { PATH } from '@/shared/config/routes'
import { redirect } from 'next/navigation'
import Section from '@/shared/components/layout/section/section'
import { CommerceSidebar } from '@/module/account/account.commerce.sidebar'

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
          <CommerceSidebar />
        </div>
        <div className="col-span-10 h-full w-full">
          <AccountCommerceComponent />
        </div>
      </div>
    </Section>
  )
}
