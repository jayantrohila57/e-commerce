import type { User } from "better-auth";
import { Info, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerAccounts, getServerSession, getServerSessions } from "@/core/auth/auth.server";
import { ChangePasswordForm } from "@/module/account/account.password-change";
import { ProfileUpdateForm } from "@/module/account/account.profile";
import { SessionManagement } from "@/module/account/account.session";
import { SetPasswordButton } from "@/module/account/account.set-password";
import { TwoFactorAuthForm } from "@/module/account/account.two-factor";
import AccountUserComponent from "@/module/account/account.user-layout";
import { ProfileCard } from "@/module/user/component.user.profile";
import Section from "@/shared/components/layout/section/section";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Account",
  description: "Account settings",
};

export default async function AccountPage() {
  const [data, sessions, accounts] = await Promise.all([getServerSession(), getServerSessions(), getServerAccounts()]);
  if (!data?.session) return redirect(PATH.ROOT);
  const currentSessionToken = data.session.token;
  const hasPasswordAccount = Boolean(accounts?.some((a) => a?.providerId === "credential"));
  const isTwoFactorEnabled = Boolean(data.user?.twoFactorEnabled);
  if (!data?.session) return redirect(PATH.ROOT);

  return (
    <Section {...metadata}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile photo and personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileUpdateForm user={data.user} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4">
          <ProfileCard user={data.user as User} />
        </div>
      </div>
      <div className="max-w-2xl space-y-6">
        {hasPasswordAccount ? (
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
              <ChangePasswordForm />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Set Password</CardTitle>
              <CardDescription>If you signed up with a social provider, you can set a password here</CardDescription>
            </CardHeader>
            <CardContent>
              <SetPasswordButton email={data.user?.email ?? ""} />
            </CardContent>
          </Card>
        )}
        {hasPasswordAccount && (
          <>
            <Separator />
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication adds an additional layer of security to your account by requiring more than
                just a password to sign in.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Enable two-factor authentication to add an extra layer of security to your account
                </CardDescription>
                <CardAction>
                  <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
                    {isTwoFactorEnabled ? "Enabled" : "Disabled"}
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
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>These devices are currently signed in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSessionToken && <SessionManagement sessions={sessions} currentSessionToken={currentSessionToken} />}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
