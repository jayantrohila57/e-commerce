"use client";

import type { Shipment } from "@/module/shipment/shipment.schema";
import { Badge } from "@/shared/components/ui/badge";

type ShipmentStatus = Shipment["status"];

const STATUS_CONFIG: Record<
  ShipmentStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  pending: { label: "Pending", variant: "secondary" },
  label_created: { label: "Label created", variant: "outline" },
  picked_up: { label: "Picked up", variant: "default" },
  in_transit: { label: "In transit", variant: "default" },
  out_for_delivery: { label: "Out for delivery", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  exception: { label: "Exception", variant: "destructive" },
  returned: { label: "Returned", variant: "destructive" },
};

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

export function ShipmentStatusBadge({ status, className }: ShipmentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
