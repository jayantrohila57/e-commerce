"use client";

import { format } from "date-fns";
import type { Route } from "next";
import Link from "next/link";
import { OrderStatusBadge } from "@/module/order/components/order-status-badge";
import type { Order } from "@/module/order/order.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

interface OrderCardProps {
  order: Order;
  href?: Route | string;
}

export function OrderCard({ order, href }: OrderCardProps) {
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const placedAt = order.placedAt ? format(order.placedAt, "dd MMM yyyy, HH:mm") : "";

  return (
    <Card className="border border-border/80 bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold">Order #{order.id.slice(0, 8)}</CardTitle>
          <p className="text-xs text-muted-foreground">{placedAt}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>

      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span className="font-medium text-foreground">{itemCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span className="font-semibold text-foreground">
            ₹{order.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="space-y-1">
          <p className="font-medium text-foreground">Shipping to</p>
          <p>
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
          </p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3">
        <p className="text-[11px] text-muted-foreground">
          Currency: <span className="font-medium text-foreground">{order.currency}</span>
        </p>
        <Button variant="outline" size="sm" asChild className="h-7 px-3 text-xs">
          <Link href={(href ?? PATH.ACCOUNT.ORDER) as Route}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
