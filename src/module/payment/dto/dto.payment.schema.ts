import { order, paymentProviderEnum, paymentStatusEnum } from '@/core/db/schema'
import { pgTable, text, numeric, timestamp } from 'drizzle-orm/pg-core'

export const payment = pgTable('payment', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => order.id),
  provider: paymentProviderEnum('provider').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow(),
})
