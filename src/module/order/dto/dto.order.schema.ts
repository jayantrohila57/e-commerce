import { pgTable, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core'
import type { InferSelectModel } from 'drizzle-orm'
import { orderStatusEnum } from '@/core/db/schema'

type User = { id: string }
type Payment = { id: string }
type Address = { id: string }
type Product = { id: string }
type ProductVariant = { id: string }

export const order = pgTable('order', {
  id: text('id').primaryKey(),
  userId: text('user_id').$type<string>(),
  status: orderStatusEnum('status').default('pending').notNull(),
  total: numeric('total', { precision: 10, scale: 2 }),
  currency: text('currency').default('INR'),
  paymentId: text('payment_id').$type<string>(),
  addressId: text('address_id').$type<string>(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orderItem = pgTable('order_item', {
  id: text('id').primaryKey(),
  orderId: text('order_id').$type<string>(),
  productId: text('product_id').$type<string>(),
  variantId: text('variant_id').$type<string>(),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export type Order = InferSelectModel<typeof order> & {
  user?: User
  payment?: Payment
  address?: Address
  items?: OrderItem[]
}

export type OrderItem = InferSelectModel<typeof orderItem> & {
  product?: Product
  variant?: ProductVariant
}
