import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { AccountSidebar } from "@/module/account/account-sidebar";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Your Settings",
  description: "View and manage all active sessions across your devices",
};

export default async function SettingPage() {
  const session = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  return (
    <Section   {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 h-full w-full">
          <AccountSidebar />
        </div>
        <div className="col-span-8 h-full w-full">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>These devices are currently signed in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"></CardContent>
          </Card>
        </div>
        <div className="col-span-2"></div>
      </div>
    </Section>
  );
}
