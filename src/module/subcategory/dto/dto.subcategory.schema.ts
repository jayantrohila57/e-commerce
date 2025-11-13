import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { category, series } from '@/core/db/schema'
import { displayTypeEnum, visibilityEnum } from '@/core/db/schema.enum'

export const subcategory = pgTable('subcategory', {
  id: text('id').primaryKey(),
  categorySlug: text('category_slug')
    .notNull()
    .references(() => category.slug),
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

export const subcategoryRelations = relations(subcategory, ({ one, many }) => ({
  category: one(category, {
    fields: [subcategory.categorySlug],
    references: [category.slug],
  }),
  series: many(series),
}))

export type Subcategory = typeof subcategory.$inferSelect
export type NewSubcategory = typeof subcategory.$inferInsert
