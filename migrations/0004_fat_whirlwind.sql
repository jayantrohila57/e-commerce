ALTER TABLE "series" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "display_type" "display_type" DEFAULT 'grid' NOT NULL;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "color" text DEFAULT '#FFFFFF';--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "visibility" "visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;