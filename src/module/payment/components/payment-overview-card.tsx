"use client";

import { CreditCard } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";
import { cn } from "@/shared/utils/lib/utils";
import type { Payment } from "../payment.schema";

const statusColors: Record<Payment["status"], string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-rose-100 text-rose-800 border-rose-200",
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
};

const providerLabels: Record<Payment["provider"], string> = {
  stripe: "Stripe",
  razorpay: "Razorpay",
  paypal: "PayPal",
  cod: "Cash on Delivery",
};

function formatAmount(amountInSmallestUnit: number, currency: string) {
  const amount = amountInSmallestUnit / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function PaymentOverviewCard({ payment }: { payment: Payment }) {
  const router = useRouter();

  const providerLabel = providerLabels[payment.provider] ?? payment.provider;
  const statusLabel = payment.status;
  const statusClass = statusColors[payment.status] ?? "";

  const createdAt =
    payment.createdAt instanceof Date && !Number.isNaN(payment.createdAt.getTime())
      ? `${payment.createdAt.toLocaleDateString()} ${payment.createdAt.toLocaleTimeString()}`
      : null;

  const updatedAt =
    payment.updatedAt instanceof Date && !Number.isNaN(payment.updatedAt.getTime())
      ? `${payment.updatedAt.toLocaleDateString()} ${payment.updatedAt.toLocaleTimeString()}`
      : null;

  const amountLabel = formatAmount(payment.amount, payment.currency ?? "INR");

  return (
    <Card className="bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-base font-semibold">Payment #{payment.id.slice(0, 8)}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Linked to{" "}
              <button
                type="button"
                onClick={() => {
                  router.push(PATH.STUDIO.ORDERS.VIEW(payment.orderId) as Route);
                }}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Order #{payment.orderId.slice(0, 8)}
              </button>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="outline" className={cn("border px-2 py-0.5 text-xs capitalize", statusClass)}>
            {statusLabel}
          </Badge>
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            {providerLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Amount</span>
          <span className="text-lg font-semibold">{amountLabel}</span>
        </div>
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>
            Created at: <span className="font-medium">{createdAt ?? "—"}</span>
          </span>
          <span>
            Updated at: <span className="font-medium">{updatedAt ?? "—"}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
