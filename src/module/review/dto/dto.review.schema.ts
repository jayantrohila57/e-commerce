import { user, product } from '@/core/db/schema'
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const review = pgTable('review', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  productId: text('product_id').references(() => product.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
})
