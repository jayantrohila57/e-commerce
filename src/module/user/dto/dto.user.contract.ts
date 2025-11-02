import z from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { oc } from '@orpc/contract'
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
  get: oc
    .route({
      summary: 'Get a user by ID or other filter',
      description: 'Get a user by ID or other filter',
      path: '/user/get',
      method: 'GET',
      tags: ['User'],
      inputStructure: 'detailed',
      outputStructure: 'compact',
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        query: z.object().optional(),
        body: z.object().optional(),
        headers: z.object().optional(),
      }),
    )
    .output(detailedResponse(userSelectSchema.nullable())),
  getMany: oc
    .route({
      summary: 'Get many users',
      description: 'Get many users',
      path: '/user/getMany',
      method: 'GET',
      tags: ['User'],
      inputStructure: 'detailed',
    })
    .input(
      z.object({
        params: z.object().optional(),
        query: z.object().optional(),
        body: z.object({
          search: z.string().optional(),
          role: z.string().optional(),
          banned: z.boolean().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        }),
        headers: z.object().optional(),
      }),
    )

    .output(detailedResponse(z.array(userSelectSchema))),
  create: oc
    .route({
      summary: 'Create a new user',
      description: 'Create a new user',
      path: '/user/create',
      method: 'POST',
      tags: ['User'],
      inputStructure: 'detailed',
    })
    .input(
      z.object({
        params: z.object().optional(),
        query: z.object().optional(),
        body: userInsertSchema,
        headers: z.object().optional(),
      }),
    )
    .output(detailedResponse(userSelectSchema)),
  update: oc
    .route({
      summary: 'Update a user',
      description: 'Update a user',
      path: '/user/update',
      method: 'POST',
      tags: ['User'],
      inputStructure: 'detailed',
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        query: z.object().optional(),
        body: userUpdateSchema,
        headers: z.object().optional(),
      }),
    )
    .output(detailedResponse(userSelectSchema)),
  delete: oc
    .route({
      summary: 'Delete a user by ID',
      description: 'Delete a user by ID',
      path: '/user/delete',
      method: 'DELETE',
      tags: ['User'],
      inputStructure: 'detailed',
    })
    .input(
      z.object({
        params: z.object({ id: z.string() }),
        query: z.object().optional(),
        body: z.object().optional(),
        headers: z.object().optional(),
      }),
    )
    .output(
      detailedResponse(
        userSelectSchema
          .pick({
            id: true,
          })
          .nullable(),
      ),
    ),
}
