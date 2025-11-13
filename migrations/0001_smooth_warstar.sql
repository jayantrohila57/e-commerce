ALTER TABLE "subcategory" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "display_type" "display_type" DEFAULT 'grid' NOT NULL;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "color" text DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "visibility" "visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subcategory" ADD COLUMN "updated_at" timestamp DEFAULT now();