import z from "zod/v3";
import { detailedResponse } from "@/shared/schema";

// Cart line item schema
export const cartLineBaseSchema = z.object({
  id: z.string().min(1),
  cartId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().int().min(0), // price snapshot in smallest currency unit
});

export const cartLineSelectSchema = cartLineBaseSchema;

export const cartLineInsertSchema = cartLineBaseSchema.omit({
  id: true,
});

export const cartLineUpdateSchema = cartLineBaseSchema.partial().pick({
  quantity: true,
});

// Cart schema
export const cartBaseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .nullable(),
});

export const cartSelectSchema = cartBaseSchema.extend({
  lines: z.array(cartLineSelectSchema).optional(),
});

export const cartInsertSchema = cartBaseSchema.omit({
  id: true,
  updatedAt: true,
});

export const cartUpdateSchema = cartBaseSchema.partial();

// Cart item with product details (for frontend display)
export const cartItemSchema = z.object({
  lineId: z.string(),
  variantId: z.string(),
  productId: z.string(),
  productTitle: z.string(),
  variantTitle: z.string(),
  quantity: z.number().int(),
  unitPrice: z.number().int(),
  totalPrice: z.number().int(),
  image: z.string().nullable().optional(),
  attributes: z
    .array(
      z.object({
        title: z.string(),
        type: z.string(),
        value: z.string(),
      }),
    )
    .nullable()
    .optional(),
});

export const cartWithItemsSchema = z.object({
  id: z.string(),
  userId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  items: z.array(cartItemSchema),
  itemCount: z.number().int(),
  subtotal: z.number().int(),
  updatedAt: z.date(),
});

// Cart totals schema
export const cartTotalsSchema = z.object({
  itemCount: z.number().int(),
  subtotal: z.number().int(),
});

// API Contracts
export const cartContract = {
  // Cart identity: authenticated users use ctx.user.id; guests use cart_session_id cookie only (no client userId).
  get: {
    input: z.object({}).optional(),
    output: detailedResponse(cartWithItemsSchema.nullable()),
  },

  // Get user's cart
  getUserCart: {
    input: z.object({}).optional(),
    output: detailedResponse(cartWithItemsSchema.nullable()),
  },

  // Add item to cart
  add: {
    input: z.object({
      body: z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1),
        warehouseId: z.string().min(1).optional(),
        sessionId: z.string().optional(), // for guest carts
      }),
    }),
    output: detailedResponse(cartLineSelectSchema),
  },

  // Update cart item quantity
  update: {
    input: z.object({
      params: z.object({
        lineId: z.string(),
      }),
      body: z.object({
        quantity: z.number().int().min(0), // 0 to remove
      }),
    }),
    output: detailedResponse(cartLineSelectSchema.nullable()),
  },

  // Remove item from cart
  remove: {
    input: z.object({
      params: z.object({
        lineId: z.string(),
      }),
    }),
    output: detailedResponse(z.object({ id: z.string() }).nullable()),
  },

  // Clear entire cart
  clear: {
    input: z.object({
      body: z
        .object({
          sessionId: z.string().optional(),
        })
        .optional(),
    }),
    output: detailedResponse(z.object({ success: z.boolean() })),
  },

  // Get cart totals
  getTotals: {
    input: z.object({}).optional(),
    output: detailedResponse(cartTotalsSchema),
  },

  // Merge guest cart to user cart (on login)
  merge: {
    input: z.object({
      body: z.object({
        sessionId: z.string().min(1),
      }),
    }),
    output: detailedResponse(cartWithItemsSchema),
  },
};

// Export types
export type CartLine = z.infer<typeof cartLineSelectSchema>;
export type Cart = z.infer<typeof cartSelectSchema>;
export type CartWithItems = z.infer<typeof cartWithItemsSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartTotals = z.infer<typeof cartTotalsSchema>;
