import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";

import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const [settings] = await getDb()
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));

  if (!settings) {
    return (
      <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/50">
        Baris pengaturan belum ada — jalankan seed terlebih dahulu
        (`node scripts/seed.ts`).
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Pengaturan Website
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Nomor WhatsApp, izin, dan konten utama halaman depan.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
