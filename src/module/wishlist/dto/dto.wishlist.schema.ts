import { user, productVariant, product } from '@/core/db/schema'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const wishlist = pgTable('wishlist', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow(),
})

export const wishlistItem = pgTable('wishlist_item', {
  id: text('id').primaryKey(),
  wishlistId: text('wishlist_id').references(() => wishlist.id),
  productId: text('product_id').references(() => product.id),
  variantId: text('variant_id').references(() => productVariant.id),
  createdAt: timestamp('created_at').defaultNow(),
})
