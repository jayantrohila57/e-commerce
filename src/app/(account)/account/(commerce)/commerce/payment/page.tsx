import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Payments",
  description: "Update cart details",
};
export default async function CartPage() {
  const session = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  return (
    <Section className="bg-muted p-4" {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-8 h-full w-full">
          <Card>
            <CardHeader>
              <CardTitle>Cart Information</CardTitle>
              <CardDescription>Update your cart details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"></CardContent>
          </Card>
        </div>
        <div className="col-span-2"></div>
      </div>
    </Section>
  );
}
