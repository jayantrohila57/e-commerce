import z from 'zod'

export const baseFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  sort: z
    .object({
      column: z.string(),
      order: z.enum(['asc', 'desc']),
    })
    .optional(),
  filters: z.object({}).optional(),
})

export const baseResponse = z.object({
  status: z.enum(['success', 'error', 'failed']),
  message: z.string(),
  data: z.unknown(),
})

export const updateBaseSchema = z.object({
  id: z.number(),
  data: z.object({}),
})
