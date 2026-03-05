import { OrderCard } from "@/module/order/components/order-card";
import type { Order } from "@/module/order/order.schema";
import { FormSection } from "@/shared/components/form/form.helper";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

interface OrdersSectionProps {
  orders: Order[] | null;
}

function OrdersGroupSection({
  title,
  description,
  orders,
  emptyMessage,
}: {
  title: string;
  description: string;
  orders: Order[];
  emptyMessage: string;
}) {
  return (
    <FormSection title={`${title} (${orders.length})`} description={description}>
      <div className="grid grid-cols-1 gap-2">
        {orders.length ? (
          orders.map((order) => {
            const href = PATH.STUDIO.ORDERS.VIEW(order.id);
            return <OrderCard key={order.id} order={order} href={href} />;
          })
        ) : (
          <p className="px-2 text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    </FormSection>
  );
}

export function OrdersSection({ orders }: OrdersSectionProps) {
  const allOrders = orders ?? [];

  const pending = allOrders.filter((o) => o.status === "pending");
  const paid = allOrders.filter((o) => o.status === "paid");
  const shipped = allOrders.filter((o) => o.status === "shipped");
  const delivered = allOrders.filter((o) => o.status === "delivered");
  const cancelled = allOrders.filter((o) => o.status === "cancelled");

  return (
    <div className="flex flex-col gap-2">
      <OrdersGroupSection
        title="Pending Orders"
        description="Orders awaiting payment or processing."
        orders={pending}
        emptyMessage="No pending orders"
      />
      <Separator />

      <OrdersGroupSection
        title="Paid Orders"
        description="Orders that have been paid and are preparing for shipment."
        orders={paid}
        emptyMessage="No paid orders"
      />
      <Separator />

      <OrdersGroupSection
        title="Shipped Orders"
        description="Orders that have left the warehouse and are on their way."
        orders={shipped}
        emptyMessage="No shipped orders"
      />
      <Separator />

      <OrdersGroupSection
        title="Delivered Orders"
        description="Orders successfully delivered to customers."
        orders={delivered}
        emptyMessage="No delivered orders"
      />
      <Separator />

      <OrdersGroupSection
        title="Cancelled Orders"
        description="Orders that have been cancelled."
        orders={cancelled}
        emptyMessage="No cancelled orders"
      />
    </div>
  );
}
