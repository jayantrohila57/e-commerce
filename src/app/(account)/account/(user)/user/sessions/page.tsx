import { redirect } from "next/navigation";
import { getServerSession, getServerSessions } from "@/core/auth/auth.server";
import { SessionManagement } from "@/module/account/account.session";
import { AccountSidebar } from "@/module/account/account-sidebar";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Your Sessions",
  description: "View and manage all active sessions across your devices",
};

export default async function SessionsPage() {
  const [session, sessions] = await Promise.all([getServerSession(), getServerSessions()]);
  if (!session) return redirect(PATH.ROOT);

  const currentSessionToken = session?.session?.token;
  return (
    <Section {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 h-full w-full">
          <AccountSidebar />
        </div>
        <div className="col-span-8 h-full w-full">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>These devices are currently signed in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentSessionToken && (
                <SessionManagement sessions={sessions} currentSessionToken={currentSessionToken} />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2"></div>
      </div>
    </Section>
  );
}
