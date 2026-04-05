import { z } from "zod/v3";
import { detailedResponse, offsetPaginationSchema } from "@/shared/schema";

export const baseReviewSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  isApproved: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
});

export const reviewSelectSchema = baseReviewSchema;

export const reviewInsertSchema = z.object({
  productId: z.string().min(1),
  orderItemId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().min(10).max(2000),
  images: z.array(z.object({ url: z.string().url() })).default([]),
});

export const reviewContract = {
  create: {
    input: z.object({
      body: reviewInsertSchema,
    }),
    output: detailedResponse(reviewSelectSchema),
  },
  getMany: {
    input: z.object({
      query: offsetPaginationSchema.extend({
        productId: z.string().optional(),
        userId: z.string().optional(),
        isApproved: z.boolean().optional(),
      }),
    }),
    output: detailedResponse(z.array(reviewSelectSchema)),
  },
  getManyAdmin: {
    input: z.object({
      query: offsetPaginationSchema.extend({
        productId: z.string().optional(),
        userId: z.string().optional(),
        isApproved: z.boolean().optional(),
        minRating: z.number().min(1).max(5).optional(),
        maxRating: z.number().min(1).max(5).optional(),
      }),
    }),
    output: detailedResponse(z.array(reviewSelectSchema)),
  },
  updateApproval: {
    input: z.object({
      params: z.object({ id: z.string().min(1) }),
      body: z.object({
        isApproved: z.boolean(),
      }),
    }),
    output: detailedResponse(reviewSelectSchema),
  },
};
