"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import {
  fieldErrorsFrom,
  requireUser,
  str,
  strOrNull,
  type ActionState,
} from "@/lib/admin";
import { siteSettingsUpdateSchema } from "@/lib/schemas";

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const socials = Object.fromEntries(
    (["instagram", "facebook", "tiktok", "youtube"] as const)
      .map((k) => [k, str(formData, `socials.${k}`)])
      .filter(([, v]) => v !== ""),
  );

  const input = {
    whatsappNumber: str(formData, "whatsappNumber"),
    ppiuLicenseNo: str(formData, "ppiuLicenseNo"),
    pihkLicenseNo: strOrNull(formData, "pihkLicenseNo"),
    legalEntity: str(formData, "legalEntity"),
    heroHeadline: str(formData, "heroHeadline"),
    heroSubhead: strOrNull(formData, "heroSubhead"),
    contactEmail: strOrNull(formData, "contactEmail"),
    contactPhone: strOrNull(formData, "contactPhone"),
    address: strOrNull(formData, "address"),
    socials,
  };

  const parsed = siteSettingsUpdateSchema.safeParse(input);
  if (!parsed.success) return fieldErrorsFrom(parsed.error);

  await getDb()
    .update(siteSettings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(siteSettings.id, 1));

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Pengaturan tersimpan dan halaman diperbarui." };
}
