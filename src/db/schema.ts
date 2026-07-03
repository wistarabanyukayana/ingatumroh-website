import {
  boolean,
  check,
  date,
  foreignKey,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import type { ItineraryDay, PartnerLogo, Socials } from "./json";

export const departureStatus = pgEnum("departure_status", [
  "open",
  "almost_full",
  "full",
  "departed",
  "cancelled",
]);

export const packages = pgTable(
  "packages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull(),
    // Mirrors Paket.Deskripsi in the Delta Laras ops schema (docs/PLAN.md).
    description: text("description"),
    heroImageUrl: text("hero_image_url"),
    // IDR has no minor unit; whole rupiah.
    priceFrom: numeric("price_from", {
      precision: 14,
      scale: 0,
      mode: "number",
    }).notNull(),
    currency: varchar("currency", { length: 3 }).default("IDR").notNull(),
    durationDays: integer("duration_days").notNull(),
    airline: varchar("airline", { length: 100 }),
    hotelMakkah: varchar("hotel_makkah", { length: 150 }),
    hotelMakkahStars: integer("hotel_makkah_stars"),
    hotelMadinah: varchar("hotel_madinah", { length: 150 }),
    hotelMadinahStars: integer("hotel_madinah_stars"),
    inclusions: jsonb("inclusions").$type<string[]>().default([]).notNull(),
    exclusions: jsonb("exclusions").$type<string[]>().default([]).notNull(),
    itinerary: jsonb("itinerary").$type<ItineraryDay[]>().default([]).notNull(),
    facilities: jsonb("facilities").$type<string[]>().default([]).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("packages_uq_slug").on(table.slug),
    uniqueIndex("packages_uq_name").on(table.name),
  ],
).enableRLS();

export const departures = pgTable(
  "departures",
  {
    id: serial("id").primaryKey(),
    packageId: integer("package_id").notNull(),
    departDate: date("depart_date", { mode: "date" }).notNull(),
    returnDate: date("return_date", { mode: "date" }).notNull(),
    quota: integer("quota").notNull(),
    status: departureStatus("status").default("open").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.packageId],
      foreignColumns: [packages.id],
      name: "departures_packages",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ],
).enableRLS();

export const testimonials = pgTable(
  "testimonials",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    photoUrl: text("photo_url"),
    quote: text("quote").notNull(),
    packageId: integer("package_id"),
    isPublished: boolean("is_published").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.packageId],
      foreignColumns: [packages.id],
      name: "testimonials_packages",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ],
).enableRLS();

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: varchar("caption", { length: 255 }),
  // Free-text album/trip label (e.g. "Umroh Ramadhan 1447H").
  album: varchar("album", { length: 100 }),
  isPublished: boolean("is_published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

// Singleton row (id = 1, enforced by check constraint). Everything the staff
// should edit without a deploy but that isn't a content collection.
export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),
    // Digits only, international format without "+" (e.g. "628123456789") —
    // interpolated into wa.me links.
    whatsappNumber: varchar("whatsapp_number", { length: 20 }).notNull(),
    ppiuLicenseNo: varchar("ppiu_license_no", { length: 100 }).notNull(),
    legalEntity: varchar("legal_entity", { length: 150 }).notNull(),
    heroHeadline: varchar("hero_headline", { length: 200 }).notNull(),
    heroSubhead: varchar("hero_subhead", { length: 300 }),
    partnerLogos: jsonb("partner_logos")
      .$type<PartnerLogo[]>()
      .default([])
      .notNull(),
    contactEmail: varchar("contact_email", { length: 100 }),
    contactPhone: varchar("contact_phone", { length: 20 }),
    address: text("address"),
    socials: jsonb("socials").$type<Socials>().default({}).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [check("site_settings_singleton", sql`${table.id} = 1`)],
).enableRLS();

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    packageId: integer("package_id"),
    message: text("message"),
    // Where the lead came from (e.g. "hero_cta", "package_card", "footer").
    source: varchar("source", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.packageId],
      foreignColumns: [packages.id],
      name: "leads_packages",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ],
).enableRLS();

// Phase 4 — schema designed now, no UI/routes until then.
export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    coverImageUrl: text("cover_image_url"),
    excerpt: varchar("excerpt", { length: 300 }),
    // Markdown body.
    content: text("content").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("articles_uq_slug").on(table.slug)],
).enableRLS();
