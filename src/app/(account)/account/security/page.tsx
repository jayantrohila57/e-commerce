import { getServerAccounts, getServerSession } from '@/core/auth/auth.server'
import { redirect } from 'next/navigation'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Info, Shield } from 'lucide-react'
import { Separator } from '@/shared/components/ui/separator'
import { Badge } from '@/shared/components/ui/badge'
import { ChangePasswordForm } from '@/module/account/components/account.password-change'
import { TwoFactorAuthForm } from '@/module/account/components/account.two-factor'
import { SetPasswordButton } from '@/module/account/components/account.set-password'

export default async function SecurityPage() {
  const session = await getServerSession()
  if (session == null) return redirect('/auth/sign-in')

  const [accounts] = await Promise.all([getServerAccounts()])

  const hasPasswordAccount = accounts.some((a) => a.providerId === 'credential')
  const isTwoFactorEnabled = session.user?.twoFactorEnabled ?? false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Password</h1>
        <p className="text-muted-foreground mt-2">Update your password to keep your account secure</p>
      </div>
      {hasPasswordAccount ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>Choose a strong password to protect your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardContent className="space-y-6">
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>If you signed up with a social provider, you can set a password here</CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={session.user?.email ?? ''} />
          </CardContent>
        </Card>
      )}
      {hasPasswordAccount && (
        <>
          <Separator />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Two-Factor Authentication</h1>
            <p className="text-muted-foreground mt-2">Add an extra layer of security to your account</p>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Two-factor authentication adds an additional layer of security to your account by requiring more than just
              a password to sign in.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Enable two-factor authentication to add an extra layer of security to your account
              </CardDescription>
              <CardAction>
                <Badge variant={isTwoFactorEnabled ? 'default' : 'secondary'}>
                  {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
              <TwoFactorAuthForm isEnabled={isTwoFactorEnabled} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
