import { asc } from "drizzle-orm";

import { getDb } from "@/db";
import { packages } from "@/db/schema";

import { TestimonialForm } from "../TestimonialForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimoni baru" };

export default async function NewTestimonialPage() {
  const options = await getDb()
    .select({ id: packages.id, name: packages.name })
    .from(packages)
    .orderBy(asc(packages.sortOrder));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Testimoni baru
      </h1>
      <TestimonialForm packageOptions={options} />
    </div>
  );
}
