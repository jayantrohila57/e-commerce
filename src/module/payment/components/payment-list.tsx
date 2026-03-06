"use client";

import { CreditCard } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PaymentCard, type PaymentListItem } from "./payment-card";

export function PaymentList({ items, isLoading = false }: { items: PaymentListItem[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/40 px-6 py-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
          <CreditCard className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">No payments yet</h3>
        <p className="mb-0 max-w-sm text-sm text-muted-foreground">
          Payments will appear here once you place an order and complete checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <PaymentCard key={`${item.orderId}-${item.paymentId ?? "unpaid"}`} item={item} />
      ))}
    </div>
  );
}
