import { asc } from "drizzle-orm";
import Link from "next/link";

import { deletePackage } from "@/actions/packages";
import { ConfirmSubmit } from "@/components/admin/ui";
import { getDb } from "@/db";
import { packages } from "@/db/schema";

export const dynamic = "force-dynamic";
export const metadata = { title: "Paket" };

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function PackagesPage() {
  const rows = await getDb()
    .select()
    .from(packages)
    .orderBy(asc(packages.sortOrder), asc(packages.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Paket
        </h1>
        <Link
          href="/admin/packages/new"
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Paket baru
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/50">
          Belum ada paket. Buat paket pertama Anda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-bold">Nama</th>
                <th className="px-4 py-3 font-bold">Harga mulai</th>
                <th className="px-4 py-3 font-bold">Durasi</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-ink/5">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-ink">{p.name}</span>
                    {p.isFeatured && (
                      <span className="ml-2 rounded-full bg-brand-gold/15 px-2 py-0.5 text-[10px] font-bold text-brand-gold">
                        Favorit
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink/75">
                    {idr.format(p.priceFrom)}
                  </td>
                  <td className="px-4 py-3 text-ink/75">
                    {p.durationDays} hari
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        p.isPublished
                          ? "bg-brand-emerald/10 text-brand-emerald"
                          : "bg-ink/5 text-ink/50"
                      }`}
                    >
                      {p.isPublished ? "Tayang" : "Draf"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/packages/${p.id}`}
                        className="text-sm font-semibold text-brand-blue hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deletePackage}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmSubmit
                          confirmText={`Hapus paket "${p.name}"? Jadwal keberangkatannya ikut terhapus.`}
                        >
                          Hapus
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
