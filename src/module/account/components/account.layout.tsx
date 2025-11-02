import AccountCommerceComponent from './account.commerce-layout'
import AccountUserComponent from './account.user-layout'

export default function AccountRootComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>
      <AccountUserComponent />
      <AccountCommerceComponent />
    </div>
  )
}
