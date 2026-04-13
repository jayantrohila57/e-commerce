"use client";

import { CreditCard } from "lucide-react";
import { ContentEmpty } from "@/shared/components/common/content-empty";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATH } from "@/shared/config/routes";
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
      <ContentEmpty
        icon={CreditCard}
        title="No payments yet"
        description="Payments will appear here after you place an order and complete checkout."
        primaryAction={{ label: "Browse store", href: PATH.STORE.ROOT }}
        secondaryAction={{ label: "Your orders", href: PATH.ACCOUNT.ORDER }}
      />
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
