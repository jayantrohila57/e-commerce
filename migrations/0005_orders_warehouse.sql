ALTER TABLE "order" ADD COLUMN "warehouse_id" text;
--> statement-breakpoint
CREATE INDEX "order_warehouse_id_idx" ON "order" USING btree ("warehouse_id");
--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_warehouse_id_warehouse_id_fk"
  FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id")
  ON DELETE set null ON UPDATE no action;

