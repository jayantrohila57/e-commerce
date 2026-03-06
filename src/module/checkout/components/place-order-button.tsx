"use client";

import { Loader2, Lock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface PlaceOrderButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  razorpayConfigured?: boolean;
}

export function PlaceOrderButton({ disabled, isLoading, razorpayConfigured = true }: PlaceOrderButtonProps) {
  const isDisabled = disabled || isLoading || !razorpayConfigured;

  return (
    <div className="space-y-2">
      {!razorpayConfigured && (
        <p className="text-sm text-amber-600 dark:text-amber-500">
          Add <code className="rounded bg-muted px-1">NEXT_PUBLIC_RAZORPAY_KEY_ID</code> to{" "}
          <code className="rounded bg-muted px-1">.env.local</code> and restart the dev server to enable payment.
        </p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={isDisabled}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : !razorpayConfigured ? (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Payment not configured
          </>
        ) : (
          "Pay with Razorpay"
        )}
      </Button>
    </div>
  );
}
