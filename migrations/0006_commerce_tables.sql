-- Migration: Add Commerce Tables (Order, Order Item, Payment)
-- Generated: 2026-03-03
-- Phase: 1.1-1.2 - Order System Tables + Payment System Tables

-- Create order table for customer orders
CREATE TABLE IF NOT EXISTS "order" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT REFERENCES "user"("id") ON DELETE SET NULL,
    "status" "order_status" NOT NULL DEFAULT 'pending',
    "subtotal" INTEGER NOT NULL,
    "discount_total" INTEGER NOT NULL DEFAULT 0,
    "tax_total" INTEGER NOT NULL DEFAULT 0,
    "shipping_total" INTEGER NOT NULL DEFAULT 0,
    "grand_total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "shipping_address" JSONB NOT NULL,
    "billing_address" JSONB,
    "notes" TEXT,
    "placed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for order table
CREATE INDEX IF NOT EXISTS "order_user_idx" ON "order" ("user_id");
CREATE INDEX IF NOT EXISTS "order_status_idx" ON "order" ("status");
CREATE INDEX IF NOT EXISTS "order_placed_at_idx" ON "order" ("placed_at");

-- Create order_item table for order line items
CREATE TABLE IF NOT EXISTS "order_item" (
    "id" TEXT PRIMARY KEY,
    "order_id" TEXT NOT NULL REFERENCES "order"("id") ON DELETE CASCADE,
    "variant_id" TEXT NOT NULL REFERENCES "product_variant"("id"),
    "product_title" TEXT NOT NULL,
    "variant_title" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "attributes" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for order_item table
CREATE INDEX IF NOT EXISTS "order_item_order_idx" ON "order_item" ("order_id");

-- Create payment table for order payments
CREATE TABLE IF NOT EXISTS "payment" (
    "id" TEXT PRIMARY KEY,
    "order_id" TEXT NOT NULL REFERENCES "order"("id") ON DELETE CASCADE,
    "provider" "payment_provider" NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'pending',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "provider_payment_id" TEXT,
    "provider_metadata" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert initial enum values if they don't exist
INSERT INTO "pg_enum" ("enumtypid", "enumlabel", "enumsortorder")
SELECT 
    (SELECT oid, 'pending', 1 FROM "pg_type" WHERE "typname" = 'order_status' AND 'typinput' = 'order_status')
WHERE NOT EXISTS (
    SELECT 1 FROM "pg_enum" 
    WHERE "enumtypid" = (SELECT oid FROM "pg_type" WHERE "typname" = 'order_status' AND 'typinput' = 'order_status')
    AND "enumlabel" = 'pending'
) AND NOT EXISTS (
    SELECT 1 FROM "pg_enum" 
    WHERE "enumtypid" = (SELECT oid FROM "pg_type" WHERE "typname" = 'order_status' AND 'typinput' = 'order_status')
    AND "enumlabel" = 'pending'
) IS FALSE;

-- Similar inserts for other enum values can be added if needed
-- For now, the enums should already exist from the initial schema
