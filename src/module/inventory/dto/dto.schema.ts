import { productVariant } from '@/core/db/schema'
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const warehouse = pgTable('warehouse', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariant.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id')
    .notNull()
    .references(() => warehouse.id, { onDelete: 'cascade' }),

  quantity: integer('quantity').notNull().default(0),
  reserved: integer('reserved').notNull().default(0),

  updatedAt: timestamp('updated_at').defaultNow(),
})
