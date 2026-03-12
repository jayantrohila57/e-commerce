import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/core/auth/auth.server";
import {
  ContentAnnouncementBar,
  ContentCTA,
  ContentFeatureHighlights,
  ContentOfferBanner,
  ContentPromoBanner,
  ContentSplitBanner,
} from "@/module/site/content-sections";
import Shell from "@/shared/components/layout/shell";
import { PATH } from "@/shared/config/routes";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely with Razorpay",
};

export default async function CheckoutPage() {
  const { session, user } = await getServerSession();
  if (!session || !user) {
    redirect(PATH.AUTH.SIGN_IN);
  }

  return (
    <Shell>
      <Shell.Section>
        <ContentAnnouncementBar page="checkout" />
      </Shell.Section>
      <Shell.Section>
        <ContentPromoBanner page="checkout" />
      </Shell.Section>
      <Shell.Section>
        <ContentSplitBanner page="checkout" />
      </Shell.Section>
      <Shell.Section>
        <CheckoutClient />
      </Shell.Section>
      <Shell.Section>
        <ContentCTA page="checkout" />
      </Shell.Section>
      <Shell.Section>
        <ContentOfferBanner page="checkout" />
      </Shell.Section>
      <Shell.Section>
        <ContentFeatureHighlights page="checkout" />
      </Shell.Section>
    </Shell>
  );
}
