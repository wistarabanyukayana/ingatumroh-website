import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "@/db";
import { packages, testimonials } from "@/db/schema";

import { TestimonialForm } from "../TestimonialForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit testimoni" };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const db = getDb();
  const [[testimonial], options] = await Promise.all([
    db.select().from(testimonials).where(eq(testimonials.id, numId)),
    db
      .select({ id: packages.id, name: packages.name })
      .from(packages)
      .orderBy(asc(packages.sortOrder)),
  ]);
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Edit testimoni
      </h1>
      <TestimonialForm testimonial={testimonial} packageOptions={options} />
    </div>
  );
}
