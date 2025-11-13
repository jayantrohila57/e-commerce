import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { series } from '@/core/db/schema'

export const attribute = pgTable('attribute', {
  id: text('id').primaryKey(),
  seriesSlug: text('series_slug')
    .notNull()
    .references(() => series.slug),
  slug: text('slug').notNull(), 
  title: text('title').notNull(),  
  type: text('type').default('text').notNull(),
  value: text('value').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const attributeRelations = relations(attribute, ({ one }) => ({
  series: one(series, {
    fields: [attribute.seriesSlug],
    references: [series.slug],
  }),
}))


export type Attribute = typeof attribute.$inferSelect
export type NewAttribute = typeof attribute.$inferInsert
