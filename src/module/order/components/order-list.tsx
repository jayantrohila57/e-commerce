"use client";

import { PackageSearch } from "lucide-react";
import { OrderCard } from "@/module/order/components/order-card";
import { useOrder } from "@/module/order/use-order";
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
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/40 px-6 py-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
          <PackageSearch className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">No orders yet</h3>
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          You haven't placed any orders yet. Once you do, they will appear here for easy tracking.
        </p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
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
