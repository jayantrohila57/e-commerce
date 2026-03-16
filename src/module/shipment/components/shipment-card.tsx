"use client";

import { format } from "date-fns";
import type { Route } from "next";
import Link from "next/link";
import { ShipmentStatusBadge } from "@/module/shipment/components/shipment-status-badge";
import type { Shipment } from "@/module/shipment/shipment.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

interface ShipmentCardProps {
  shipment: Shipment;
  orderId?: string;
  href?: Route | string;
}

export function ShipmentCard({ shipment, orderId, href }: ShipmentCardProps) {
  const createdAt = shipment.createdAt ? format(new Date(shipment.createdAt), "dd MMM yyyy") : "";
  const link = href ?? (orderId ? `${PATH.ACCOUNT.ORDER}/${orderId}` : PATH.ACCOUNT.SHIPMENT);

  return (
    <Card className="border border-border/80 bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold">
            {shipment.trackingNumber ? `Tracking: ${shipment.trackingNumber}` : `Shipment #${shipment.id.slice(0, 8)}`}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{createdAt}</p>
        </div>
        <ShipmentStatusBadge status={shipment.status} />
      </CardHeader>

      <CardContent className="space-y-2 text-xs text-muted-foreground">
        {shipment.carrier && (
          <div className="flex items-center justify-between">
            <span>Carrier</span>
            <span className="font-medium text-foreground">{shipment.carrier}</span>
          </div>
        )}
        {shipment.shippingProviderId && (
          <div className="flex items-center justify-between">
            <span>Provider</span>
            <span className="font-medium text-foreground">{shipment.shippingProviderId}</span>
          </div>
        )}
        {shipment.shippingMethodId && (
          <div className="flex items-center justify-between">
            <span>Method</span>
            <span className="font-medium text-foreground">{shipment.shippingMethodId}</span>
          </div>
        )}
        {shipment.estimatedDeliveryAt && (
          <div className="flex items-center justify-between">
            <span>Est. delivery</span>
            <span className="font-medium text-foreground">
              {format(new Date(shipment.estimatedDeliveryAt), "dd MMM yyyy")}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3">
        <span className="text-[11px] text-muted-foreground">
          Order #{orderId?.slice(0, 8) ?? shipment.orderId.slice(0, 8)}
        </span>
        <Button variant="outline" size="sm" asChild className="h-7 px-3 text-xs">
          <Link href={link as Route}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
