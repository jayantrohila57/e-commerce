"use client";

import { toast } from "sonner";
import type { z } from "zod/v3";
import { checkoutFormSchema } from "@/module/checkout/checkout.schema";
import type { RazorpaySuccessResponse } from "@/module/checkout/use-checkout";
import { useCheckout } from "@/module/checkout/use-checkout";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Separator } from "@/shared/components/ui/separator";
import { clientEnv } from "@/shared/config/env.client";
import { AddressSelectionSection } from "./address-selection-section";
import { CartReviewSection } from "./cart-review-section";
import { CheckoutSummary, CheckoutSummaryFormFields } from "./checkout-summary";
import { PlaceOrderButton } from "./place-order-button";

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      order_id: string;
      name?: string;
      description?: string;
      handler: (response: RazorpaySuccessResponse) => void;
    }) => { open: () => void };
  }
}

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm() {
  const {
    cart,
    addresses,
    isLoading: dataLoading,
    isPlacingOrder,
    isConfirmingPayment,
    initiateCheckout,
    handlePaymentSuccess,
  } = useCheckout();

  const defaultShippingId = addresses.shipping[0]?.id ?? "";
  const defaultValues: CheckoutFormValues = {
    body: {
      shippingAddressId: defaultShippingId,
      shippingProviderId: "",
      shippingMethodId: "",
      sameAsShipping: true,
      notes: "",
      agreeToTerms: false,
    },
  };

  const handlePlaceOrder = async (data: CheckoutFormValues) => {
    const keyId = clientEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      toast.error("Payment is not configured");
      return;
    }
    if (typeof window === "undefined" || !window.Razorpay) {
      toast.error("Payment script is loading. Please try again in a moment.");
      return;
    }

    const result = await initiateCheckout(data.body);
    if (!result) return;

    const rzp = new window.Razorpay({
      key: keyId,
      amount: result.payment.amount,
      currency: result.payment.currency ?? "INR",
      order_id: result.razorpayOrderId!,
      name: "Shop",
      description: "Order payment",
      handler: (response: RazorpaySuccessResponse) => {
        void handlePaymentSuccess(result.order.id, result.payment.id, response);
      },
    });
    rzp.open();
  };

  const isLoading = dataLoading || isPlacingOrder || isConfirmingPayment;

  return (
    <Form<CheckoutFormValues["body"] extends never ? never : typeof checkoutFormSchema>
      key={defaultShippingId || "no-address"}
      schema={checkoutFormSchema}
      defaultValues={defaultValues}
      onSubmitAction={(values) => handlePlaceOrder(values as CheckoutFormValues)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CartReviewSection items={cart?.items ?? []} isLoading={dataLoading && !cart} />
          <Separator />
          <AddressSelectionSection shippingAddresses={addresses.shipping} billingAddresses={addresses.billing} />
          <Separator />
          <CheckoutSummaryFormFields />
        </div>

        <div className="space-y-4 lg:col-span-1">
          {cart && <CheckoutSummary subtotal={cart.subtotal} itemCount={cart.itemCount} currency="INR" />}
          <Form.StatusBadge />
          <PlaceOrderButton
            disabled={!cart?.items?.length || !addresses.shipping.length}
            isLoading={isLoading}
            razorpayConfigured={!!clientEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID}
          />
        </div>
      </div>
    </Form>
  );
}
