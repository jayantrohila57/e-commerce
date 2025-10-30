import { getServerSession } from '@/core/auth/auth.server'
import { ProfileUpdateForm } from '@/module/account/components/account.profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await getServerSession()
  if (session == null) return redirect('/auth/sign-in')
  if (!session.user) return redirect('/auth/sign-in')
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Update your personal information and profile details</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile photo and personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileUpdateForm user={session.user} />
        </CardContent>
      </Card>
    </div>
  )
}
