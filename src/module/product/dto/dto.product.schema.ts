import { category } from '@/core/db/schema'
import { pgTable, text, integer, numeric, boolean, timestamp } from 'drizzle-orm/pg-core'

export const product = pgTable('product', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  brand: text('brand'),
  categoryId: text('category_id').references(() => category.id),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('INR'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const productVariant = pgTable('product_variant', {
  id: text('id').primaryKey(),
  productId: text('product_id').references(() => product.id),
  sku: text('sku').unique().notNull(),
  color: text('color'),
  size: text('size'),
  stock: integer('stock').default(0),
  price: numeric('price', { precision: 10, scale: 2 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const productImage = pgTable('product_image', {
  id: text('id').primaryKey(),
  productId: text('product_id').references(() => product.id),
  url: text('url').notNull(),
  alt: text('alt'),
  position: integer('position').default(0),
})

export const productAttribute = pgTable('product_attribute', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type'),
})

export const productAttributeValue = pgTable('product_attribute_value', {
  id: text('id').primaryKey(),
  productId: text('product_id').references(() => product.id),
  attributeId: text('attribute_id').references(() => productAttribute.id),
  value: text('value'),
})
