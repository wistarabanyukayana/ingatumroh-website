"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/db";
import { testimonials } from "@/db/schema";
import {
  bool,
  fieldErrorsFrom,
  num,
  numOrNull,
  requireUser,
  str,
  strOrNull,
  type ActionState,
} from "@/lib/admin";
import { testimonialInsertSchema } from "@/lib/schemas";

export async function saveTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = numOrNull(formData, "id");
  const input = {
    name: str(formData, "name"),
    photoUrl: strOrNull(formData, "photoUrl"),
    quote: str(formData, "quote"),
    packageId: numOrNull(formData, "packageId"),
    isPublished: bool(formData, "isPublished"),
    sortOrder: num(formData, "sortOrder"),
  };

  const parsed = testimonialInsertSchema.safeParse(input);
  if (!parsed.success) return fieldErrorsFrom(parsed.error);

  const db = getDb();
  if (id === null) {
    await db.insert(testimonials).values(parsed.data);
  } else {
    await db
      .update(testimonials)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(testimonials.id, id));
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireUser();
  const id = z.coerce.number().int().parse(formData.get("id"));
  await getDb().delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
