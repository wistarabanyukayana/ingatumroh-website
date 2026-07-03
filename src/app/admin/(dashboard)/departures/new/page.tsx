import { asc } from "drizzle-orm";

import { getDb } from "@/db";
import { packages } from "@/db/schema";

import { DepartureForm } from "../DepartureForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jadwal baru" };

export default async function NewDeparturePage() {
  const options = await getDb()
    .select({ id: packages.id, name: packages.name })
    .from(packages)
    .orderBy(asc(packages.sortOrder));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Jadwal baru
      </h1>
      {options.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/50">
          Buat paket terlebih dahulu sebelum menambah jadwal.
        </p>
      ) : (
        <DepartureForm packageOptions={options} />
      )}
    </div>
  );
}
