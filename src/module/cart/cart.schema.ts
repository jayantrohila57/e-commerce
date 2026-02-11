import z from 'zod/v3'

const detailedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.enum(['success', 'error', 'failed']).default('success'),
    message: z.string(),
    data: dataSchema.nullable(),
    meta: z
      .object({
        timestamp: z.date().default(() => new Date()),
        version: z.string().default('1.0.0'),
        count: z.number().optional(),
      })
      .optional(),
  })

export const cartLineBase = z.object({
  id: z.string().min(1),
  cartId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().min(1),
  price: z.number().min(0),
})

export const cartAddInput = z.object({
  body: z.object({ variantId: z.string().min(1), quantity: z.number().min(1).default(1) }),
})

export const cartRemoveInput = z.object({
  params: z.object({ id: z.string().optional(), variantId: z.string().optional() }),
})

export const cartContract = {
  getUserCart: {
    input: z.object({
      query: z
        .object({ limit: z.number().min(1).max(200).default(100), offset: z.number().min(0).default(0) })
        .optional(),
    }),
    output: detailedResponse(z.array(cartLineBase)),
  },
  addItem: {
    input: cartAddInput,
    output: detailedResponse(cartLineBase),
  },
  removeItem: {
    input: cartRemoveInput,
    output: detailedResponse(cartLineBase.nullable()),
  },
}

export type CartLineBase = z.infer<typeof cartLineBase>
