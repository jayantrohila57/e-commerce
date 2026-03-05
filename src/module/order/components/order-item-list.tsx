"use client";

import { IndianRupee, PackageOpen, ShoppingBag, Tag } from "lucide-react";
import type { Order } from "@/module/order/order.schema";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

interface OrderItemListProps {
  order: Order;
}

export function OrderItemList({ order }: OrderItemListProps) {
  const items = order.items ?? [];

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-muted-foreground">
        <PackageOpen className="mb-2 h-6 w-6" />
        <p>No items found for this order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="space-y-1 text-sm">
          <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-background/60 p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-6 px-2 text-[10px] font-medium uppercase tracking-wide">
                  <PackageOpen className="mr-1 h-3 w-3" />
                  Item
                </Badge>
                <span className="text-[11px] text-muted-foreground">#{item.id.slice(0, 6)}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{item.productTitle}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                {item.variantTitle}
              </p>
              {item.attributes && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.attributes.map((attr) => (
                    <Badge
                      key={`${attr.title}-${attr.value}`}
                      variant="outline"
                      className="h-5 rounded-full px-2 text-[10px] font-normal text-muted-foreground"
                    >
                      {attr.title}: {attr.value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1 text-right text-xs text-muted-foreground">
              <p className="flex items-center justify-end gap-1">
                <ShoppingBag className="h-3 w-3" />
                <span className="font-medium text-foreground">{item.quantity}</span>
                <span className="text-[11px]">pcs</span>
              </p>
              <p className="flex items-center justify-end gap-1">
                <IndianRupee className="h-3 w-3" />
                <span className="font-medium text-foreground">
                  {item.unitPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </p>
              <p className="mt-1 flex items-center justify-end gap-1 text-[11px] font-semibold text-foreground">
                <span className="text-muted-foreground">Line total</span>
                <IndianRupee className="h-3 w-3" />
                <span>{item.totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </p>
            </div>
          </div>
          {index < items.length - 1 && <Separator className="mt-3" />}
        </div>
      ))}
    </div>
  );
}
