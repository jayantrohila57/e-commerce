"use client";

import type { Route } from "next";
import Link from "next/link";
import { OrderStatusActions } from "@/module/order/components/order-status-actions";
import type { Order } from "@/module/order/order.schema";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

interface OrderOverviewCardProps {
  order: Order;
}

export function OrderOverviewCard({ order }: OrderOverviewCardProps) {
  const shortId = order.id.slice(0, 8);
  const placedAt =
    order.placedAt instanceof Date && !Number.isNaN(order.placedAt.getTime())
      ? `${order.placedAt.toLocaleDateString()} ${order.placedAt.toLocaleTimeString()}`
      : null;

  return (
    <Card className="bg-transparent border-none border-r rounded-none border-b">
      <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex flex-wrap items-center gap-2 text-base font-semibold">
            <span>Order #{shortId}</span>
            <Badge variant="outline" className="capitalize">
              {order.status}
            </Badge>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {placedAt && <span>Placed on {placedAt}</span>}
            <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
            <span>
              Total{" "}
              <span className="font-medium text-foreground">
                {order.currency} {(order.grandTotal / 100).toFixed(2)}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusActions orderId={order.id} status={order.status} />
          <Button asChild size="sm" variant="outline">
            <Link href={PATH.STUDIO.ORDERS.ROOT as Route}>Back to orders</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-muted-foreground">
        <div className="space-y-0.5">
          <p className="text-[11px] uppercase tracking-wide">Order reference</p>
          <p className="font-mono text-sm text-foreground">{order.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            Send invoice
          </Button>
          <Button size="sm" variant="outline">
            Print invoice
          </Button>
          <Button size="sm" variant="outline">
            More actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
