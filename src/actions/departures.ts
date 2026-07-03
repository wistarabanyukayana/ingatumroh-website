"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/db";
import { departures } from "@/db/schema";
import {
  fieldErrorsFrom,
  num,
  numOrNull,
  requireUser,
  str,
  type ActionState,
} from "@/lib/admin";
import { departureInsertSchema } from "@/lib/schemas";

export async function saveDeparture(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = numOrNull(formData, "id");
  const input = {
    packageId: num(formData, "packageId"),
    departDate: new Date(str(formData, "departDate")),
    returnDate: new Date(str(formData, "returnDate")),
    quota: num(formData, "quota"),
    status: str(formData, "status"),
  };

  const parsed = departureInsertSchema.safeParse(input);
  if (!parsed.success) return fieldErrorsFrom(parsed.error);
  if (parsed.data.returnDate < parsed.data.departDate) {
    return {
      ok: false,
      message: "Tanggal pulang tidak boleh sebelum tanggal berangkat.",
      fieldErrors: { returnDate: ["Periksa tanggal pulang."] },
    };
  }

  const db = getDb();
  if (id === null) {
    await db.insert(departures).values(parsed.data);
  } else {
    await db
      .update(departures)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(departures.id, id));
  }

  revalidatePath("/");
  revalidatePath("/admin/departures");
  redirect("/admin/departures");
}

export async function deleteDeparture(formData: FormData): Promise<void> {
  await requireUser();
  const id = z.coerce.number().int().parse(formData.get("id"));
  await getDb().delete(departures).where(eq(departures.id, id));
  revalidatePath("/");
  revalidatePath("/admin/departures");
}
