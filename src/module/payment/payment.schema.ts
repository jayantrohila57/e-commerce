import { z } from "zod/v3";
import { detailedResponse } from "@/shared/schema";

export const paymentStatusEnum = z.enum(["pending", "completed", "failed", "refunded"]);
export const paymentProviderEnum = z.enum(["stripe", "razorpay", "paypal", "cod"]);

export type PaymentProviderMetadata = Record<string, unknown>;

export const paymentBaseSchema = z.object({
  id: z.string().min(1),
  orderId: z.string().min(1),
  provider: paymentProviderEnum,
  status: paymentStatusEnum,
  amount: z.number().int(),
  currency: z.string().default("INR"),
  providerPaymentId: z.string().nullable().optional(),
  providerMetadata: z.record(z.unknown()).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

export const paymentSelectSchema = paymentBaseSchema;

export const paymentIntentInputSchema = z.object({
  orderId: z.string().min(1),
  provider: paymentProviderEnum,
});

export const paymentConfirmInputSchema = z.object({
  paymentId: z.string().min(1),
  providerPaymentId: z.string().min(1),
  status: paymentStatusEnum,
  metadata: z.record(z.any()).optional(),
  /** Razorpay: required for signature verification when provider is razorpay */
  razorpayOrderId: z.string().min(1).optional(),
  razorpayPaymentId: z.string().min(1).optional(),
  razorpaySignature: z.string().min(1).optional(),
});

/** createIntent returns payment record + optional Razorpay order id for checkout.js */
export const createIntentOutputDataSchema = z.object({
  payment: paymentSelectSchema,
  razorpayOrderId: z.string().optional(),
});

export const paymentContract = {
  createIntent: {
    input: z.object({
      body: paymentIntentInputSchema,
    }),
    output: detailedResponse(createIntentOutputDataSchema),
  },
  confirm: {
    input: z.object({
      body: paymentConfirmInputSchema,
    }),
    output: detailedResponse(paymentSelectSchema),
  },
  getStatus: {
    input: z.object({
      params: z.object({ orderId: z.string().min(1) }),
    }),
    output: detailedResponse(z.array(paymentSelectSchema)),
  },
};

export type Payment = z.infer<typeof paymentSelectSchema>;
export type PaymentIntentInput = z.infer<typeof paymentIntentInputSchema>;
export type PaymentConfirmInput = z.infer<typeof paymentConfirmInputSchema>;
