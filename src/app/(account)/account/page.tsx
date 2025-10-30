import { getServerSession } from '@/core/auth/auth.server'
import AccountRootComponent from '@/module/account/components/account.root'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const session = await getServerSession()
  if (session == null) return redirect('/auth/sign-in')
  return <AccountRootComponent />
}
