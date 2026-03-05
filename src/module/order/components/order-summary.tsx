"use client";

import type { Order } from "@/module/order/order.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const subtotal = order.subtotal;
  const discount = order.discountTotal;
  const shipping = order.shippingTotal;
  const tax = order.taxTotal;
  const total = order.grandTotal;

  return (
    <Card className="bg-muted/30 border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Discount</span>
          <span className={discount > 0 ? "text-green-600 font-medium" : ""}>
            {discount > 0 ? "-" : ""}₹{discount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>₹{shipping.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>₹{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>

        <Separator className="my-2" />

        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Total</span>
          <span>₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>

        <p className="pt-2 text-[10px] leading-snug text-muted-foreground">
          Prices shown in {order.currency}. Taxes and discounts are calculated at the time of placing the order.
        </p>
      </CardContent>
    </Card>
  );
}
