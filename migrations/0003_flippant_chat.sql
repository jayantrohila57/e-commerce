CREATE TYPE "public"."product_status" AS ENUM('draft', 'archive', 'live');--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."product_status";--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "status" SET DATA TYPE "public"."product_status" USING "status"::"public"."product_status";--> statement-breakpoint
CREATE INDEX "category_visibility_idx" ON "category" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "category_is_featured_idx" ON "category" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "category_display_order_idx" ON "category" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "product_category_slug_idx" ON "product" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "product_subcategory_slug_idx" ON "product" USING btree ("subcategory_slug");--> statement-breakpoint
CREATE INDEX "product_series_slug_idx" ON "product" USING btree ("series_slug");--> statement-breakpoint
CREATE INDEX "product_status_idx" ON "product" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_is_active_idx" ON "product" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "product_variant_product_id_idx" ON "product_variant" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "series_subcategory_slug_idx" ON "series" USING btree ("subcategory_slug");--> statement-breakpoint
CREATE INDEX "series_visibility_idx" ON "series" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "series_is_featured_idx" ON "series" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "subcategory_category_slug_idx" ON "subcategory" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "subcategory_visibility_idx" ON "subcategory" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "subcategory_is_featured_idx" ON "subcategory" USING btree ("is_featured");