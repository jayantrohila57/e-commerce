import { OrderItemList } from "@/module/order/components/order-item-list";
import { OrderSummary } from "@/module/order/components/order-summary";
import { OrderTimeline } from "@/module/order/components/order-timeline";
import type { Order } from "@/module/order/order.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface OrderDetailSectionProps {
  order: Order;
  showTimeline?: boolean;
  actions?: React.ReactNode;
}

export function OrderDetailSection({ order, showTimeline = true, actions }: OrderDetailSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Order items</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderItemList order={order} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Shipping address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order.shippingAddress.fullName || "Recipient"}</p>
            <p>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            </p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <OrderSummary order={order} />
        {showTimeline && (
          <Card>
            <CardContent className="pt-4">
              <OrderTimeline order={order} />
            </CardContent>
          </Card>
        )}
        {actions && (
          <Card>
            <CardContent className="flex flex-col gap-2 pt-4">{actions}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
