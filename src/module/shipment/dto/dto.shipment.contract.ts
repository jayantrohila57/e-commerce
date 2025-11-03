import z from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { shipment } from './dto.shipment.schema'

const shipmentSelectSchema = createSelectSchema(shipment)
const shipmentInsertSchema = createInsertSchema(shipment)
const shipmentUpdateSchema = createUpdateSchema(shipment)

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

export const shipmentContract = {
  get: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(shipmentSelectSchema.nullable()),
  },
  getMany: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: z.object({
        orderId: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(shipmentSelectSchema)),
  },
  getOrderShipments: {
    input: z.object({
      params: z.object({ orderId: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(z.array(shipmentSelectSchema)),
  },
  create: {
    input: z.object({
      params: z.object().optional(),
      query: z.object().optional(),
      body: shipmentInsertSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(shipmentSelectSchema),
  },
  update: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: shipmentUpdateSchema,
      headers: z.object().optional(),
    }),
    output: detailedResponse(shipmentSelectSchema),
  },
  updateTracking: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object({
        carrier: z.string().optional(),
        trackingNumber: z.string().optional(),
        status: z.string().optional(),
      }),
      headers: z.object().optional(),
    }),
    output: detailedResponse(shipmentSelectSchema),
  },
  delete: {
    input: z.object({
      params: z.object({ id: z.string() }),
      query: z.object().optional(),
      body: z.object().optional(),
      headers: z.object().optional(),
    }),
    output: detailedResponse(
      shipmentSelectSchema
        .pick({
          id: true,
        })
        .nullable(),
    ),
  },
}
