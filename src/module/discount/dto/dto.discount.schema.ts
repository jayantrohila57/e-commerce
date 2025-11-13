import { discountTypeEnum } from '@/core/db/schema'
import { pgTable, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core'

export const discount = pgTable('discount', {
  id: text('id').primaryKey(),
  code: text('code').unique(),
  type: discountTypeEnum('type').notNull(),
  value: numeric('value', { precision: 10, scale: 2 }),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
})
