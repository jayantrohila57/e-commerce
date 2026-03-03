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
CREATE TABLE "order_discount" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"discount_id" text NOT NULL,
	"applied_amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "order_discount" ADD CONSTRAINT "order_discount_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_discount" ADD CONSTRAINT "order_discount_discount_id_discount_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discount"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_discount_composite_idx" ON "order_discount" USING btree ("order_id","discount_id");--> statement-breakpoint
CREATE INDEX "shipment_order_id_idx" ON "shipment" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "shipment_tracking_idx" ON "shipment" USING btree ("tracking_number");--> statement-breakpoint
CREATE INDEX "attribute_series_slug_idx" ON "attribute" USING btree ("series_slug");--> statement-breakpoint
CREATE INDEX "cart_user_id_idx" ON "cart" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_session_id_idx" ON "cart" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "inventory_item_sku_idx" ON "inventory_item" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "inventory_item_variant_id_idx" ON "inventory_item" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "wishlist_user_id_idx" ON "wishlist" USING btree ("user_id");