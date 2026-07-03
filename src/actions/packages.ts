"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/db";
import { packages } from "@/db/schema";
import {
  bool,
  fieldErrorsFrom,
  itineraryLines,
  lines,
  num,
  numOrNull,
  requireUser,
  str,
  strOrNull,
  type ActionState,
} from "@/lib/admin";
import { packageInsertSchema } from "@/lib/schemas";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function savePackage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = numOrNull(formData, "id");
  const name = str(formData, "name");
  const input = {
    name,
    slug: str(formData, "slug") || slugify(name),
    description: strOrNull(formData, "description"),
    heroImageUrl: strOrNull(formData, "heroImageUrl"),
    priceFrom: num(formData, "priceFrom"),
    durationDays: num(formData, "durationDays"),
    airline: strOrNull(formData, "airline"),
    hotelMakkah: strOrNull(formData, "hotelMakkah"),
    hotelMakkahStars: numOrNull(formData, "hotelMakkahStars"),
    hotelMadinah: strOrNull(formData, "hotelMadinah"),
    hotelMadinahStars: numOrNull(formData, "hotelMadinahStars"),
    inclusions: lines(formData, "inclusions"),
    exclusions: lines(formData, "exclusions"),
    itinerary: itineraryLines(formData, "itinerary"),
    facilities: lines(formData, "facilities"),
    isFeatured: bool(formData, "isFeatured"),
    isPublished: bool(formData, "isPublished"),
    sortOrder: num(formData, "sortOrder"),
  };

  const parsed = packageInsertSchema.safeParse(input);
  if (!parsed.success) return fieldErrorsFrom(parsed.error);

  const db = getDb();
  try {
    if (id === null) {
      await db.insert(packages).values(parsed.data);
    } else {
      await db
        .update(packages)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(packages.id, id));
    }
  } catch (e) {
    // 23505 = unique violation (slug/name).
    if (e instanceof Error && e.message.includes("duplicate key")) {
      return { ok: false, message: "Nama atau slug paket sudah dipakai." };
    }
    throw e;
  }

  revalidatePath("/");
  revalidatePath("/admin/packages");
  redirect("/admin/packages");
}

export async function deletePackage(formData: FormData): Promise<void> {
  await requireUser();
  const id = z.coerce.number().int().parse(formData.get("id"));
  await getDb().delete(packages).where(eq(packages.id, id));
  revalidatePath("/");
  revalidatePath("/admin/packages");
}
