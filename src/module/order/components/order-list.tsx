"use client";

import { PackageSearch } from "lucide-react";
import { OrderCard } from "@/module/order/components/order-card";
import { useOrder } from "@/module/order/use-order";
import { ContentEmpty } from "@/shared/components/common/content-empty";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATH } from "@/shared/config/routes";

export function OrderList() {
  const { orders, isLoading, refetch } = useOrder();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="space-y-4">
        <ContentEmpty
          icon={PackageSearch}
          title="No orders yet"
          description="When you place an order, it will show up here so you can track status and receipts."
          primaryAction={{ label: "Browse store", href: PATH.STORE.ROOT }}
        />
        <div className="flex justify-center">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Refresh list
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const href = `${PATH.ACCOUNT.ORDER}/${order.id}`;
        return <OrderCard key={order.id} order={order} href={href} />;
      })}
    </div>
  );
}
