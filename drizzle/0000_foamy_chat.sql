CREATE TYPE "public"."departure_status" AS ENUM('open', 'almost_full', 'full', 'departed', 'cancelled');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"cover_image_url" text,
	"excerpt" varchar(300),
	"content" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departures" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"depart_date" date NOT NULL,
	"return_date" date NOT NULL,
	"quota" integer NOT NULL,
	"status" "departure_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"caption" varchar(255),
	"album" varchar(100),
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"package_id" integer,
	"message" text,
	"source" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"description" text,
	"hero_image_url" text,
	"price_from" numeric(14, 0) NOT NULL,
	"currency" varchar(3) DEFAULT 'IDR' NOT NULL,
	"duration_days" integer NOT NULL,
	"airline" varchar(100),
	"hotel_makkah" varchar(150),
	"hotel_makkah_stars" integer,
	"hotel_madinah" varchar(150),
	"hotel_madinah_stars" integer,
	"inclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exclusions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"itinerary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"facilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"whatsapp_number" varchar(20) NOT NULL,
	"ppiu_license_no" varchar(100) NOT NULL,
	"legal_entity" varchar(150) NOT NULL,
	"hero_headline" varchar(200) NOT NULL,
	"hero_subhead" varchar(300),
	"partner_logos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"contact_email" varchar(100),
	"contact_phone" varchar(20),
	"address" text,
	"socials" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_singleton" CHECK ("site_settings"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"photo_url" text,
	"quote" text NOT NULL,
	"package_id" integer,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departures" ADD CONSTRAINT "departures_packages" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_packages" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_packages" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "articles_uq_slug" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "packages_uq_slug" ON "packages" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "packages_uq_name" ON "packages" USING btree ("name");