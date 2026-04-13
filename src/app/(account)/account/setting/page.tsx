import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { AccountSection } from "@/module/account/account-section";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Your Settings",
  description: "View and manage your account settings",
};

export default async function SettingPage() {
  const data = await getServerSession();
  if (!data?.session) return redirect(PATH.ROOT);

  return (
    <AccountSection {...metadata}>
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Review and update your cookie consent choices for this device and your account.
                </p>
              </div>
              <Button asChild className="mt-4">
                <Link href={PATH.ACCOUNT.PRIVACY}>Open privacy settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountSection>
  );
}
