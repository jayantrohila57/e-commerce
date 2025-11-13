import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { series } from '@/core/db/schema'

export const attribute = pgTable('attribute', {
  id: text('id').primaryKey(),
  seriesSlug: text('series_slug')
    .notNull()
    .references(() => series.slug),
  key: text('key').notNull(), // e.g. "size", "color", "material"
  value: text('value').notNull(), // e.g. "XL", "Red", "Cotton"
  type: text('type').default('text').notNull(), // e.g. "text", "number", "boolean", "select"
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
