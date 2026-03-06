"use client";

import { CreditCard } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { PATH } from "@/shared/config/routes";

export type PaymentListItem = {
  paymentId?: string;
  orderId: string;
  status: "pending" | "completed" | "failed" | "refunded" | "unpaid";
  provider?: "stripe" | "razorpay" | "paypal" | "cod";
  amount: number;
  currency: string;
  createdAt?: Date | null;
};

function formatMoney(amountInSmallestUnit: number, currency: string) {
  const amount = amountInSmallestUnit / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function PaymentCard({ item }: { item: PaymentListItem }) {
  const href = `${PATH.ACCOUNT.ORDER}/${item.orderId}` as Route;
  const badgeVariant =
    item.status === "completed"
      ? ("secondary" as const)
      : item.status === "pending"
        ? ("outline" as const)
        : ("destructive" as const);

  return (
    <Link href={href}>
      <div className="bg-secondary hover:bg-secondary/80 motion-all flex w-full items-center justify-between gap-3 rounded-md border p-2 shadow-xs">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-8" />
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-semibold">Order Payment</p>
              <Badge variant={badgeVariant} className="shrink-0 capitalize">
                {item.status}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate text-xs font-mono">
              {item.orderId}
              {item.provider ? ` · ${item.provider}` : ""}
            </p>
          </div>
        </div>

        <Card className="bg-background/40 hidden shrink-0 px-3 py-2 sm:block">
          <p className="text-xs text-muted-foreground">Amount</p>
          <p className="text-sm font-medium">{formatMoney(item.amount, item.currency)}</p>
        </Card>
      </div>
    </Link>
  );
}
