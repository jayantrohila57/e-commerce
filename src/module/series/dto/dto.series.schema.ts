import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { subcategory } from '@/core/db/schema'

export const series = pgTable('series', {
  id: text('id').primaryKey(),
  subcategoryId: text('subcategory_id')
    .notNull()
    .references(() => subcategory.id),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  image: text('image'),
  attributes: jsonb('attributes').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const seriesRelations = relations(series, ({ one }) => ({
  subcategory: one(subcategory, {
    fields: [series.subcategoryId],
    references: [subcategory.id],
  }),
}))

export type Series = typeof series.$inferSelect
export type NewSeries = typeof series.$inferInsert
