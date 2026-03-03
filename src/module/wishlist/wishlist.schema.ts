import { z } from "zod/v3";
import { detailedResponse } from "@/shared/schema";

export const wishlistBaseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  variantId: z.string().min(1),
});

export const wishlistSelectSchema = wishlistBaseSchema.extend({
  variant: z
    .object({
      id: z.string(),
      title: z.string(),
      product: z.object({
        id: z.string(),
        title: z.string(),
        baseImage: z.string().nullable().optional(),
      }),
    })
    .optional(),
});

export const wishlistContract = {
  get: {
    input: z.object({}).optional(),
    output: detailedResponse(z.array(wishlistSelectSchema)),
  },
  add: {
    input: z.object({
      body: z.object({
        variantId: z.string().min(1),
      }),
    }),
    output: detailedResponse(wishlistBaseSchema),
  },
  remove: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
    }),
    output: detailedResponse(z.object({ id: z.string() })),
  },
};

export type Wishlist = z.infer<typeof wishlistSelectSchema>;
