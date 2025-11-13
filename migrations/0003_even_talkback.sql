CREATE TABLE "attribute" (
	"id" text PRIMARY KEY NOT NULL,
	"series_slug" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" text DEFAULT 'text' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp with time zone,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "series" RENAME COLUMN "subcategory_id" TO "subcategory_slug";--> statement-breakpoint
ALTER TABLE "series" DROP CONSTRAINT "series_subcategory_id_subcategory_id_fk";
--> statement-breakpoint
ALTER TABLE "subcategory" DROP CONSTRAINT "subcategory_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "attribute" ADD CONSTRAINT "attribute_series_slug_series_slug_fk" FOREIGN KEY ("series_slug") REFERENCES "public"."series"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series" ADD CONSTRAINT "series_subcategory_slug_subcategory_slug_fk" FOREIGN KEY ("subcategory_slug") REFERENCES "public"."subcategory"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_category_slug_category_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."category"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "series" DROP COLUMN "attributes";--> statement-breakpoint
ALTER TABLE "subcategory" DROP COLUMN "category_id";