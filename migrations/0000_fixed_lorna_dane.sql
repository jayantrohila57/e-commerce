CREATE TYPE "public"."address_type" AS ENUM('billing', 'shipping');--> statement-breakpoint
CREATE TYPE "public"."audit_actor_type" AS ENUM('user', 'system');--> statement-breakpoint
CREATE TYPE "public"."cart_abandonment_event_type" AS ENUM('created', 'updated', 'abandoned', 'recovered', 'notified');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('flat', 'percent');--> statement-breakpoint
CREATE TYPE "public"."display_type" AS ENUM('grid', 'carousel', 'banner', 'list', 'featured');--> statement-breakpoint
CREATE TYPE "public"."inventory_adjustment_type" AS ENUM('manual', 'order', 'restock', 'return', 'damaged', 'correction');--> statement-breakpoint
CREATE TYPE "public"."loyalty_point_transaction_type" AS ENUM('earn', 'redeem', 'adjust', 'expire', 'reversal');--> statement-breakpoint
CREATE TYPE "public"."marketing_content_page" AS ENUM('home', 'store', 'store_category', 'store_subcategory', 'product', 'checkout', 'about', 'newsletter', 'support');--> statement-breakpoint
CREATE TYPE "public"."marketing_content_section" AS ENUM('promo_banner', 'cta', 'offer_banner', 'crousel', 'split_banner', 'announcement_bar', 'feature_highlight');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'shipped', 'delivered', 'returned', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'razorpay', 'paypal', 'cod');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."product_relation_type" AS ENUM('related', 'cross_sell', 'upsell');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'archive', 'live');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('pending', 'processed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('pending', 'label_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private', 'hidden');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "address" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "address_type" NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "analytics_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"anonymous_id" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"ip_hash" text,
	"user_agent" text,
	"referrer" text,
	"landing_page" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attribute" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"type" text DEFAULT 'text' NOT NULL,
	"value" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "attribute_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_type" "audit_actor_type" DEFAULT 'system' NOT NULL,
	"actor_user_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"request_id" text,
	"before" jsonb,
	"after" jsonb,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_id" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart_abandonment" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"user_id" text,
	"session_id" text,
	"abandoned_at" timestamp with time zone,
	"recovered_at" timestamp with time zone,
	"last_notified_at" timestamp with time zone,
	"notification_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "cart_abandonment_cart_id_unique" UNIQUE("cart_id")
);
--> statement-breakpoint
CREATE TABLE "cart_abandonment_event" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"user_id" text,
	"session_id" text,
	"type" "cart_abandonment_event_type" NOT NULL,
	"channel" text,
	"email" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_line" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"variant_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"price_snapshot" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"title" text NOT NULL,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"display_type" "display_type" DEFAULT 'grid' NOT NULL,
	"color" text DEFAULT '#FFFFFF',
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"image" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "discount" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type" "discount_type" NOT NULL,
	"value" integer NOT NULL,
	"min_order_amount" integer DEFAULT 0,
	"max_uses" integer,
	"used_count" integer DEFAULT 0,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "discount_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "discount_usage_event" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"discount_id" text NOT NULL,
	"order_discount_id" text,
	"user_id" text,
	"currency" text DEFAULT 'INR' NOT NULL,
	"applied_amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_adjustment_event" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "inventory_adjustment_type" DEFAULT 'manual' NOT NULL,
	"inventory_id" text NOT NULL,
	"warehouse_id" text,
	"variant_id" text,
	"quantity_before" integer,
	"quantity_delta" integer DEFAULT 0 NOT NULL,
	"quantity_after" integer,
	"incoming_before" integer,
	"incoming_delta" integer DEFAULT 0 NOT NULL,
	"incoming_after" integer,
	"reserved_before" integer,
	"reserved_delta" integer DEFAULT 0 NOT NULL,
	"reserved_after" integer,
	"order_id" text,
	"refund_id" text,
	"reason" text,
	"adjusted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" text PRIMARY KEY NOT NULL,
	"variant_id" text NOT NULL,
	"warehouse_id" text,
	"sku" text NOT NULL,
	"barcode" text,
	"quantity" integer DEFAULT 0 NOT NULL,
	"incoming" integer DEFAULT 0 NOT NULL,
	"reserved" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory_reservation" (
	"id" text PRIMARY KEY NOT NULL,
	"inventory_id" text NOT NULL,
	"warehouse_id" text,
	"user_id" text,
	"quantity" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loyalty_account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tier_id" text,
	"points_balance" integer DEFAULT 0 NOT NULL,
	"locked_points" integer DEFAULT 0 NOT NULL,
	"lifetime_points_earned" integer DEFAULT 0 NOT NULL,
	"lifetime_points_redeemed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "loyalty_account_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "loyalty_point_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"type" "loyalty_point_transaction_type" NOT NULL,
	"points" integer NOT NULL,
	"order_id" text,
	"order_item_id" text,
	"refund_id" text,
	"currency" text DEFAULT 'INR' NOT NULL,
	"base_amount" integer,
	"rate_applied" numeric(10, 6),
	"expires_at" timestamp with time zone,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_tier" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"min_lifetime_points" integer DEFAULT 0 NOT NULL,
	"earn_multiplier" numeric(6, 4) DEFAULT '1.0000' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "loyalty_tier_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "marketing_content" (
	"id" text PRIMARY KEY NOT NULL,
	"page" "marketing_content_page" NOT NULL,
	"section" "marketing_content_section" NOT NULL,
	"title" text,
	"body_text" text,
	"image" text,
	"cta_label" text,
	"cta_link" text,
	"product_link" text,
	"items" jsonb,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"type" text DEFAULT 'image',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"subtotal" integer NOT NULL,
	"discount_total" integer DEFAULT 0 NOT NULL,
	"tax_total" integer DEFAULT 0 NOT NULL,
	"shipping_total" integer DEFAULT 0 NOT NULL,
	"grand_total" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"shipping_provider_id" text,
	"shipping_method_id" text,
	"shipping_zone_id" text,
	"warehouse_id" text,
	"shipping_address" json NOT NULL,
	"billing_address" json,
	"notes" text,
	"placed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_discount" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"discount_id" text NOT NULL,
	"applied_amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"variant_id" text NOT NULL,
	"product_title" text NOT NULL,
	"variant_title" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"total_price" integer NOT NULL,
	"attributes" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"from_status" "order_status",
	"to_status" "order_status" NOT NULL,
	"changed_by" text,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp with time zone,
	"aaguid" text
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"provider_payment_id" text,
	"provider_metadata" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_change_event" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text,
	"variant_id" text,
	"currency" text DEFAULT 'INR' NOT NULL,
	"old_price" integer NOT NULL,
	"new_price" integer NOT NULL,
	"changed_by" text,
	"reason" text,
	"effective_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"slug" text NOT NULL,
	"category_slug" text NOT NULL,
	"subcategory_slug" text NOT NULL,
	"tax_class_id" text,
	"base_price" integer NOT NULL,
	"base_currency" text DEFAULT 'INR',
	"base_image" text,
	"features" json,
	"is_active" boolean DEFAULT true,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "product_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_bundle_item" (
	"id" text PRIMARY KEY NOT NULL,
	"bundle_product_id" text NOT NULL,
	"component_variant_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"is_optional" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_relation" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "product_relation_type" NOT NULL,
	"source_product_id" text NOT NULL,
	"target_product_id" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"product_id" text NOT NULL,
	"tax_class_id" text,
	"title" text NOT NULL,
	"price_modifier_type" text NOT NULL,
	"price_modifier_value" numeric(10, 2) NOT NULL,
	"attributes" json,
	"media" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "product_variant_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_view_event" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"user_id" text,
	"product_id" text NOT NULL,
	"variant_id" text,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"page_url" text,
	"referrer" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"count" integer,
	"last_request" bigint
);
--> statement-breakpoint
CREATE TABLE "refund" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"status" "refund_status" DEFAULT 'pending' NOT NULL,
	"reason" text,
	"provider_refund_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"rating" integer NOT NULL,
	"title" text,
	"comment" text,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "shipment" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"status" "shipment_status" DEFAULT 'pending' NOT NULL,
	"tracking_number" text,
	"carrier" text,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"estimated_delivery_at" timestamp with time zone,
	"shipping_rate" integer,
	"weight" numeric(10, 2),
	"notes" text,
	"shipping_provider_id" text,
	"shipping_method_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shipping_method" (
	"id" text PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_provider" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipping_provider_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "shipping_rate_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"method_id" text NOT NULL,
	"zone_id" text NOT NULL,
	"price" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_zone" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country_code" text NOT NULL,
	"region_code" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcategory" (
	"id" text PRIMARY KEY NOT NULL,
	"category_slug" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"title" text NOT NULL,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"display_type" "display_type" DEFAULT 'grid' NOT NULL,
	"color" text DEFAULT '#FFFFFF',
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"image" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "subcategory_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tax_class" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tax_class_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "tax_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"zone_id" text NOT NULL,
	"tax_class_id" text NOT NULL,
	"rate" numeric(7, 4) NOT NULL,
	"is_compound" boolean DEFAULT false NOT NULL,
	"applies_to_shipping" boolean DEFAULT false NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_zone" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country_code" text NOT NULL,
	"region_code" text,
	"city" text,
	"postal_code_pattern" text,
	"postal_code_from" text,
	"postal_code_to" text,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouse" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"state" text,
	"city" text,
	"address_line1" text,
	"address_line2" text,
	"postal_code" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "warehouse_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"variant_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_session" ADD CONSTRAINT "analytics_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment" ADD CONSTRAINT "cart_abandonment_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment" ADD CONSTRAINT "cart_abandonment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment_event" ADD CONSTRAINT "cart_abandonment_event_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment_event" ADD CONSTRAINT "cart_abandonment_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_line" ADD CONSTRAINT "cart_line_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_line" ADD CONSTRAINT "cart_line_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_discount_id_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_order_discount_id_order_discount_id_fk" FOREIGN KEY ("order_discount_id") REFERENCES "public"."order_discount"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_inventory_id_inventory_item_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_refund_id_refund_id_fk" FOREIGN KEY ("refund_id") REFERENCES "public"."refund"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_adjusted_by_user_id_fk" FOREIGN KEY ("adjusted_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ADD CONSTRAINT "inventory_reservation_inventory_id_inventory_item_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ADD CONSTRAINT "inventory_reservation_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ADD CONSTRAINT "inventory_reservation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_account" ADD CONSTRAINT "loyalty_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_account" ADD CONSTRAINT "loyalty_account_tier_id_loyalty_tier_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."loyalty_tier"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_account_id_loyalty_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."loyalty_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_refund_id_refund_id_fk" FOREIGN KEY ("refund_id") REFERENCES "public"."refund"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_provider_id_shipping_provider_id_fk" FOREIGN KEY ("shipping_provider_id") REFERENCES "public"."shipping_provider"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_method_id_shipping_method_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_method"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_zone_id_shipping_zone_id_fk" FOREIGN KEY ("shipping_zone_id") REFERENCES "public"."shipping_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_discount" ADD CONSTRAINT "order_discount_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_discount" ADD CONSTRAINT "order_discount_discount_id_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_change_event" ADD CONSTRAINT "price_change_event_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_change_event" ADD CONSTRAINT "price_change_event_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_change_event" ADD CONSTRAINT "price_change_event_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_slug_category_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."category"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_subcategory_slug_subcategory_slug_fk" FOREIGN KEY ("subcategory_slug") REFERENCES "public"."subcategory"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_tax_class_id_tax_class_id_fk" FOREIGN KEY ("tax_class_id") REFERENCES "public"."tax_class"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_bundle_item" ADD CONSTRAINT "product_bundle_item_bundle_product_id_product_id_fk" FOREIGN KEY ("bundle_product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_bundle_item" ADD CONSTRAINT "product_bundle_item_component_variant_id_product_variant_id_fk" FOREIGN KEY ("component_variant_id") REFERENCES "public"."product_variant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_relation" ADD CONSTRAINT "product_relation_source_product_id_product_id_fk" FOREIGN KEY ("source_product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_relation" ADD CONSTRAINT "product_relation_target_product_id_product_id_fk" FOREIGN KEY ("target_product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_tax_class_id_tax_class_id_fk" FOREIGN KEY ("tax_class_id") REFERENCES "public"."tax_class"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_session_id_analytics_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."analytics_session"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_shipping_provider_id_shipping_provider_id_fk" FOREIGN KEY ("shipping_provider_id") REFERENCES "public"."shipping_provider"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_shipping_method_id_shipping_method_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_method"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_method" ADD CONSTRAINT "shipping_method_provider_id_shipping_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."shipping_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_rate_rule" ADD CONSTRAINT "shipping_rate_rule_method_id_shipping_method_id_fk" FOREIGN KEY ("method_id") REFERENCES "public"."shipping_method"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_rate_rule" ADD CONSTRAINT "shipping_rate_rule_zone_id_shipping_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."shipping_zone"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_category_slug_category_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."category"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rule" ADD CONSTRAINT "tax_rule_zone_id_tax_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."tax_zone"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rule" ADD CONSTRAINT "tax_rule_tax_class_id_tax_class_id_fk" FOREIGN KEY ("tax_class_id") REFERENCES "public"."tax_class"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_session_user_idx" ON "analytics_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "analytics_session_anonymous_idx" ON "analytics_session" USING btree ("anonymous_id");--> statement-breakpoint
CREATE INDEX "analytics_session_started_at_idx" ON "analytics_session" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_request_id_idx" ON "audit_log" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "cart_user_id_idx" ON "cart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_session_id_idx" ON "cart" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_cart_idx" ON "cart_abandonment" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_user_idx" ON "cart_abandonment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_abandoned_at_idx" ON "cart_abandonment" USING btree ("abandoned_at");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_cart_idx" ON "cart_abandonment_event" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_user_idx" ON "cart_abandonment_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_type_idx" ON "cart_abandonment_event" USING btree ("type");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_occurred_at_idx" ON "cart_abandonment_event" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_cart_occurred_idx" ON "cart_abandonment_event" USING btree ("cart_id","occurred_at");--> statement-breakpoint
CREATE INDEX "cart_line_cart_id_idx" ON "cart_line" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_line_variant_id_idx" ON "cart_line" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "category_visibility_idx" ON "category" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "category_is_featured_idx" ON "category" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "category_display_order_idx" ON "category" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "discount_usage_event_order_idx" ON "discount_usage_event" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "discount_usage_event_discount_idx" ON "discount_usage_event" USING btree ("discount_id");--> statement-breakpoint
CREATE INDEX "discount_usage_event_discount_created_idx" ON "discount_usage_event" USING btree ("discount_id","created_at");--> statement-breakpoint
CREATE INDEX "discount_usage_event_user_idx" ON "discount_usage_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_inventory_idx" ON "inventory_adjustment_event" USING btree ("inventory_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_warehouse_idx" ON "inventory_adjustment_event" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_variant_idx" ON "inventory_adjustment_event" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_order_idx" ON "inventory_adjustment_event" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_created_at_idx" ON "inventory_adjustment_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "inventory_item_sku_idx" ON "inventory_item" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "inventory_item_variant_warehouse_idx" ON "inventory_item" USING btree ("variant_id","warehouse_id");--> statement-breakpoint
CREATE INDEX "inventory_item_variant_id_idx" ON "inventory_item" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_reservation_inventory_id_idx" ON "inventory_reservation" USING btree ("inventory_id");--> statement-breakpoint
CREATE INDEX "inventory_reservation_warehouse_id_idx" ON "inventory_reservation" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "inventory_reservation_user_id_idx" ON "inventory_reservation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "loyalty_account_user_idx" ON "loyalty_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "loyalty_account_tier_idx" ON "loyalty_account" USING btree ("tier_id");--> statement-breakpoint
CREATE INDEX "loyalty_account_points_balance_idx" ON "loyalty_account" USING btree ("points_balance");--> statement-breakpoint
CREATE INDEX "loyalty_point_transaction_account_idx" ON "loyalty_point_transaction" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "loyalty_point_transaction_type_idx" ON "loyalty_point_transaction" USING btree ("type");--> statement-breakpoint
CREATE INDEX "loyalty_point_transaction_created_at_idx" ON "loyalty_point_transaction" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "loyalty_point_transaction_order_idx" ON "loyalty_point_transaction" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "loyalty_point_transaction_expires_at_idx" ON "loyalty_point_transaction" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "loyalty_tier_code_idx" ON "loyalty_tier" USING btree ("code");--> statement-breakpoint
CREATE INDEX "loyalty_tier_min_lifetime_idx" ON "loyalty_tier" USING btree ("min_lifetime_points");--> statement-breakpoint
CREATE INDEX "loyalty_tier_is_active_idx" ON "loyalty_tier" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "marketing_content_page_section_idx" ON "marketing_content" USING btree ("page","section");--> statement-breakpoint
CREATE INDEX "marketing_content_is_active_idx" ON "marketing_content" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "marketing_content_display_order_idx" ON "marketing_content" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "order_user_idx" ON "order" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_status_idx" ON "order" USING btree ("status");--> statement-breakpoint
CREATE INDEX "order_placed_at_idx" ON "order" USING btree ("placed_at");--> statement-breakpoint
CREATE INDEX "order_warehouse_id_idx" ON "order" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "order_discount_composite_idx" ON "order_discount" USING btree ("order_id","discount_id");--> statement-breakpoint
CREATE INDEX "order_item_order_idx" ON "order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_item_variant_idx" ON "order_item" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "order_status_history_order_idx" ON "order_status_history" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_status_history_created_at_idx" ON "order_status_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payment_order_id_idx" ON "payment" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "price_change_event_product_effective_idx" ON "price_change_event" USING btree ("product_id","effective_at");--> statement-breakpoint
CREATE INDEX "price_change_event_variant_effective_idx" ON "price_change_event" USING btree ("variant_id","effective_at");--> statement-breakpoint
CREATE INDEX "price_change_event_created_at_idx" ON "price_change_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_category_slug_idx" ON "product" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "product_subcategory_slug_idx" ON "product" USING btree ("subcategory_slug");--> statement-breakpoint
CREATE INDEX "product_tax_class_id_idx" ON "product" USING btree ("tax_class_id");--> statement-breakpoint
CREATE INDEX "product_status_idx" ON "product" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_is_active_idx" ON "product" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "product_bundle_item_bundle_idx" ON "product_bundle_item" USING btree ("bundle_product_id");--> statement-breakpoint
CREATE INDEX "product_bundle_item_component_variant_idx" ON "product_bundle_item" USING btree ("component_variant_id");--> statement-breakpoint
CREATE INDEX "product_bundle_item_bundle_order_idx" ON "product_bundle_item" USING btree ("bundle_product_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "product_bundle_item_unique" ON "product_bundle_item" USING btree ("bundle_product_id","component_variant_id");--> statement-breakpoint
CREATE INDEX "product_relation_source_idx" ON "product_relation" USING btree ("source_product_id");--> statement-breakpoint
CREATE INDEX "product_relation_target_idx" ON "product_relation" USING btree ("target_product_id");--> statement-breakpoint
CREATE INDEX "product_relation_type_idx" ON "product_relation" USING btree ("type");--> statement-breakpoint
CREATE INDEX "product_relation_source_type_order_idx" ON "product_relation" USING btree ("source_product_id","type","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "product_relation_unique" ON "product_relation" USING btree ("type","source_product_id","target_product_id");--> statement-breakpoint
CREATE INDEX "product_variant_product_id_idx" ON "product_variant" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variant_tax_class_id_idx" ON "product_variant" USING btree ("tax_class_id");--> statement-breakpoint
CREATE INDEX "product_view_event_product_viewed_idx" ON "product_view_event" USING btree ("product_id","viewed_at");--> statement-breakpoint
CREATE INDEX "product_view_event_session_viewed_idx" ON "product_view_event" USING btree ("session_id","viewed_at");--> statement-breakpoint
CREATE INDEX "product_view_event_user_viewed_idx" ON "product_view_event" USING btree ("user_id","viewed_at");--> statement-breakpoint
CREATE INDEX "product_view_event_viewed_at_idx" ON "product_view_event" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "refund_order_idx" ON "refund" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "refund_payment_idx" ON "refund" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "refund_status_idx" ON "refund" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_product_idx" ON "review" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "review_user_idx" ON "review" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "review_rating_idx" ON "review" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "shipment_order_id_idx" ON "shipment" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "shipment_tracking_idx" ON "shipment" USING btree ("tracking_number");--> statement-breakpoint
CREATE INDEX "shipping_method_provider_code_idx" ON "shipping_method" USING btree ("provider_id","code");--> statement-breakpoint
CREATE INDEX "shipping_method_is_active_idx" ON "shipping_method" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shipping_provider_code_idx" ON "shipping_provider" USING btree ("code");--> statement-breakpoint
CREATE INDEX "shipping_provider_is_active_idx" ON "shipping_provider" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shipping_rate_rule_method_zone_idx" ON "shipping_rate_rule" USING btree ("method_id","zone_id");--> statement-breakpoint
CREATE INDEX "shipping_rate_rule_is_active_idx" ON "shipping_rate_rule" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shipping_zone_country_region_idx" ON "shipping_zone" USING btree ("country_code","region_code");--> statement-breakpoint
CREATE INDEX "shipping_zone_is_active_idx" ON "shipping_zone" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "subcategory_category_slug_idx" ON "subcategory" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "subcategory_visibility_idx" ON "subcategory" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "subcategory_is_featured_idx" ON "subcategory" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "tax_class_code_idx" ON "tax_class" USING btree ("code");--> statement-breakpoint
CREATE INDEX "tax_class_is_default_idx" ON "tax_class" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX "tax_rule_zone_idx" ON "tax_rule" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "tax_rule_tax_class_idx" ON "tax_rule" USING btree ("tax_class_id");--> statement-breakpoint
CREATE INDEX "tax_rule_active_effective_idx" ON "tax_rule" USING btree ("is_active","effective_from");--> statement-breakpoint
CREATE INDEX "tax_rule_zone_class_effective_idx" ON "tax_rule" USING btree ("zone_id","tax_class_id","effective_from");--> statement-breakpoint
CREATE INDEX "tax_zone_country_region_idx" ON "tax_zone" USING btree ("country_code","region_code");--> statement-breakpoint
CREATE INDEX "tax_zone_active_priority_idx" ON "tax_zone" USING btree ("is_active","priority");--> statement-breakpoint
CREATE INDEX "warehouse_code_idx" ON "warehouse" USING btree ("code");--> statement-breakpoint
CREATE INDEX "warehouse_is_active_idx" ON "warehouse" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "warehouse_country_idx" ON "warehouse" USING btree ("country");--> statement-breakpoint
CREATE INDEX "wishlist_user_id_idx" ON "wishlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wishlist_variant_id_idx" ON "wishlist" USING btree ("variant_id");