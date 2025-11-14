import { relations } from 'drizzle-orm'
import { pgEnum } from 'drizzle-orm/pg-core'
import { pgTable, text, timestamp, boolean, numeric, integer, bigint, decimal } from 'drizzle-orm/pg-core'

// -----------------------------------------------------
// ENUMS
// -----------------------------------------------------

export const discountTypeEnum = pgEnum('discount_type', ['flat', 'percent'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded'])
export const paymentProviderEnum = pgEnum('payment_provider', ['stripe', 'razorpay', 'paypal', 'cod'])
export const shipmentStatusEnum = pgEnum('shipment_status', ['pending', 'in_transit', 'delivered'])
export const displayTypeEnum = pgEnum('display_type', ['grid', 'carousel', 'banner', 'list', 'featured'])
export const visibilityEnum = pgEnum('visibility', ['public', 'private', 'hidden'])

// -----------------------------------------------------
// AUTH + USER
// -----------------------------------------------------
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
// -----------------------------------------------------
// CATALOG (Category, Subcategory, Series, Attributes)
// -----------------------------------------------------
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
// -----------------------------------------------------
// PRODUCT + VARIANTS
// -----------------------------------------------------
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

// -----------------------------------------------------
// CART + ORDER + PAYMENT + SHIPMENT
// -----------------------------------------------------
export const cart = pgTable('cart', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  status: text('status').$type<'active' | 'ordered' | 'abandoned'>().default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const cartItem = pgTable('cart_item', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').references(() => cart.id),
  productId: text('product_id').references(() => product.id),
  variantId: text('variant_id').references(() => productVariant.id),
  quantity: integer('quantity').default(1),
  priceAtAdd: numeric('price_at_add', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const order = pgTable('order', {
  id: text('id').primaryKey(),
  userId: text('user_id').$type<string>(),
  status: orderStatusEnum('status').default('pending').notNull(),
  total: numeric('total', { precision: 10, scale: 2 }),
  currency: text('currency').default('INR'),
  paymentId: text('payment_id').$type<string>(),
  addressId: text('address_id').$type<string>(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orderItem = pgTable('order_item', {
  id: text('id').primaryKey(),
  orderId: text('order_id').$type<string>(),
  productId: text('product_id').$type<string>(),
  variantId: text('variant_id').$type<string>(),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const payment = pgTable('payment', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => order.id),
  provider: paymentProviderEnum('provider').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const shipment = pgTable('shipment', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => order.id),
  carrier: text('carrier'),
  trackingNumber: text('tracking_number'),
  status: shipmentStatusEnum('status').default('pending').notNull(),
  estimatedDelivery: timestamp('estimated_delivery'),
  createdAt: timestamp('created_at').defaultNow(),
})
// -----------------------------------------------------
// CUSTOMER (Address, Wishlist, Review)
// -----------------------------------------------------

export const address = pgTable('address', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type', { enum: ['home', 'work', 'other'] })
    .default('home')
    .notNull(),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  landmark: text('landmark'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  isDefault: boolean('is_default').default(false),
  country: text('country').default('IN'),
  zoneId: text('zone_id').references(() => deliveryZones.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const wishlist = pgTable('wishlist', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow(),
})

export const wishlistItem = pgTable('wishlist_item', {
  id: text('id').primaryKey(),
  wishlistId: text('wishlist_id').references(() => wishlist.id),
  productId: text('product_id').references(() => product.id),
  variantId: text('variant_id').references(() => productVariant.id),
  createdAt: timestamp('created_at').defaultNow(),
})

export const review = pgTable('review', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id),
  productId: text('product_id').references(() => product.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
})

// -----------------------------------------------------
// OPERATIONS (Warehouse, Inventory, Zones, Discount)
// -----------------------------------------------------

export const deliveryZones = pgTable('delivery_zones', {
  id: text('id').primaryKey(),
  postalCode: text('postal_code').notNull().unique(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  isServiceable: boolean('is_serviceable').default(true),
  deliveryDays: integer('delivery_days').default(3),
  freeDeliveryThreshold: decimal('free_delivery_threshold', { precision: 10, scale: 2 }).default('500.00'),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).default('50.00'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
export const discount = pgTable('discount', {
  id: text('id').primaryKey(),
  code: text('code').unique(),
  type: discountTypeEnum('type').notNull(),
  value: numeric('value', { precision: 10, scale: 2 }),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
})

export const warehouse = pgTable('warehouse', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariant.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id')
    .notNull()
    .references(() => warehouse.id, { onDelete: 'cascade' }),

  quantity: integer('quantity').notNull().default(0),
  reserved: integer('reserved').notNull().default(0),

  updatedAt: timestamp('updated_at').defaultNow(),
})

// -----------------------------------------------------
// RELATIONS (all)
// -----------------------------------------------------

export const productRelations = relations(product, ({ one, many }) => ({
  series: one(series, {
    fields: [product.seriesSlug],
    references: [series.slug],
  }),
  variants: many(productVariant),
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

export const attributeRelations = relations(attribute, ({ one }) => ({
  series: one(series, {
    fields: [attribute.seriesSlug],
    references: [series.slug],
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
