import { detailedResponse } from '@/module/wishlist/wishlist.schema'
import z from 'zod/v3'

const base = z.object({
  id: z.string().min(1),
  userId: z.string().min(1).nullable(),
  // cartId removed — addresses are no longer tied directly to cart rows
  name: z.string().min(1),
  phone: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  isDefault: z.boolean().default(false),
  deletedAt: z.date().nullable().optional(),
  createdAt: z.date(),
})

const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})

export const shippingAddressSelectSchema = base

export const shippingAddressCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    isDefault: z.boolean().optional(),
  }),
})

export const shippingAddressUpdateSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    street: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    postalCode: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    isDefault: z.boolean().optional(),
  }),
})

export const shippingAddressDeleteSchema = z.object({ params: z.object({ id: z.string().min(1) }) })

export const shippingAddressContract = {
  getUserAddresses: {
    input: z.object({ query: paginationSchema.optional() }),
    output: detailedResponse(z.array(shippingAddressSelectSchema)),
  },
  create: {
    input: shippingAddressCreateSchema,
    output: detailedResponse(shippingAddressSelectSchema.nullable()),
  },
  get: {
    input: z.object({ params: z.object({ id: z.string().min(1) }) }),
    output: detailedResponse(shippingAddressSelectSchema.nullable()),
  },
  update: {
    input: shippingAddressUpdateSchema,
    output: detailedResponse(shippingAddressSelectSchema.nullable()),
  },
  delete: {
    input: shippingAddressDeleteSchema,
    output: detailedResponse(shippingAddressSelectSchema.nullable()),
  },
  setDefault: {
    input: z.object({ params: z.object({ id: z.string().min(1) }) }),
    output: detailedResponse(shippingAddressSelectSchema.nullable()),
  },
}

export type ShippingAddress = z.infer<typeof shippingAddressSelectSchema>

export default shippingAddressContract
