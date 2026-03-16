CREATE TABLE "warehouse" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"state" text,
	"city" text,
	"address_line1" text,
	"address_line2" text,
	"postal_code" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "warehouse_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "inventory_item" DROP CONSTRAINT "inventory_item_sku_unique";--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD COLUMN "warehouse_id" text;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD COLUMN "warehouse_id" text;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ADD COLUMN "warehouse_id" text;--> statement-breakpoint
CREATE INDEX "warehouse_code_idx" ON "warehouse" USING btree ("code");--> statement-breakpoint
CREATE INDEX "warehouse_is_active_idx" ON "warehouse" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "warehouse_country_idx" ON "warehouse" USING btree ("country");--> statement-breakpoint
ALTER TABLE "inventory_adjustment_event" ADD CONSTRAINT "inventory_adjustment_event_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservation" ADD CONSTRAINT "inventory_reservation_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inventory_adjustment_event_warehouse_idx" ON "inventory_adjustment_event" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "inventory_item_variant_warehouse_idx" ON "inventory_item" USING btree ("variant_id","warehouse_id");--> statement-breakpoint
CREATE INDEX "inventory_reservation_warehouse_id_idx" ON "inventory_reservation" USING btree ("warehouse_id");