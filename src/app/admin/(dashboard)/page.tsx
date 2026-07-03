import { count, eq } from "drizzle-orm";
import Link from "next/link";

import { getDb } from "@/db";
import {
  departures,
  galleryImages,
  packages,
  testimonials,
} from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = getDb();
  const [pkg, dep, tst, gal] = await Promise.all([
    db.select({ n: count() }).from(packages),
    db
      .select({ n: count() })
      .from(departures)
      .where(eq(departures.status, "open")),
    db
      .select({ n: count() })
      .from(testimonials)
      .where(eq(testimonials.isPublished, true)),
    db
      .select({ n: count() })
      .from(galleryImages)
      .where(eq(galleryImages.isPublished, true)),
  ]);

  const stats = [
    ["Paket", pkg[0]?.n ?? 0, "/admin/packages"],
    ["Jadwal terbuka", dep[0]?.n ?? 0, "/admin/departures"],
    ["Testimoni tayang", tst[0]?.n ?? 0, "/admin/testimonials"],
    ["Foto galeri", gal[0]?.n ?? 0, "/admin/gallery"],
  ] as const;

  const quick = [
    ["+ Paket baru", "/admin/packages/new"],
    ["+ Jadwal baru", "/admin/departures/new"],
    ["+ Testimoni baru", "/admin/testimonials/new"],
    ["+ Foto galeri", "/admin/gallery"],
    ["Edit pengaturan", "/admin/settings"],
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Dasbor
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Kelola konten website — perubahan langsung tayang setelah disimpan.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([label, n, href]) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-brand-blue/40"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
              {label}
            </p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-brand-blue">
              {n}
            </p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink/50">
          Aksi cepat
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {quick.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-dashed border-ink/25 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-brand-blue hover:text-brand-blue"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
