CREATE TABLE "shipping_method" (
	"id" text PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_provider" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipping_provider_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "shipping_rate_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"method_id" text NOT NULL,
	"zone_id" text NOT NULL,
	"price" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_zone" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country_code" text NOT NULL,
	"region_code" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipping_provider_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipping_method_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipping_zone_id" text;--> statement-breakpoint
ALTER TABLE "shipment" ADD COLUMN "shipping_provider_id" text;--> statement-breakpoint
ALTER TABLE "shipment" ADD COLUMN "shipping_method_id" text;--> statement-breakpoint
ALTER TABLE "shipping_method" ADD CONSTRAINT "shipping_method_provider_id_shipping_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."shipping_provider"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_rate_rule" ADD CONSTRAINT "shipping_rate_rule_method_id_shipping_method_id_fk" FOREIGN KEY ("method_id") REFERENCES "public"."shipping_method"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_rate_rule" ADD CONSTRAINT "shipping_rate_rule_zone_id_shipping_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."shipping_zone"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shipping_method_provider_code_idx" ON "shipping_method" USING btree ("provider_id","code");--> statement-breakpoint
CREATE INDEX "shipping_method_is_active_idx" ON "shipping_method" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shipping_provider_code_idx" ON "shipping_provider" USING btree ("code");--> statement-breakpoint
CREATE INDEX "shipping_provider_is_active_idx" ON "shipping_provider" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shipping_rate_rule_method_zone_idx" ON "shipping_rate_rule" USING btree ("method_id","zone_id");--> statement-breakpoint
CREATE INDEX "shipping_rate_rule_is_active_idx" ON "shipping_rate_rule" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "shipping_zone_country_region_idx" ON "shipping_zone" USING btree ("country_code","region_code");--> statement-breakpoint
CREATE INDEX "shipping_zone_is_active_idx" ON "shipping_zone" USING btree ("is_active");--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_provider_id_shipping_provider_id_fk" FOREIGN KEY ("shipping_provider_id") REFERENCES "public"."shipping_provider"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_method_id_shipping_method_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_method"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_zone_id_shipping_zone_id_fk" FOREIGN KEY ("shipping_zone_id") REFERENCES "public"."shipping_zone"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_shipping_provider_id_shipping_provider_id_fk" FOREIGN KEY ("shipping_provider_id") REFERENCES "public"."shipping_provider"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_shipping_method_id_shipping_method_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_method"("id") ON DELETE set null ON UPDATE no action;