CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"type" text DEFAULT 'image',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_variant_attribute" (
	"id" text PRIMARY KEY NOT NULL,
	"variant_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_variant_media" (
	"id" text PRIMARY KEY NOT NULL,
	"variant_id" text NOT NULL,
	"media_id" text NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "address" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cart" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cart_item" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "delivery_zones" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "discount" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "inventory" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_item" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_image" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "review" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "shipment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "warehouse" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wishlist" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wishlist_item" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "address" CASCADE;--> statement-breakpoint
DROP TABLE "cart" CASCADE;--> statement-breakpoint
DROP TABLE "cart_item" CASCADE;--> statement-breakpoint
DROP TABLE "delivery_zones" CASCADE;--> statement-breakpoint
DROP TABLE "discount" CASCADE;--> statement-breakpoint
DROP TABLE "inventory" CASCADE;--> statement-breakpoint
DROP TABLE "order" CASCADE;--> statement-breakpoint
DROP TABLE "order_item" CASCADE;--> statement-breakpoint
DROP TABLE "payment" CASCADE;--> statement-breakpoint
DROP TABLE "product_image" CASCADE;--> statement-breakpoint
DROP TABLE "review" CASCADE;--> statement-breakpoint
DROP TABLE "shipment" CASCADE;--> statement-breakpoint
DROP TABLE "warehouse" CASCADE;--> statement-breakpoint
DROP TABLE "wishlist" CASCADE;--> statement-breakpoint
DROP TABLE "wishlist_item" CASCADE;--> statement-breakpoint
ALTER TABLE "product" RENAME COLUMN "base_image" TO "category_slug";--> statement-breakpoint
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_sku_unique";--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "subcategory_slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "base_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "base_currency" text DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "features" json;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "price_modifier_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "price_modifier_value" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "product_variant_attribute" ADD CONSTRAINT "product_variant_attribute_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_attribute" ADD CONSTRAINT "product_variant_attribute_attribute_id_attribute_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attribute"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_media" ADD CONSTRAINT "product_variant_media_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_media" ADD CONSTRAINT "product_variant_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_slug_category_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."category"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_subcategory_slug_subcategory_slug_fk" FOREIGN KEY ("subcategory_slug") REFERENCES "public"."subcategory"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant" DROP COLUMN "sku";--> statement-breakpoint
ALTER TABLE "product_variant" DROP COLUMN "stock";--> statement-breakpoint
ALTER TABLE "product_variant" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "product_variant" DROP COLUMN "is_default";--> statement-breakpoint
ALTER TABLE "product_variant" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "attribute" ADD CONSTRAINT "attribute_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_slug_unique" UNIQUE("slug");