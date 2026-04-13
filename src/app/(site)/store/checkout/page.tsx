import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import { ContentAnnouncementBar } from "@/module/site/content-sections";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { signInUrlWithCallback } from "@/shared/utils/auth-callback";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely with Razorpay",
};

export default async function CheckoutPage() {
  const { session, user } = await getServerSession();
  if (!session || !user) {
    redirect(signInUrlWithCallback(PATH.STORE.CHECKOUT.ROOT) as Route);
  }

  return (
    <Shell>
      <Shell.Section>
        <ContentAnnouncementBar page="checkout" />
      </Shell.Section>
      <Shell.Section>
        <CheckoutClient />
      </Shell.Section>
    </Shell>
  );
}
