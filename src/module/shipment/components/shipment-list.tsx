"use client";

import { Truck } from "lucide-react";
import type { Route } from "next";
import { ShipmentCard } from "@/module/shipment/components/shipment-card";
import type { Shipment } from "@/module/shipment/shipment.schema";
import { ContentEmpty } from "@/shared/components/common/content-empty";
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
      <div className="space-y-4">
        <ContentEmpty
          icon={Truck}
          title="No shipments yet"
          description="Tracking details will show up here after your orders are packed and dispatched."
          primaryAction={{ label: "Browse store", href: PATH.STORE.ROOT }}
          secondaryAction={{ label: "Your orders", href: PATH.ACCOUNT.ORDER }}
        />
        {onRefresh ? (
          <div className="flex justify-center">
            <Button size="sm" variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        ) : null}
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
