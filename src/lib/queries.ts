import { and, asc, eq, gte, inArray } from "drizzle-orm";

import { getDb } from "@/db";
import {
  departures,
  galleryImages,
  packages,
  siteSettings,
  testimonials,
} from "@/db/schema";
import { jakartaTodayDate } from "@/lib/date";

// Read model for the public landing page. Runs at build/revalidate time
// only (the page is force-static) — never on a visitor request.
export async function getLandingData() {
  const db = getDb();

  const [settings] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));

  const pkgs = await db
    .select()
    .from(packages)
    .where(eq(packages.isPublished, true))
    .orderBy(asc(packages.sortOrder), asc(packages.id));

  // "Today" freezes at build time; admin mutations revalidate the page,
  // which is also when departure lists actually change.
  const deps = pkgs.length
    ? await db
        .select()
        .from(departures)
        .where(
          and(
            inArray(
              departures.packageId,
              pkgs.map((p) => p.id),
            ),
            inArray(departures.status, ["open", "almost_full"]),
            gte(departures.departDate, jakartaTodayDate()),
          ),
        )
        .orderBy(asc(departures.departDate))
    : [];

  const testis = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));

  const gallery = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.isPublished, true))
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));

  return {
    settings: settings ?? null,
    packages: pkgs,
    departures: deps,
    testimonials: testis,
    gallery,
  };
}

export type LandingData = Awaited<ReturnType<typeof getLandingData>>;
