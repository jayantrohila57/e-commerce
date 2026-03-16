"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/core/api/api.client";
import type { Address } from "@/module/address/address.schema";
import { useAddress } from "@/module/address/use-address";
import { useCart } from "@/module/cart/use-cart";
import { PATH } from "@/shared/config/routes";
import type { CheckoutFormBody, CheckoutInitResult } from "./checkout.schema";

/** Razorpay checkout.js success payload */
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function addressToSnapshot(addr: Pick<Address, "line1" | "line2" | "city" | "state" | "postalCode" | "country">) {
  return {
    fullName: "Customer",
    line1: addr.line1,
    line2: addr.line2 ?? "",
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country,
    phone: "",
  };
}

export function useCheckout() {
  const router = useRouter();
  const { cart, isLoading: cartLoading } = useCart();
  const { addresses, isLoading: addressLoading } = useAddress();

  const createOrder = apiClient.order.create.useMutation();
  const createIntent = apiClient.payment.createIntent.useMutation();
  const confirmPayment = apiClient.payment.confirm.useMutation();

  const shippingAddresses = addresses.filter((a) => a.type === "shipping");
  const billingAddresses = addresses.filter((a) => a.type === "billing");

  /**
   * Create order from cart and create Razorpay payment intent.
   * Returns { order, payment, razorpayOrderId } for opening Razorpay checkout, or null on failure.
   */
  async function initiateCheckout(body: CheckoutFormBody): Promise<CheckoutInitResult | null> {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return null;
    }

    const shippingAddr = shippingAddresses.find((a) => a.id === body.shippingAddressId);
    if (!shippingAddr) {
      toast.error("Please select a valid shipping address");
      return null;
    }

    const billingAddr = body.sameAsShipping
      ? shippingAddr
      : body.billingAddressId
        ? (billingAddresses.find((a) => a.id === body.billingAddressId) ?? shippingAddr)
        : shippingAddr;

    try {
      const orderRes = await createOrder.mutateAsync({
        body: {
          cartId: cart.id,
          shippingAddress: addressToSnapshot(shippingAddr),
          billingAddress: addressToSnapshot(billingAddr),
          notes: body.notes ?? undefined,
          shippingProviderId: body.shippingProviderId,
          shippingMethodId: body.shippingMethodId,
        },
      });

      if (orderRes.status !== "success" || !orderRes.data) {
        toast.error(orderRes.message ?? "Failed to create order");
        return null;
      }

      const orderId = orderRes.data.id;
      const intentRes = await createIntent.mutateAsync({
        body: { orderId, provider: "razorpay" },
      });

      if (intentRes.status !== "success" || !intentRes.data) {
        toast.error(intentRes.message ?? "Failed to create payment");
        return null;
      }

      const { payment, razorpayOrderId } = intentRes.data;
      if (!razorpayOrderId) {
        toast.error("Payment setup failed");
        return null;
      }

      return {
        order: orderRes.data,
        payment,
        razorpayOrderId,
      };
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
      return null;
    }
  }

  async function handlePaymentSuccess(
    orderId: string,
    paymentId: string,
    response: RazorpaySuccessResponse,
  ): Promise<boolean> {
    try {
      const res = await confirmPayment.mutateAsync({
        body: {
          paymentId,
          providerPaymentId: response.razorpay_payment_id,
          status: "completed",
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        },
      });
      if (res.status === "success") {
        router.push(`${PATH.STORE.CHECKOUT.CONFIRMATION}?orderId=${orderId}`);
        return true;
      }
      toast.error(res.message ?? "Payment verification failed");
      return false;
    } catch {
      toast.error("Payment verification failed");
      return false;
    }
  }

  return {
    cart,
    addresses: { shipping: shippingAddresses, billing: billingAddresses, all: addresses },
    isLoading: cartLoading || addressLoading,
    isPlacingOrder: createOrder.isPending || createIntent.isPending,
    isConfirmingPayment: confirmPayment.isPending,
    initiateCheckout,
    handlePaymentSuccess,
  };
}
