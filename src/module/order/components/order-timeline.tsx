"use client";

import { CheckCircle2, Clock3, Package, Truck } from "lucide-react";
import type { Order } from "@/module/order/order.schema";

interface OrderTimelineProps {
  order: Order;
}

const STATUS_STEPS: {
  id: Order["status"];
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "pending",
    label: "Pending",
    description: "Order has been placed and is waiting for payment or manual confirmation.",
    icon: Clock3,
  },
  {
    id: "paid",
    label: "Paid",
    description: "Payment has been received and the order is ready for fulfillment.",
    icon: CheckCircle2,
  },
  {
    id: "shipped",
    label: "Shipped",
    description: "Items have left the warehouse and are with the carrier.",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "The order has been delivered to the customer.",
    icon: Package,
  },
  {
    id: "cancelled",
    label: "Cancelled",
    description: "The order has been cancelled and will not be processed further.",
    icon: CheckCircle2,
  },
];

export function OrderTimeline({ order }: OrderTimelineProps) {
  const currentStatus = order.status;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Order status</h3>
      <ol className="space-y-3 text-xs">
        {STATUS_STEPS.filter((step) => step.id !== "cancelled" || currentStatus === "cancelled").map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStatus;
          const isCompleted =
            currentStatus === "cancelled"
              ? step.id === "cancelled"
              : STATUS_STEPS.findIndex((s) => s.id === step.id) <=
                STATUS_STEPS.findIndex((s) => s.id === currentStatus);

          return (
            <li key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center border text-[10px] ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                {index < STATUS_STEPS.length - 1 && <div className="mt-1 h-6 w-px bg-border/70" aria-hidden="true" />}
              </div>
              <div className="pt-0.5 space-y-1">
                <p className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                <p className="max-w-xs text-[11px] leading-snug text-muted-foreground">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
