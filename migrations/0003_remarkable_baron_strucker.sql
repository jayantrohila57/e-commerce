CREATE UNIQUE INDEX "payment_order_provider_pending_uidx" ON "payment" USING btree ("order_id","provider") WHERE "payment"."status" = 'pending';
