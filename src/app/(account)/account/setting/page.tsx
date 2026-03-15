import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import Section from "@/shared/components/layout/section/section";
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
    <Section {...metadata}>
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6"></CardContent>
        </Card>
      </div>
    </Section>
  );
}
