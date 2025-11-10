import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { category, series } from '@/core/db/schema'

export const subcategory = pgTable('subcategory', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => category.id),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const subcategoryRelations = relations(subcategory, ({ one, many }) => ({
  category: one(category, {
    fields: [subcategory.categoryId],
    references: [category.id],
  }),
  series: many(series),
}))

export type Subcategory = typeof subcategory.$inferSelect
export type NewSubcategory = typeof subcategory.$inferInsert
