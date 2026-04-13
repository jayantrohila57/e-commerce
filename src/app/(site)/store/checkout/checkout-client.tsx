"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { CheckoutForm } from "@/module/checkout";
import { useCheckout } from "@/module/checkout/use-checkout";
import Section from "@/shared/components/layout/section/section";
import { Button } from "@/shared/components/ui/button";
import { PATH } from "@/shared/config/routes";

export function CheckoutClient() {
  const { cart, addresses, isLoading } = useCheckout();
  const hasShippingAddress = addresses.shipping.length > 0;

  if (isLoading) {
    return (
      <Section title="Checkout" description="Loading…">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Section>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Section title="Checkout" description="Your cart is empty">
        <p className="text-muted-foreground">Add items to your cart to checkout.</p>
        <Button asChild className="mt-4">
          <Link href={PATH.STORE.ROOT}>Continue shopping</Link>
        </Button>
      </Section>
    );
  }

  if (!hasShippingAddress) {
    return (
      <Section title="Checkout" description="Shipping address required">
        <p className="text-muted-foreground">Please add a shipping address to continue.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href={PATH.ACCOUNT.ADDRESS_NEW}>Add address</Link>
        </Button>
      </Section>
    );
  }

  return (
    <Section title="Checkout" description="Review your order and complete payment">
      <CheckoutForm />
    </Section>
  );
}
