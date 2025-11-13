import { order, shipmentStatusEnum } from '@/core/db/schema'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const shipment = pgTable('shipment', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => order.id),
  carrier: text('carrier'),
  trackingNumber: text('tracking_number'),
  status: shipmentStatusEnum('status').default('pending').notNull(),
  estimatedDelivery: timestamp('estimated_delivery'),
  createdAt: timestamp('created_at').defaultNow(),
})
