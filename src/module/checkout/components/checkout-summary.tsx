"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { apiClient } from "@/core/api/api.client";
import Form from "@/shared/components/form/form";
import { FormSection } from "@/shared/components/form/form.helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

interface CheckoutSummaryProps {
  subtotal: number;
  itemCount: number;
  currency?: string;
}

export function CheckoutSummary({ subtotal, itemCount, currency = "INR" }: CheckoutSummaryProps) {
  const shipping = 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <Card className="border-border bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Order summary</CardTitle>
        <p className="text-xs text-muted-foreground">{itemCount} item(s)</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated tax (18%)</span>
          <span>₹{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function CheckoutSummaryFormFields() {
  return (
    <div className="space-y-4">
      <DeliveryMethodSection />
      <FormSection title="Order notes" description="Optional instructions for your order.">
        <Form.Field
          name="body.notes"
          label="Notes"
          type="textarea"
          placeholder="Delivery instructions, gift message, etc."
        />
      </FormSection>
      <FormSection title="Terms" description="You must agree to place an order." required>
        <Form.Field
          name="body.agreeToTerms"
          label="I agree to the terms and conditions and refund policy"
          type="switch"
          required
        />
      </FormSection>
    </div>
  );
}

function DeliveryMethodSection() {
  const form = useFormContext();
  const shippingAddressId = useWatch({
    control: form.control,
    name: "body.shippingAddressId",
  }) as string | undefined;

  const hasAddress = typeof shippingAddressId === "string" && shippingAddressId.length > 0;

  const { data, isLoading } = apiClient.shippingConfig.getOptions.useQuery(
    { body: { shippingAddressId: hasAddress ? shippingAddressId : "" } },
    {
      enabled: hasAddress,
    },
  );

  const options = data?.data ?? [];

  const selectedMethodId = useWatch({
    control: form.control,
    name: "body.shippingMethodId",
  }) as string | undefined;

  useEffect(() => {
    if (!options.length) return;
    const currentMethodId = selectedMethodId ?? (form.getValues("body.shippingMethodId") as string | undefined);
    if (!currentMethodId) {
      const first = options[0];
      form.setValue("body.shippingMethodId", first.methodId, { shouldValidate: true });
      form.setValue("body.shippingProviderId", first.providerId, { shouldValidate: true });
    }
  }, [options, form, selectedMethodId]);

  useEffect(() => {
    if (!selectedMethodId) return;
    const match = options.find((opt) => opt.methodId === selectedMethodId);
    if (!match) return;
    form.setValue("body.shippingProviderId", match.providerId, { shouldValidate: true });
  }, [selectedMethodId, options, form]);

  return (
    <FormSection
      title="Delivery method"
      description={
        !hasAddress
          ? "Add a shipping address to see available delivery methods."
          : "Choose how you want your order delivered."
      }
      required
    >
      {!hasAddress && <p className="text-xs text-muted-foreground">No shipping address selected yet.</p>}
      {hasAddress && isLoading && <p className="text-xs text-muted-foreground">Loading available delivery methods…</p>}
      {hasAddress && !isLoading && options.length === 0 && (
        <p className="text-xs text-destructive">
          No delivery options are configured for this address. Please use a different address.
        </p>
      )}
      {hasAddress && options.length > 0 && (
        <Form.Field
          name="body.shippingMethodId"
          label="Choose a delivery option"
          type="radio"
          required
          options={options.map((opt) => ({
            value: opt.methodId,
            label: `${opt.providerName} – ${opt.methodName} · ₹${opt.price.toLocaleString()}${
              opt.etaDays ? ` · ${opt.etaDays}-day delivery` : ""
            }`,
          }))}
        />
      )}
    </FormSection>
  );
}
