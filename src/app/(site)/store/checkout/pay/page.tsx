import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { CheckoutPayClient } from "@/module/checkout/components/checkout-pay-client";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { signInUrlWithCallback } from "@/shared/utils/auth-callback";

export const metadata: Metadata = {
  title: "Payment",
  description: "Complete your purchase securely",
};

type PageProps = {
  searchParams: Promise<{ orderId?: string; reason?: string }>;
};

export default async function CheckoutPayPage({ searchParams }: PageProps) {
  const { orderId, reason } = await searchParams;
  if (!orderId) {
    redirect(PATH.STORE.CHECKOUT.ROOT);
  }

  const { session, user } = await getServerSession();
  if (!session || !user) {
    const returnTo = `${PATH.STORE.CHECKOUT.PAY}?orderId=${encodeURIComponent(orderId)}`;
    redirect(signInUrlWithCallback(returnTo) as Route);
  }

  return (
    <Shell>
      <Shell.Section>
        <CheckoutPayClient orderId={orderId} reason={reason ?? null} />
      </Shell.Section>
    </Shell>
  );
}
