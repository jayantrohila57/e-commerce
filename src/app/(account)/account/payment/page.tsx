import { apiServer } from "@/core/api/api.server";
import { AccountSection } from "@/module/account/account-section";
import type { PaymentListItem } from "@/module/payment/components/payment-card";
import { PaymentList } from "@/module/payment/components/payment-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const metadata = {
  title: "Payments",
  description: "View payment statuses for your orders",
};

export default async function PaymentPage() {
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
    <AccountSection {...metadata}>
      <Card>
        <CardHeader>
          <CardTitle>Your Payments</CardTitle>
          <CardDescription>Payments are grouped by order (latest status shown).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PaymentList items={items} />
        </CardContent>
      </Card>
    </AccountSection>
  );
}
