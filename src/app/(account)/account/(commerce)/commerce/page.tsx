import { getServerSession } from '@/core/auth/auth.server'
import AccountCommerceComponent from '@/module/account/components/account.commerce-layout'
import { PATH } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const session = await getServerSession()
  if (!session) return redirect(PATH.ROOT)
  return <AccountCommerceComponent />
}
