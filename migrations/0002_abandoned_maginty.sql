ALTER TABLE "product_variant_attribute" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_variant_media" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "product_variant_attribute" CASCADE;--> statement-breakpoint
DROP TABLE "product_variant_media" CASCADE;--> statement-breakpoint
ALTER TABLE "product_variant" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_variant" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "product_variant" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_variant" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "base_image" text;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "attributes" json;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "media" json;--> statement-breakpoint
ALTER TABLE "product_variant" ADD COLUMN "deleted_at" timestamp with time zone;