import { pgTable, text } from 'drizzle-orm/pg-core'

export const category = pgTable('category', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
})
