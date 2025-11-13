import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { Many, relations } from 'drizzle-orm'

import { displayTypeEnum, visibilityEnum } from '@/core/db/schema.enum'
import { attribute, product, subcategory } from '@/core/db/schema'

export const series = pgTable('series', {
  id: text('id').primaryKey(),
  subcategorySlug: text('subcategory_slug')
    .notNull()
    .references(() => subcategory.slug),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  title: text('title').notNull(),
  description: text('description'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  displayType: displayTypeEnum('display_type').default('grid').notNull(),
  color: text('color').default('#FFFFFF'),
  visibility: visibilityEnum('visibility').default('public').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  image: text('image'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

 
export const seriesRelations = relations(series, ({ one, many }) => ({
  subcategory: one(subcategory, {
    fields: [series.subcategorySlug],
    references: [subcategory.slug],
  }),
  attributes: many(attribute),
  products: many(product),
}));

export type Series = typeof series.$inferSelect
export type NewSeries = typeof series.$inferInsert
