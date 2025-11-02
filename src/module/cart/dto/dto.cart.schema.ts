import { product, productVariant, user } from '@/core/db/schema'
import { pgTable, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core'

export const cart = pgTable('cart', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  status: text('status').$type<'active' | 'ordered' | 'abandoned'>().default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const cartItem = pgTable('cart_item', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').references(() => cart.id),
  productId: text('product_id').references(() => product.id),
  variantId: text('variant_id').references(() => productVariant.id),
  quantity: integer('quantity').default(1),
  priceAtAdd: numeric('price_at_add', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
