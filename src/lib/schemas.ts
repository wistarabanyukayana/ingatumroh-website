import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import {
  itineraryDaySchema,
  partnerLogoSchema,
  socialsSchema,
} from "@/db/json";
import {
  articles,
  departures,
  galleryImages,
  leads,
  packages,
  siteSettings,
  testimonials,
} from "@/db/schema";

// Single source of truth for validation: derived from the Drizzle schema,
// with refinements for formats the DB can't express. Every admin mutation
// must parse its input with the *Insert/*Update schema of its entity.

const slug = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase-kebab-case only");

// Digits only, international format without "+" (wa.me requirement).
const phoneDigits = z.string().regex(/^[0-9]{8,15}$/, "digits only, 8-15");

const stringList = z.array(z.string().min(1));

const packageRefinements = {
  slug,
  priceFrom: z.number().int().nonnegative(),
  durationDays: z.number().int().positive(),
  hotelMakkahStars: z.number().int().min(1).max(5).nullish(),
  hotelMadinahStars: z.number().int().min(1).max(5).nullish(),
  inclusions: stringList,
  exclusions: stringList,
  itinerary: z.array(itineraryDaySchema),
  facilities: stringList,
};

export const packageSelectSchema = createSelectSchema(
  packages,
  packageRefinements,
);
export const packageInsertSchema = createInsertSchema(
  packages,
  packageRefinements,
);
export const packageUpdateSchema = createUpdateSchema(
  packages,
  packageRefinements,
);

export const departureInsertSchema = createInsertSchema(departures, {
  quota: z.number().int().positive(),
}).refine((d) => d.returnDate > d.departDate, {
  message: "returnDate must be after departDate",
  path: ["returnDate"],
});
export const departureUpdateSchema = createUpdateSchema(departures, {
  quota: z.number().int().positive(),
});

export const testimonialInsertSchema = createInsertSchema(testimonials);
export const testimonialUpdateSchema = createUpdateSchema(testimonials);

export const galleryImageInsertSchema = createInsertSchema(galleryImages);
export const galleryImageUpdateSchema = createUpdateSchema(galleryImages);

const siteSettingsRefinements = {
  whatsappNumber: phoneDigits,
  contactPhone: phoneDigits.nullish(),
  partnerLogos: z.array(partnerLogoSchema),
  socials: socialsSchema,
};

export const siteSettingsSelectSchema = createSelectSchema(
  siteSettings,
  siteSettingsRefinements,
);
// Settings row is a singleton — only updates, never inserts from the admin.
export const siteSettingsUpdateSchema = createUpdateSchema(
  siteSettings,
  siteSettingsRefinements,
);

export const leadInsertSchema = createInsertSchema(leads, {
  phone: phoneDigits,
});

export const articleInsertSchema = createInsertSchema(articles, { slug });
export const articleUpdateSchema = createUpdateSchema(articles, { slug });

// Row types come straight from Drizzle; use these in components.
export type Package = typeof packages.$inferSelect;
export type Departure = typeof departures.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Article = typeof articles.$inferSelect;

export type PackageInsert = z.infer<typeof packageInsertSchema>;
export type DepartureInsert = z.infer<typeof departureInsertSchema>;
export type TestimonialInsert = z.infer<typeof testimonialInsertSchema>;
export type GalleryImageInsert = z.infer<typeof galleryImageInsertSchema>;
export type SiteSettingsUpdate = z.infer<typeof siteSettingsUpdateSchema>;
export type LeadInsert = z.infer<typeof leadInsertSchema>;
export type ArticleInsert = z.infer<typeof articleInsertSchema>;
