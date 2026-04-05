"use client";

import { format } from "date-fns";
import type { Route } from "next";
import Link from "next/link";
import { useMemo } from "react";
import { ShipmentStatusBadge } from "@/module/shipment/components/shipment-status-badge";
import type { Shipment } from "@/module/shipment/shipment.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

interface ShipmentCardProps {
  shipment: Shipment;
  orderId?: string;
  href?: Route | string;
  shippingProviderName?: string;
  shippingMethodName?: string;
}

export function ShipmentCard({ shipment, orderId, href, shippingProviderName, shippingMethodName }: ShipmentCardProps) {
  const createdAt = shipment.createdAt ? format(new Date(shipment.createdAt), "dd MMM yyyy") : "";
  const shipmentLink = href ?? PATH.ACCOUNT.SHIPMENT_DETAIL(shipment.id);
  const orderLink = PATH.ACCOUNT.ORDER_DETAIL(orderId ?? shipment.orderId);
  const trackingUrl = useMemo(() => {
    if (!shipment.trackingNumber) return null;

    const query = encodeURIComponent(shipment.trackingNumber);
    const carrierName = shipment.carrier?.toLowerCase() ?? "";

    if (carrierName.includes("dhl")) {
      return `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${query}`;
    }
    if (carrierName.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${query}`;
    if (carrierName.includes("delhivery")) return `https://www.delhivery.com/track-v2/package/${query}`;

    return `https://www.google.com/search?q=${encodeURIComponent(`track ${shipment.carrier ?? "shipment"} ${shipment.trackingNumber}`)}`;
  }, [shipment.carrier, shipment.trackingNumber]);

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
            <span className="font-medium text-foreground">
              {shippingProviderName ?? shipment.shippingProviderName ?? shipment.shippingProviderId}
            </span>
          </div>
        )}
        {shipment.shippingMethodId && (
          <div className="flex items-center justify-between">
            <span>Method</span>
            <span className="font-medium text-foreground">
              {shippingMethodName ?? shipment.shippingMethodName ?? shipment.shippingMethodId}
            </span>
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          {shipment.trackingNumber && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={async () => {
                await navigator.clipboard.writeText(shipment.trackingNumber as string);
              }}
            >
              Copy tracking
            </Button>
          )}
          {trackingUrl && (
            <Button variant="ghost" size="sm" asChild className="h-7 px-3 text-xs">
              <a href={trackingUrl} target="_blank" rel="noreferrer noopener">
                Track package
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild className="h-7 px-3 text-xs">
            <Link href={orderLink as Route}>View order</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-7 px-3 text-xs">
            <Link href={shipmentLink as Route}>View shipment</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
