import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "@/db";
import { departures, packages } from "@/db/schema";

import { DepartureForm } from "../DepartureForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit jadwal" };

export default async function EditDeparturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const db = getDb();
  const [[departure], options] = await Promise.all([
    db.select().from(departures).where(eq(departures.id, numId)),
    db
      .select({ id: packages.id, name: packages.name })
      .from(packages)
      .orderBy(asc(packages.sortOrder)),
  ]);
  if (!departure) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Edit jadwal
      </h1>
      <DepartureForm departure={departure} packageOptions={options} />
    </div>
  );
}
