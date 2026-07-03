"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/db";
import { galleryImages } from "@/db/schema";
import {
  bool,
  fieldErrorsFrom,
  num,
  requireUser,
  str,
  strOrNull,
  type ActionState,
} from "@/lib/admin";
import { galleryImageInsertSchema } from "@/lib/schemas";

export async function addGalleryImage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const input = {
    imageUrl: str(formData, "imageUrl"),
    caption: strOrNull(formData, "caption"),
    album: strOrNull(formData, "album"),
    isPublished: bool(formData, "isPublished"),
    sortOrder: num(formData, "sortOrder"),
  };

  const parsed = galleryImageInsertSchema.safeParse(input);
  if (!parsed.success) return fieldErrorsFrom(parsed.error);

  await getDb().insert(galleryImages).values(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { ok: true, message: "Foto ditambahkan ke galeri." };
}

export async function toggleGalleryImage(formData: FormData): Promise<void> {
  await requireUser();
  const id = z.coerce.number().int().parse(formData.get("id"));
  const publish = formData.get("publish") === "true";
  await getDb()
    .update(galleryImages)
    .set({ isPublished: publish, updatedAt: new Date() })
    .where(eq(galleryImages.id, id));
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(formData: FormData): Promise<void> {
  await requireUser();
  const id = z.coerce.number().int().parse(formData.get("id"));
  await getDb().delete(galleryImages).where(eq(galleryImages.id, id));
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
