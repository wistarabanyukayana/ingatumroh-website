import { asc } from "drizzle-orm";
import Link from "next/link";

import { deleteTestimonial } from "@/actions/testimonials";
import { ConfirmSubmit } from "@/components/admin/ui";
import { getDb } from "@/db";
import { testimonials } from "@/db/schema";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimoni" };

export default async function TestimonialsPage() {
  const rows = await getDb()
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Testimoni
        </h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Testimoni baru
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/50">
          Belum ada testimoni.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-ink/10 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {t.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- images.unoptimized
                    <img
                      src={t.photoUrl}
                      alt=""
                      className="size-10 rounded-full object-cover"
                    />
                  )}
                  <p className="font-bold text-ink">{t.name}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    t.isPublished
                      ? "bg-brand-emerald/10 text-brand-emerald"
                      : "bg-ink/5 text-ink/50"
                  }`}
                >
                  {t.isPublished ? "Tayang" : "Draf"}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-ink/70">
                “{t.quote}”
              </p>
              <div className="mt-4 flex items-center gap-4">
                <Link
                  href={`/admin/testimonials/${t.id}`}
                  className="text-sm font-semibold text-brand-blue hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <ConfirmSubmit
                    confirmText={`Hapus testimoni dari "${t.name}"?`}
                  >
                    Hapus
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
