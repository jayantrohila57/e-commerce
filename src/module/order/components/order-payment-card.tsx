import type { Route } from "next";
import Link from "next/link";
import type { Order } from "@/module/order/order.schema";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface OrderPaymentCardProps {
  order: Order;
}

export function OrderPaymentCard({ order }: OrderPaymentCardProps) {
  const paymentStatus =
    order.status === "pending"
      ? "Payment pending"
      : order.status === "paid"
        ? "Paid"
        : order.status === "cancelled"
          ? "Cancelled"
          : "Payment in progress";

  return (
    <Card className="bg-transparent border-none border-r rounded-none border-b">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b">
        <CardTitle className="text-sm font-semibold">Payment</CardTitle>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
          {paymentStatus}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 py-3 text-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Order total</span>
          <span className="font-medium text-foreground">
            {order.currency} {(order.grandTotal / 100).toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Payments for this order are managed from the Payments section. Use the actions below to review or collect
          payment.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/studio/payment?q=${encodeURIComponent(order.id)}` as Route}>View payments</Link>
          </Button>
          <Button size="sm" variant="outline">
            Collect payment
          </Button>
          <Button size="sm" variant="outline">
            Issue refund
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
