"use client";

import type { Order } from "@/module/order/order.schema";
import { useOrder } from "@/module/order/use-order";
import { Button } from "@/shared/components/ui/button";

interface OrderStatusActionsProps {
  orderId: string;
  status: Order["status"];
}

export function OrderStatusActions({ orderId, status }: OrderStatusActionsProps) {
  const { updateStatus, isUpdatingStatus } = useOrder();

  const nextStatus: Order["status"] = status === "pending" ? "paid" : status === "paid" ? "shipped" : "delivered";

  return (
    <Button size="sm" disabled={isUpdatingStatus} onClick={() => updateStatus(orderId, nextStatus)}>
      {isUpdatingStatus ? "Updating..." : `Mark as ${nextStatus}`}
    </Button>
  );
}
