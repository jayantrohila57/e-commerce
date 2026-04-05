"use client";

import { Truck } from "lucide-react";
import type { Route } from "next";
import { ShipmentCard } from "@/module/shipment/components/shipment-card";
import type { Shipment } from "@/module/shipment/shipment.schema";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATH } from "@/shared/config/routes";

interface ShipmentListProps {
  shipments: Shipment[];
  isLoading?: boolean;
  orderId?: string;
  baseHref?: Route | string;
  onRefresh?: () => void;
  providerNamesById?: Record<string, string>;
  methodNamesById?: Record<string, string>;
}

export function ShipmentList({
  shipments,
  isLoading = false,
  orderId,
  baseHref,
  onRefresh,
  providerNamesById,
  methodNamesById,
}: ShipmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!shipments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/40 px-6 py-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
          <Truck className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">No shipments yet</h3>
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          Shipments for your orders will appear here once they are created and dispatched.
        </p>
        {onRefresh && (
          <Button size="sm" variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {shipments.map((shipment) => (
        <ShipmentCard
          key={shipment.id}
          shipment={shipment}
          orderId={orderId ?? shipment.orderId}
          shippingProviderName={
            shipment.shippingProviderName ??
            (shipment.shippingProviderId ? providerNamesById?.[shipment.shippingProviderId] : undefined)
          }
          shippingMethodName={
            shipment.shippingMethodName ??
            (shipment.shippingMethodId ? methodNamesById?.[shipment.shippingMethodId] : undefined)
          }
          href={(baseHref ? `${baseHref}/${shipment.id}` : undefined) as Route | undefined}
        />
      ))}
    </div>
  );
}
