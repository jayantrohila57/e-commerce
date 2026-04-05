"use client";

import { OrderCustomerCell } from "@/module/order/components/order-customer-cell";
import type { Order } from "@/module/order/order.schema";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface OrderCustomerCardProps {
  order: Order;
}

export function OrderCustomerCard({ order }: OrderCustomerCardProps) {
  const isGuest = !order.userId && !order.user;

  return (
    <Card className="bg-transparent border-none border-r rounded-none border-b">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b">
        <CardTitle className="text-sm font-semibold">Customer</CardTitle>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
          {isGuest ? "Guest" : "Registered"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 py-3">
        <OrderCustomerCell order={order} />

        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" variant="outline">
            Open customer
          </Button>
          {!isGuest && (
            <Button size="sm" variant="outline">
              View all orders
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
