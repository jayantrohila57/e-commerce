"use client";

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
