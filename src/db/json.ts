import { z } from "zod";

// Shapes stored in jsonb columns. Defined separately from schema.ts so both
// the Drizzle schema ($type) and the Zod entity schemas can import them
// without a cycle.

export const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().default(""),
});
export type ItineraryDay = z.infer<typeof itineraryDaySchema>;

export const partnerLogoSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().min(1),
});
export type PartnerLogo = z.infer<typeof partnerLogoSchema>;

export const socialsSchema = z.object({
  instagram: z.url().optional(),
  facebook: z.url().optional(),
  tiktok: z.url().optional(),
  youtube: z.url().optional(),
});
export type Socials = z.infer<typeof socialsSchema>;
