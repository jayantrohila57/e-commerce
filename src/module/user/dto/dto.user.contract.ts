import z from 'zod/v3'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { user } from './dto.user.schema'

const userSelectSchema = createSelectSchema(user)
const userInsertSchema = createInsertSchema(user)
const userUpdateSchema = createUpdateSchema(user)

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

export const userContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(userSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z
        .object({
          search: z.string().optional(),
          role: z.string().optional(),
          banned: z.boolean().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
        .optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(userSelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: userInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(userSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: userUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(userSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      userSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
