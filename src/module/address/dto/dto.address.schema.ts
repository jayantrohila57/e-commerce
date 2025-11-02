import { user } from '@/core/db/schema'

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const address = pgTable('address', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  label: text('label'),
  fullName: text('full_name'),
  phone: text('phone'),
  line1: text('line1'),
  line2: text('line2'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postal_code'),
  country: text('country').default('IN'),
  createdAt: timestamp('created_at').defaultNow(),
})
