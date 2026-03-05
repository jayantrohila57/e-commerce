"use client";

import type { Order } from "@/module/order/order.schema";
import { Badge } from "@/shared/components/ui/badge";

type OrderStatus = Order["status"];

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  pending: {
    label: "Pending",
    variant: "secondary",
  },
  paid: {
    label: "Paid",
    variant: "default",
  },
  shipped: {
    label: "Shipped",
    variant: "default",
  },
  delivered: {
    label: "Delivered",
    variant: "default",
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
