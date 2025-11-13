import { user } from '@/core/db/schema'

import { pgTable, text, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core'

export const address = pgTable('address', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type', { enum: ['home', 'work', 'other'] })
    .default('home')
    .notNull(),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  landmark: text('landmark'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  isDefault: boolean('is_default').default(false),
  country: text('country').default('IN'),
  zoneId: text('zone_id').references(() => deliveryZones.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const deliveryZones = pgTable('delivery_zones', {
  id: text('id').primaryKey(),
  postalCode: text('postal_code').notNull().unique(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  isServiceable: boolean('is_serviceable').default(true),
  deliveryDays: integer('delivery_days').default(3),
  freeDeliveryThreshold: decimal('free_delivery_threshold', { precision: 10, scale: 2 }).default('500.00'),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).default('50.00'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
