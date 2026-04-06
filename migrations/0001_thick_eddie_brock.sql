CREATE TYPE "public"."cookie_consent_source" AS ENUM('banner', 'account', 'sync', 'server');--> statement-breakpoint
CREATE TABLE "cookie_consent_audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"essential" boolean DEFAULT true NOT NULL,
	"functional" boolean DEFAULT false NOT NULL,
	"analytics" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"region" text,
	"consent_version" integer DEFAULT 1 NOT NULL,
	"source" "cookie_consent_source" DEFAULT 'banner' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_cookie_consent" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"essential" boolean DEFAULT true NOT NULL,
	"functional" boolean DEFAULT false NOT NULL,
	"analytics" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"region" text,
	"consent_version" integer DEFAULT 1 NOT NULL,
	"source" "cookie_consent_source" DEFAULT 'banner' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cookie_consent_audit_log" ADD CONSTRAINT "cookie_consent_audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cookie_consent" ADD CONSTRAINT "user_cookie_consent_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cookie_consent_audit_log_user_id_idx" ON "cookie_consent_audit_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cookie_consent_audit_log_created_at_idx" ON "cookie_consent_audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_cookie_consent_user_id_unique" ON "user_cookie_consent" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_cookie_consent_expires_at_idx" ON "user_cookie_consent" USING btree ("expires_at");