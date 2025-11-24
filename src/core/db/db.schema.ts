import { relations } from 'drizzle-orm'
import { bigint, boolean, index, integer, json, numeric, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const discountTypeEnum = pgEnum('discount_type', ['flat', 'percent'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded'])
export const paymentProviderEnum = pgEnum('payment_provider', ['stripe', 'razorpay', 'paypal', 'cod'])
export const shipmentStatusEnum = pgEnum('shipment_status', ['pending', 'in_transit', 'delivered'])
export const displayTypeEnum = pgEnum('display_type', ['grid', 'carousel', 'banner', 'list', 'featured'])
export const visibilityEnum = pgEnum('visibility', ['public', 'private', 'hidden'])
export const productStatusEnum = pgEnum('product_status', ['draft', 'archive', 'live'])

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

export const category = pgTable(
  'category',
  {
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
  },
  (table) => ({
    visibilityIdx: index('category_visibility_idx').on(table.visibility),
    isFeaturedIdx: index('category_is_featured_idx').on(table.isFeatured),
    displayOrderIdx: index('category_display_order_idx').on(table.displayOrder),
  }),
)

export const subcategory = pgTable(
  'subcategory',
  {
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
  },
  (table) => ({
    categorySlugIdx: index('subcategory_category_slug_idx').on(table.categorySlug),
    visibilityIdx: index('subcategory_visibility_idx').on(table.visibility),
    isFeaturedIdx: index('subcategory_is_featured_idx').on(table.isFeatured),
  }),
)
export const series = pgTable(
  'series',
  {
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
  },
  (table) => ({
    subcategorySlugIdx: index('series_subcategory_slug_idx').on(table.subcategorySlug),
    visibilityIdx: index('series_visibility_idx').on(table.visibility),
    isFeaturedIdx: index('series_is_featured_idx').on(table.isFeatured),
  }),
)

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

export const product = pgTable(
  'product',
  {
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
    baseImage: text('base_image'),
    features: json('features').$type<{ title: string }[]>(),
    isActive: boolean('is_active').default(true),
    status: productStatusEnum('status').default('draft').notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    categorySlugIdx: index('product_category_slug_idx').on(table.categorySlug),
    subcategorySlugIdx: index('product_subcategory_slug_idx').on(table.subcategorySlug),
    seriesSlugIdx: index('product_series_slug_idx').on(table.seriesSlug),
    statusIdx: index('product_status_idx').on(table.status),
    isActiveIdx: index('product_is_active_idx').on(table.isActive),
  }),
)

export const productVariant = pgTable(
  'product_variant',
  {
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
    attributes: json('attributes').$type<{ title: string; type: string; value: string }[]>(),
    media: json('media').$type<{ url: string }[]>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    productIdIdx: index('product_variant_product_id_idx').on(table.productId),
  }),
)

export const inventoryItem = pgTable('inventory_item', {
  id: text('id').primaryKey(),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariant.id),
  sku: text('sku').notNull().unique(),
  barcode: text('barcode'),
  quantity: integer('quantity').notNull().default(0),
  incoming: integer('incoming').notNull().default(0),
  reserved: integer('reserved').notNull().default(0),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const inventoryReservation = pgTable('inventory_reservation', {
  id: text('id').primaryKey(),
  inventoryId: text('inventory_id')
    .notNull()
    .references(() => inventoryItem.id),
  userId: text('user_id'),
  quantity: integer('quantity').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const cart = pgTable('cart', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  sessionId: text('session_id'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const cartLine = pgTable('cart_line', {
  id: text('id').primaryKey(),
  cartId: text('cart_id')
    .notNull()
    .references(() => cart.id),
  variantId: text('variant_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price_snapshot').notNull(),
})

export const wishlist = pgTable('wishlist', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  variantId: text('variant_id').notNull(),
})

/////////////////////////////////////////////////

export const attributeRelations = relations(attribute, ({ one }) => ({
  series: one(series, {
    fields: [attribute.seriesSlug],
    references: [series.slug],
  }),
}))

export const productRelations = relations(product, ({ many }) => ({
  variants: many(productVariant),
}))
export const productVariantRelations = relations(productVariant, ({ one }) => ({
  product: one(product, {
    fields: [productVariant.productId],
    references: [product.id],
  }),
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

export const inventoryItemRelations = relations(inventoryItem, ({ one, many }) => ({
  variant: one(productVariant, {
    fields: [inventoryItem.variantId],
    references: [productVariant.id],
  }),
  reservations: many(inventoryReservation),
}))

export const inventoryReservationRelations = relations(inventoryReservation, ({ one }) => ({
  inventory: one(inventoryItem, {
    fields: [inventoryReservation.inventoryId],
    references: [inventoryItem.id],
  }),
}))

export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(user, {
    fields: [cart.userId],
    references: [user.id],
  }),
  lines: many(cartLine),
}))

export const cartLineRelations = relations(cartLine, ({ one }) => ({
  cart: one(cart, {
    fields: [cartLine.cartId],
    references: [cart.id],
  }),
  variant: one(productVariant, {
    fields: [cartLine.variantId],
    references: [productVariant.id],
  }),
}))

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(user, {
    fields: [wishlist.userId],
    references: [user.id],
  }),
  variant: one(productVariant, {
    fields: [wishlist.variantId],
    references: [productVariant.id],
  }),
}))

export const productVariantFullRelations = relations(productVariant, ({ one, many }) => ({
  product: one(product, {
    fields: [productVariant.productId],
    references: [product.id],
  }),
  inventory: one(inventoryItem, {
    fields: [productVariant.id],
    references: [inventoryItem.variantId],
  }),
  cartLines: many(cartLine),
  wishlists: many(wishlist),
}))
