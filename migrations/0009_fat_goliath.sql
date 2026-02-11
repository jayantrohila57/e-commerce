ALTER TABLE "order_item" ADD COLUMN "sku" text;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "barcode" text;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "attributes" json;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "currency" text DEFAULT 'INR';