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
import Section from '@/shared/components/layout/section/section'
import { AccountSidebar } from '@/module/account/components/account-sidebar'
import { PATH } from '@/shared/config/routes'

export const metadata = {
  title: 'Security & Privacy',
  description: 'Update your password and two-factor authentication settings',
}

export default async function SecurityPage() {
  const session = await getServerSession()
  if (!session) return redirect(PATH.ROOT)
  const [accounts] = await Promise.all([getServerAccounts()])
  const hasPasswordAccount = Boolean(accounts?.some((a) => a?.providerId === 'credential'))
  const isTwoFactorEnabled = Boolean(session?.user?.twoFactorEnabled)

  return (
    <Section {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 h-full w-full">
          <AccountSidebar />
        </div>
        <div className="col-span-8 h-full w-full">
          <div className="space-y-6">
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
                        Your password must be at least 8 characters long and include a mix of letters, numbers, and
                        symbols.
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
                  <CardDescription>
                    If you signed up with a social provider, you can set a password here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SetPasswordButton email={session.user?.email ?? ''} />
                </CardContent>
              </Card>
            )}
            {hasPasswordAccount && (
              <>
                <Separator />
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Two-factor authentication adds an additional layer of security to your account by requiring more
                    than just a password to sign in.
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
        </div>
        <div className="col-span-2"></div>
      </div>
    </Section>
  )
}
