import { z } from 'zod/v3'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { address } from './dto.address.schema'
import type { InferSelectModel } from 'drizzle-orm'

// Base schemas
export const addressSelectSchema = createSelectSchema(address)
export type AddressSelect = InferSelectModel<typeof address>

// Type for address type enum
export const ADDRESS_TYPES = ['home', 'work', 'other'] as const
export type AddressType = (typeof ADDRESS_TYPES)[number]

// Insert schema
export const addressInsertSchema = createInsertSchema(address, {
  type: () => z.enum(ADDRESS_TYPES).default('home'),
  isDefault: () => z.boolean().default(false),
  country: () => z.string().default('IN'),
  zoneId: () => z.string().uuid().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type AddressInsert = z.infer<typeof addressInsertSchema>

// Update schema
export const addressUpdateSchema = createUpdateSchema(address, {
  type: () => z.enum(ADDRESS_TYPES).optional(),
  isDefault: () => z.boolean().optional(),
  country: () => z.string().optional(),
  zoneId: () => z.string().uuid().optional().nullable(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})

export type AddressUpdate = z.infer<typeof addressUpdateSchema>

// Additional schemas for specific validations
export const addressTypeSchema = z.enum(ADDRESS_TYPES)
export type AddressTypeEnum = z.infer<typeof addressTypeSchema>

export const addressSearchSchema = z.object({
  userId: z.string().uuid().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  isDefault: z.boolean().optional(),
  type: addressTypeSchema.optional(),
})

export type AddressSearch = z.infer<typeof addressSearchSchema>

export const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(['success', 'error', 'failed']).default('success'),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        timestamp: z.date().default(() => new Date()),
        version: z.string().default('1.0.0'),
      })
      .optional(),
  })

export const addressContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(addressSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: addressSearchSchema,
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      z.object({
        data: z.array(addressSelectSchema),
        total: z.number(),
        limit: z.number(),
        offset: z.number(),
      }),
    ),
  },
  getUserAddresses: {
    input: z.object({
      params: z.object({ userId: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(addressSelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: addressInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(addressSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: addressUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(addressSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      addressSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
