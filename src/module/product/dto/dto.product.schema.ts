import { series } from '@/core/db/schema'
import { relations } from 'drizzle-orm'
import { pgTable, text, integer, numeric, boolean, timestamp } from 'drizzle-orm/pg-core'

export const product = pgTable('product', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  slug: text('slug').notNull().unique(),
  seriesSlug: text('series_slug')
    .notNull()
    .references(() => series.slug),
  baseImage: text('base_image'),
  isActive: boolean('is_active').default(true),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const productVariant = pgTable('product_variant', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.id),
  sku: text('sku').unique().notNull(),
  stock: integer('stock').default(0),
  price: numeric('price', { precision: 10, scale: 2 }),
  isDefault: boolean('is_default').default(false),
  images: text('images'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const productImage = pgTable('product_image', {
  id: text('id').primaryKey(),
  productId: text('product_id').references(() => product.id),
  url: text('url').notNull(),
  alt: text('alt'),
  position: integer('position').default(0),
})

export const variantAttributeValue = pgTable('variant_attribute_value', {
  id: text('id').primaryKey(),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariant.id),
  key: text('key').notNull(),
  value: text('value').notNull(),
})

export const productRelations = relations(product, ({ one, many }) => ({
  series: one(series, {
    fields: [product.seriesSlug],
    references: [series.slug],
  }),
  variants: many(productVariant),
  images: many(productImage),
}))

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}))

export const productVariantRelations = relations(productVariant, ({ one, many }) => ({
  product: one(product, {
    fields: [productVariant.productId],
    references: [product.id],
  }),
  attributes: many(variantAttributeValue),
}))

export const variantAttributeRelations = relations(variantAttributeValue, ({ one }) => ({
  variant: one(productVariant, {
    fields: [variantAttributeValue.variantId],
    references: [productVariant.id],
  }),
}))
