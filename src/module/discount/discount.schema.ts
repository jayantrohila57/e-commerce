import { z } from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";

/**
 * Discount type as stored in the database enum `discount_type`.
 */
export const discountTypeEnum = z.enum(["flat", "percent"]);
export type DiscountType = z.infer<typeof discountTypeEnum>;

export const discountSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  type: discountTypeEnum,
  /**
   * For `percent`, store basis points (e.g. 10% => 1000).
   * For `flat`, store smallest currency unit (e.g. paise).
   */
  value: z.number().int().nonnegative(),
  minOrderAmount: z.number().int().nonnegative().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  usedCount: z.number().int().nonnegative().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

export type Discount = z.infer<typeof discountSchema>;

export const discountInsertSchema = discountSchema.omit({
  id: true,
  usedCount: true,
  createdAt: true,
  updatedAt: true,
});

export const discountUpdateSchema = discountInsertSchema.partial();

export const discountListInputSchema = z.object({
  query: offsetPaginationSchema
    .extend({
      code: z.string().optional(),
      type: discountTypeEnum.optional(),
      isActive: z.boolean().optional(),
      isExpired: z.boolean().optional(),
    })
    .optional(),
});

export const discountValidateInputSchema = z.object({
  body: z.object({
    code: z.string().min(1, "Discount code is required"),
    cartSubtotal: z.number().int().nonnegative(),
  }),
});

export const appliedDiscountSchema = z.object({
  code: z.string(),
  type: discountTypeEnum,
  /**
   * Amount discounted in smallest currency unit.
   */
  appliedAmount: z.number().int().nonnegative(),
  message: z.string().optional(),
});

export const discountContract = {
  list: {
    input: discountListInputSchema.optional(),
    output: detailedResponse(z.array(discountSchema)),
  },
  get: {
    input: z.object({
      params: z.object({ id: z.string().min(1) }),
    }),
    output: detailedResponse(discountSchema),
  },
  create: {
    input: z.object({ body: discountInsertSchema }),
    output: detailedResponse(discountSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string().min(1) }),
      body: discountUpdateSchema,
    }),
    output: detailedResponse(discountSchema),
  },
  validateAndPrice: {
    input: discountValidateInputSchema,
    output: detailedResponse(appliedDiscountSchema),
  },
};
