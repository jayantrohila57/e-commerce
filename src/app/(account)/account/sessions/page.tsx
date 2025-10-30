import { getServerSession, getServerSessions } from '@/core/auth/auth.server'
import { RevokeSessionButton } from '@/module/account/components/account.revoke-session-button'
import { SessionManagement } from '@/module/account/components/account.session'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { redirect } from 'next/navigation'

export default async function SessionsPage() {
  const [session, sessions] = await Promise.all([getServerSession(), getServerSessions()])

  if (!session) return redirect('/auth/sign-in')
  if (!session.user) return redirect('/auth/sign-in')

  const currentSessionToken = session?.session?.token
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Session Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all active sessions across your devices</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>These devices are currently signed in to your account</CardDescription>
          <CardAction>
            <RevokeSessionButton />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSessionToken && (
            <SessionManagement
              sessions={sessions}
              currentSessionToken={currentSessionToken}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
