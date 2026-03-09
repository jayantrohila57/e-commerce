import type { User } from "better-auth";
import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { ProfileUpdateForm } from "@/module/account/account.profile";
import { AccountSidebar } from "@/module/account/account-sidebar";
import { ProfileCard } from "@/module/user/component.user.profile";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "View & Manage Profile",
  description: "Update your personal information and profile details",
};
export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  return (
    <Section   {...metadata}>
      <div className="grid h-full min-h-[800px] w-full grid-cols-12 gap-4 shadow-none">
        <div className="col-span-2 h-full w-full">
          <AccountSidebar />
        </div>
        <div className="col-span-8 h-full w-full">
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
        <div className="col-span-2">
          <ProfileCard user={session.user as User} />
        </div>
      </div>
    </Section>
  );
}
