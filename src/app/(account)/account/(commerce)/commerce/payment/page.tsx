import { redirect } from "next/navigation";
import { apiServer } from "@/core/api/api.server";
import { getServerSession } from "@/core/auth/auth.server";
import { CommerceSidebar } from "@/module/account/account.commerce.sidebar";
import type { PaymentListItem } from "@/module/payment/components/payment-card";
import { PaymentList } from "@/module/payment/components/payment-list";
import Section from "@/shared/components/layout/section/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

export const metadata = {
  title: "Payments",
  description: "View payment statuses for your orders",
};
export default async function PaymentPage() {
  const { session } = await getServerSession();
  if (!session) return redirect(PATH.ROOT);

  const { data: orders } = await apiServer.order.getMany({});
  const orderList = Array.isArray(orders) ? orders : [];

  const items: PaymentListItem[] = [];

  for (const o of orderList) {
    const { data: payments } = await apiServer.payment.getStatus({
      params: { orderId: o.id },
    });
    const list = Array.isArray(payments) ? payments : [];
    const latest = list[0];

    if (!latest) {
      items.push({
        orderId: o.id,
        status: "unpaid",
        amount: o.grandTotal,
        currency: o.currency ?? "INR",
      });
      continue;
    }

    items.push({
      paymentId: latest.id,
      orderId: latest.orderId,
      status: latest.status,
      provider: latest.provider,
      amount: latest.amount,
      currency: latest.currency ?? "INR",
      createdAt: latest.createdAt ?? null,
    });
  }

  return (
    <Section   {...metadata}>
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 hidden h-full w-full lg:block">
          <CommerceSidebar />
        </div>
        <div className="col-span-12 h-full w-full lg:col-span-10">
          <Card>
            <CardHeader>
              <CardTitle>Your Payments</CardTitle>
              <CardDescription>Payments are grouped by order (latest status shown).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <PaymentList items={items} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
