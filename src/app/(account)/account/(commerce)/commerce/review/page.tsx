import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Review",
  description: "Manage your product reviews",
};
export default async function ReviewPage() {
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  return (
    <Section {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden h-full w-full lg:block">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 h-full w-full lg:col-span-10">
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>
                Reviews and ratings will be available once Phase 25 (Product Reviews &amp; Ratings) is enabled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground rounded-md border border-dashed p-6 text-sm">
                You’ll be able to review purchased items from your{" "}
                <a className="text-foreground underline" href={PATH.ACCOUNT.ORDER}>
                  orders
                </a>{" "}
                once reviews are live.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
