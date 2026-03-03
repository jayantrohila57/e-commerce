CREATE TYPE "public"."audit_actor_type" AS ENUM('user', 'system');--> statement-breakpoint
CREATE TYPE "public"."cart_abandonment_event_type" AS ENUM('created', 'updated', 'abandoned', 'recovered', 'notified');--> statement-breakpoint
CREATE TYPE "public"."inventory_adjustment_type" AS ENUM('manual', 'order', 'restock', 'return', 'damaged', 'correction');--> statement-breakpoint
CREATE TYPE "public"."loyalty_point_transaction_type" AS ENUM('earn', 'redeem', 'adjust', 'expire', 'reversal');--> statement-breakpoint
CREATE TYPE "public"."product_relation_type" AS ENUM('related', 'cross_sell', 'upsell');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('pending', 'processed', 'failed');--> statement-breakpoint
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
ALTER TABLE "cart_line" DROP CONSTRAINT "cart_line_cart_id_cart_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_line" DROP CONSTRAINT "cart_line_variant_id_product_variant_id_fk";
--> statement-breakpoint
ALTER TABLE "inventory_reservation" DROP CONSTRAINT "inventory_reservation_inventory_id_inventory_item_id_fk";
--> statement-breakpoint
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_variant_id_product_variant_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "refresh_token_expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "attribute" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "attribute" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "attribute" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "attribute" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "inventory_item" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inventory_item" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "inventory_reservation" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "passkey" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "series" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "series" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "series" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "series" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "subcategory" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subcategory" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "subcategory" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subcategory" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "ban_expires" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "tax_class_id" text;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "tax_class_id" text;--> statement-breakpoint
ALTER TABLE "analytics_session" ADD CONSTRAINT "analytics_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment" ADD CONSTRAINT "cart_abandonment_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment" ADD CONSTRAINT "cart_abandonment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment_event" ADD CONSTRAINT "cart_abandonment_event_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_abandonment_event" ADD CONSTRAINT "cart_abandonment_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_discount_id_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_order_discount_id_order_discount_id_fk" FOREIGN KEY ("order_discount_id") REFERENCES "public"."order_discount"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_usage_event" ADD CONSTRAINT "discount_usage_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_inventory_id_inventory_item_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_refund_id_refund_id_fk" FOREIGN KEY ("refund_id") REFERENCES "public"."refund"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_adjusted_by_user_id_fk" FOREIGN KEY ("adjusted_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_account" ADD CONSTRAINT "loyalty_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_account" ADD CONSTRAINT "loyalty_account_tier_id_loyalty_tier_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."loyalty_tier"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_account_id_loyalty_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."loyalty_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_point_transaction" ADD CONSTRAINT "loyalty_point_transaction_refund_id_refund_id_fk" FOREIGN KEY ("refund_id") REFERENCES "public"."refund"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_change_event" ADD CONSTRAINT "price_change_event_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_change_event" ADD CONSTRAINT "price_change_event_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_change_event" ADD CONSTRAINT "price_change_event_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_bundle_item" ADD CONSTRAINT "product_bundle_item_bundle_product_id_product_id_fk" FOREIGN KEY ("bundle_product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_bundle_item" ADD CONSTRAINT "product_bundle_item_component_variant_id_product_variant_id_fk" FOREIGN KEY ("component_variant_id") REFERENCES "public"."product_variant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_relation" ADD CONSTRAINT "product_relation_source_product_id_product_id_fk" FOREIGN KEY ("source_product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_relation" ADD CONSTRAINT "product_relation_target_product_id_product_id_fk" FOREIGN KEY ("target_product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_session_id_analytics_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."analytics_session"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_event" ADD CONSTRAINT "product_view_event_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund" ADD CONSTRAINT "refund_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rule" ADD CONSTRAINT "tax_rule_zone_id_tax_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."tax_zone"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rule" ADD CONSTRAINT "tax_rule_tax_class_id_tax_class_id_fk" FOREIGN KEY ("tax_class_id") REFERENCES "public"."tax_class"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_session_user_idx" ON "analytics_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "analytics_session_anonymous_idx" ON "analytics_session" USING btree ("anonymous_id");--> statement-breakpoint
CREATE INDEX "analytics_session_started_at_idx" ON "analytics_session" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_request_id_idx" ON "audit_log" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_cart_idx" ON "cart_abandonment" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_user_idx" ON "cart_abandonment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_abandoned_at_idx" ON "cart_abandonment" USING btree ("abandoned_at");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_cart_idx" ON "cart_abandonment_event" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_user_idx" ON "cart_abandonment_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_type_idx" ON "cart_abandonment_event" USING btree ("type");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_occurred_at_idx" ON "cart_abandonment_event" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "cart_abandonment_event_cart_occurred_idx" ON "cart_abandonment_event" USING btree ("cart_id","occurred_at");--> statement-breakpoint
CREATE INDEX "discount_usage_event_order_idx" ON "discount_usage_event" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "discount_usage_event_discount_idx" ON "discount_usage_event" USING btree ("discount_id");--> statement-breakpoint
CREATE INDEX "discount_usage_event_discount_created_idx" ON "discount_usage_event" USING btree ("discount_id","created_at");--> statement-breakpoint
CREATE INDEX "discount_usage_event_user_idx" ON "discount_usage_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_inventory_idx" ON "inventory_adjustment_event" USING btree ("inventory_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_variant_idx" ON "inventory_adjustment_event" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_order_idx" ON "inventory_adjustment_event" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_created_at_idx" ON "inventory_adjustment_event" USING btree ("created_at");--> statement-breakpoint
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
CREATE INDEX "order_status_history_order_idx" ON "order_status_history" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_status_history_created_at_idx" ON "order_status_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "price_change_event_product_effective_idx" ON "price_change_event" USING btree ("product_id","effective_at");--> statement-breakpoint
CREATE INDEX "price_change_event_variant_effective_idx" ON "price_change_event" USING btree ("variant_id","effective_at");--> statement-breakpoint
CREATE INDEX "price_change_event_created_at_idx" ON "price_change_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_bundle_item_bundle_idx" ON "product_bundle_item" USING btree ("bundle_product_id");--> statement-breakpoint
CREATE INDEX "product_bundle_item_component_variant_idx" ON "product_bundle_item" USING btree ("component_variant_id");--> statement-breakpoint
CREATE INDEX "product_bundle_item_bundle_order_idx" ON "product_bundle_item" USING btree ("bundle_product_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "product_bundle_item_unique" ON "product_bundle_item" USING btree ("bundle_product_id","component_variant_id");--> statement-breakpoint
CREATE INDEX "product_relation_source_idx" ON "product_relation" USING btree ("source_product_id");--> statement-breakpoint
CREATE INDEX "product_relation_target_idx" ON "product_relation" USING btree ("target_product_id");--> statement-breakpoint
CREATE INDEX "product_relation_type_idx" ON "product_relation" USING btree ("type");--> statement-breakpoint
CREATE INDEX "product_relation_source_type_order_idx" ON "product_relation" USING btree ("source_product_id","type","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "product_relation_unique" ON "product_relation" USING btree ("type","source_product_id","target_product_id");--> statement-breakpoint
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
CREATE INDEX "tax_class_code_idx" ON "tax_class" USING btree ("code");--> statement-breakpoint
CREATE INDEX "tax_class_is_default_idx" ON "tax_class" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX "tax_rule_zone_idx" ON "tax_rule" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "tax_rule_tax_class_idx" ON "tax_rule" USING btree ("tax_class_id");--> statement-breakpoint
CREATE INDEX "tax_rule_active_effective_idx" ON "tax_rule" USING btree ("is_active","effective_from");--> statement-breakpoint
CREATE INDEX "tax_rule_zone_class_effective_idx" ON "tax_rule" USING btree ("zone_id","tax_class_id","effective_from");--> statement-breakpoint
CREATE INDEX "tax_zone_country_region_idx" ON "tax_zone" USING btree ("country_code","region_code");--> statement-breakpoint
CREATE INDEX "tax_zone_active_priority_idx" ON "tax_zone" USING btree ("is_active","priority");--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_line" ADD CONSTRAINT "cart_line_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_line" ADD CONSTRAINT "cart_line_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ADD CONSTRAINT "inventory_reservation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ADD CONSTRAINT "inventory_reservation_inventory_id_inventory_item_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_tax_class_id_tax_class_id_fk" FOREIGN KEY ("tax_class_id") REFERENCES "public"."tax_class"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_tax_class_id_tax_class_id_fk" FOREIGN KEY ("tax_class_id") REFERENCES "public"."tax_class"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_line_cart_id_idx" ON "cart_line" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "cart_line_variant_id_idx" ON "cart_line" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_reservation_inventory_id_idx" ON "inventory_reservation" USING btree ("inventory_id");--> statement-breakpoint
CREATE INDEX "inventory_reservation_user_id_idx" ON "inventory_reservation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_item_variant_idx" ON "order_item" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "product_tax_class_id_idx" ON "product" USING btree ("tax_class_id");--> statement-breakpoint
CREATE INDEX "product_variant_tax_class_id_idx" ON "product_variant" USING btree ("tax_class_id");--> statement-breakpoint
CREATE INDEX "wishlist_variant_id_idx" ON "wishlist" USING btree ("variant_id");