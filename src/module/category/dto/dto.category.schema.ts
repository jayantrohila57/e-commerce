import { pgTable, text, timestamp, pgEnum, integer, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { subcategory } from '@/core/db/schema'
import { displayTypeEnum, visibilityEnum } from '@/core/db/schema.enum'

export const category = pgTable('category', {
  id: text('id').primaryKey(),
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
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const categoryRelations = relations(category, ({ many }) => ({
  subcategories: many(subcategory),
}))

export type Category = typeof category.$inferSelect
export type NewCategory = typeof category.$inferInsert
