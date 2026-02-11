ALTER TABLE "shipping_address" DROP CONSTRAINT "shipping_address_cart_id_cart_id_fk";
--> statement-breakpoint
ALTER TABLE "shipping_address" DROP COLUMN "cart_id";