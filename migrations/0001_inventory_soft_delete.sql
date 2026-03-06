ALTER TABLE "inventory_item" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "inventory_item_deleted_at_idx" ON "inventory_item" USING btree ("deleted_at");--> statement-breakpoint

