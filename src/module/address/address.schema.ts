import { z } from "zod/v3";
import { detailedResponse, paginationInput } from "@/shared/schema";

export const addressTypeEnum = z.enum(["billing", "shipping"]);

export const addressBaseSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: addressTypeEnum,
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().nullable().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const addressSelectSchema = addressBaseSchema;

export const addressInsertSchema = addressBaseSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const addressUpdateSchema = addressInsertSchema.partial();

export const addressContract = {
  getMany: {
    input: z
      .object({
        query: paginationInput.optional(),
      })
      .optional(),
    output: detailedResponse(z.array(addressSelectSchema)),
  },
  create: {
    input: z.object({
      body: addressInsertSchema,
    }),
    output: detailedResponse(addressSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
      body: addressUpdateSchema,
    }),
    output: detailedResponse(addressSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
    }),
    output: detailedResponse(z.object({ id: z.string() })),
  },
  setDefault: {
    input: z.object({
      params: z.object({
        id: z.string().min(1),
      }),
    }),
    output: detailedResponse(addressSelectSchema),
  },
};

export type Address = z.infer<typeof addressSelectSchema>;
export type AddressInsert = z.infer<typeof addressInsertSchema>;
export type AddressUpdate = z.infer<typeof addressUpdateSchema>;
