import { relations } from 'drizzle-orm'
import { json, pgEnum } from 'drizzle-orm/pg-core'
import { pgTable, text, timestamp, boolean, numeric, integer, bigint, decimal } from 'drizzle-orm/pg-core'

export const discountTypeEnum = pgEnum('discount_type', ['flat', 'percent'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded'])
export const paymentProviderEnum = pgEnum('payment_provider', ['stripe', 'razorpay', 'paypal', 'cod'])
export const shipmentStatusEnum = pgEnum('shipment_status', ['pending', 'in_transit', 'delivered'])
export const displayTypeEnum = pgEnum('display_type', ['grid', 'carousel', 'banner', 'list', 'featured'])
export const visibilityEnum = pgEnum('visibility', ['public', 'private', 'hidden'])

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
})
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
})
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const twoFactor = pgTable('two_factor', {
  id: text('id').primaryKey(),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const passkey = pgTable('passkey', {
  id: text('id').primaryKey(),
  name: text('name'),
  publicKey: text('public_key').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  credentialID: text('credential_id').notNull(),
  counter: integer('counter').notNull(),
  deviceType: text('device_type').notNull(),
  backedUp: boolean('backed_up').notNull(),
  transports: text('transports'),
  createdAt: timestamp('created_at'),
  aaguid: text('aaguid'),
})

export const rateLimit = pgTable('rate_limit', {
  id: text('id').primaryKey(),
  key: text('key'),
  count: integer('count'),
  lastRequest: bigint('last_request', { mode: 'number' }),
})

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

export const attribute = pgTable('attribute', {
  id: text('id').primaryKey(),
  seriesSlug: text('series_slug')
    .notNull()
    .references(() => series.slug),
  slug: text('slug').notNull().unique(),
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

export const media = pgTable('media', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  alt: text('alt'),
  type: text('type').$type<'image' | 'video' | 'model' | 'file'>().default('image'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const product = pgTable('product', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  slug: text('slug').notNull().unique(),
  categorySlug: text('category_slug')
    .notNull()
    .references(() => category.slug),
  subcategorySlug: text('subcategory_slug')
    .notNull()
    .references(() => subcategory.slug),
  seriesSlug: text('series_slug')
    .notNull()
    .references(() => series.slug),
  basePrice: integer('base_price').notNull(),
  baseCurrency: text('base_currency').default('INR'),
  features: json('features').$type<{ title: string }[]>(),
  isActive: boolean('is_active').default(true),
  status: text('status').$type<'draft' | 'archive' | 'live'>().default('draft').notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const productVariant = pgTable('product_variant', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  productId: text('product_id')
    .notNull()
    .references(() => product.id),
  title: text('title').notNull(),
  priceModifierType: text('price_modifier_type')
    .$type<'flat_increase' | 'flat_decrease' | 'percent_increase' | 'percent_decrease'>()
    .notNull(),
  priceModifierValue: numeric('price_modifier_value', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const productVariantAttribute = pgTable('product_variant_attribute', {
  id: text('id').primaryKey(),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariant.id),
  attributeId: text('attribute_id')
    .notNull()
    .references(() => attribute.id),
  createdAt: timestamp('created_at').defaultNow(),
})

export const productVariantMedia = pgTable('product_variant_media', {
  id: text('id').primaryKey(),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariant.id),
  mediaId: text('media_id')
    .notNull()
    .references(() => media.id),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const attributeRelations = relations(attribute, ({ one }) => ({
  series: one(series, {
    fields: [attribute.seriesSlug],
    references: [series.slug],
  }),
}))

export const productRelations = relations(product, ({ many }) => ({
  variants: many(productVariant),
}))

export const productVariantRelations = relations(productVariant, ({ one, many }) => ({
  product: one(product, {
    fields: [productVariant.productId],
    references: [product.id],
  }),

  attributes: many(productVariantAttribute),
  media: many(productVariantMedia),
}))

export const productVariantAttributeRelations = relations(productVariantAttribute, ({ one }) => ({
  variant: one(productVariant, {
    fields: [productVariantAttribute.variantId],
    references: [productVariant.id],
  }),
  attribute: one(attribute, {
    fields: [productVariantAttribute.attributeId],
    references: [attribute.id],
  }),
}))

export const productVariantMediaRelations = relations(productVariantMedia, ({ one }) => ({
  variant: one(productVariant, {
    fields: [productVariantMedia.variantId],
    references: [productVariant.id],
  }),

  media: one(media, {
    fields: [productVariantMedia.mediaId],
    references: [media.id],
  }),
}))
export const mediaRelations = relations(media, ({ many }) => ({
  variants: many(productVariantMedia),
}))

export const categoryRelations = relations(category, ({ many }) => ({
  subcategories: many(subcategory),
}))

export const subcategoryRelations = relations(subcategory, ({ one, many }) => ({
  category: one(category, {
    fields: [subcategory.categorySlug],
    references: [category.slug],
  }),
  series: many(series),
}))

export const seriesRelations = relations(series, ({ one, many }) => ({
  subcategory: one(subcategory, {
    fields: [series.subcategorySlug],
    references: [subcategory.slug],
  }),
  attributes: many(attribute),
  products: many(product),
}))
