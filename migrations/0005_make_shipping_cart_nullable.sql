-- Make shipping_address.cart_id nullable
ALTER TABLE public.shipping_address
  ALTER COLUMN cart_id DROP NOT NULL;
