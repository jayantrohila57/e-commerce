import z from "zod/v3";

/**
 * Order Status Enum
 * Tracks the lifecycle of an order
 */
export const orderStatusEnum = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export type OrderStatus = z.infer<typeof orderStatusEnum>;

/**
 * Payment Status Enum
 * Tracks payment state for orders
 */
export const paymentStatusEnum = z.enum(["pending", "authorized", "paid", "failed", "refunded", "partially_refunded"]);

export type PaymentStatus = z.infer<typeof paymentStatusEnum>;

/**
 * Payment Provider Enum
 * Supported payment gateways
 */
export const paymentProviderEnum = z.enum([
  "stripe",
  "razorpay",
  "paypal",
  "cod", // Cash on Delivery
]);

export type PaymentProvider = z.infer<typeof paymentProviderEnum>;

/**
 * Shipment Status Enum
 * Tracks shipping/delivery state
 */
export const shipmentStatusEnum = z.enum([
  "pending",
  "label_created",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "exception",
  "returned",
]);

export type ShipmentStatus = z.infer<typeof shipmentStatusEnum>;

/**
 * Inventory Status Enum
 * Tracks stock availability
 */
export const inventoryStatusEnum = z.enum(["in_stock", "low_stock", "out_of_stock", "backorder", "discontinued"]);

export type InventoryStatus = z.infer<typeof inventoryStatusEnum>;

/**
 * Product Status Enum
 * Controls product visibility in storefront
 */
export const productStatusEnum = z.enum(["draft", "active", "archived", "discontinued"]);

export type ProductStatus = z.infer<typeof productStatusEnum>;

/**
 * Discount Type Enum
 * Types of discounts that can be applied
 */
export const discountTypeEnum = z.enum(["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"]);

export type DiscountType = z.infer<typeof discountTypeEnum>;

/**
 * User Role Enum
 * System access levels
 */
export const userRoleEnum = z.enum(["admin", "staff", "user", "customer"]);

export type UserRole = z.infer<typeof userRoleEnum>;

/**
 * Address Type Enum
 * Billing or shipping address
 */
export const addressTypeEnum = z.enum(["billing", "shipping"]);

export type AddressType = z.infer<typeof addressTypeEnum>;

/**
 * Visibility Enum
 * Controls entity visibility
 */
export const visibilityEnum = z.enum(["public", "private", "hidden"]);

export type Visibility = z.infer<typeof visibilityEnum>;

/**
 * Sort Order Enum
 * For list sorting direction
 */
export const sortOrderEnum = z.enum(["asc", "desc"]);

export type SortOrder = z.infer<typeof sortOrderEnum>;

/**
 * Image Type Enum
 * Types of product images
 */
export const imageTypeEnum = z.enum(["main", "thumbnail", "gallery", "variant"]);

export type ImageType = z.infer<typeof imageTypeEnum>;
