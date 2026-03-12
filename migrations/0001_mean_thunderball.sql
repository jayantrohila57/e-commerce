CREATE TYPE "public"."marketing_content_page" AS ENUM('home', 'store', 'store_category', 'store_subcategory', 'product', 'checkout', 'about', 'newsletter', 'support');--> statement-breakpoint
CREATE TYPE "public"."marketing_content_section" AS ENUM('promo_banner', 'cta', 'offer_banner', 'split_banner', 'announcement_bar', 'feature_highlight');--> statement-breakpoint
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
CREATE INDEX "marketing_content_page_section_idx" ON "marketing_content" USING btree ("page","section");--> statement-breakpoint
CREATE INDEX "marketing_content_is_active_idx" ON "marketing_content" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "marketing_content_display_order_idx" ON "marketing_content" USING btree ("display_order");