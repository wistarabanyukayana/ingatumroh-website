"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/db";
import { departures, packages } from "@/db/schema";
import {
  fieldErrorsFrom,
  num,
  numOrNull,
  requireUser,
  str,
  type ActionState,
} from "@/lib/admin";
import {
  inclusiveCalendarDays,
  isoDate,
  jakartaTodayIso,
  parseAdminDate,
} from "@/lib/date";
import { departureInsertSchema } from "@/lib/schemas";

export async function saveDeparture(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const id = numOrNull(formData, "id");
  const departDate = parseAdminDate(str(formData, "departDate"));
  const returnDate = parseAdminDate(str(formData, "returnDate"));

  if (!departDate || !returnDate) {
    const fieldErrors: Record<string, string[]> = {};
    if (!departDate) fieldErrors.departDate = ["Gunakan format DD/MM/YYYY."];
    if (!returnDate) fieldErrors.returnDate = ["Gunakan format DD/MM/YYYY."];

    return {
      ok: false,
      message: "Periksa kembali tanggal keberangkatan.",
      fieldErrors,
    };
  }

  const input = {
    packageId: num(formData, "packageId"),
    departDate,
    returnDate,
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
  if (id === null && isoDate(parsed.data.departDate) < jakartaTodayIso()) {
    return {
      ok: false,
      message: "Tanggal berangkat tidak boleh sebelum hari ini.",
      fieldErrors: { departDate: ["Jadwal lampau tidak tampil di halaman publik."] },
    };
  }

  if (
    parsed.data.status === "departed" &&
    isoDate(parsed.data.departDate) > jakartaTodayIso()
  ) {
    return {
      ok: false,
      message: "Status sudah berangkat hanya untuk jadwal hari ini atau lampau.",
      fieldErrors: {
        status: ["Jika berangkat lebih awal, ubah tanggal berangkat dan pulang dulu."],
      },
    };
  }

  const [pkg] = await db
    .select({ durationDays: packages.durationDays })
    .from(packages)
    .where(eq(packages.id, parsed.data.packageId))
    .limit(1);

  if (!pkg) {
    return {
      ok: false,
      message: "Paket tidak ditemukan.",
      fieldErrors: { packageId: ["Pilih paket yang tersedia."] },
    };
  }

  const scheduledDays = inclusiveCalendarDays(
    parsed.data.departDate,
    parsed.data.returnDate,
  );

  if (scheduledDays < pkg.durationDays) {
    return {
      ok: false,
      message: `Durasi jadwal minimal ${pkg.durationDays} hari sesuai paket.`,
      fieldErrors: {
        returnDate: [`Tanggal pulang minimal ${pkg.durationDays} hari dari berangkat.`],
      },
    };
  }

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
