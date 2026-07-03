import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "@/db";
import { packages } from "@/db/schema";

import { PackageForm } from "../PackageForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit paket" };

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const [pkg] = await getDb()
    .select()
    .from(packages)
    .where(eq(packages.id, numId));
  if (!pkg) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Edit: {pkg.name}
      </h1>
      <PackageForm pkg={pkg} />
    </div>
  );
}
