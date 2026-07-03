import { asc, eq } from "drizzle-orm";
import Link from "next/link";

import { deleteDeparture } from "@/actions/departures";
import { ConfirmSubmit } from "@/components/admin/ui";
import { getDb } from "@/db";
import { departures, packages } from "@/db/schema";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jadwal" };

const tanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const statusLabel: Record<string, string> = {
  open: "Tersedia",
  almost_full: "Hampir penuh",
  full: "Penuh",
  departed: "Berangkat",
  cancelled: "Dibatalkan",
};

export default async function DeparturesPage() {
  const rows = await getDb()
    .select({
      dep: departures,
      packageName: packages.name,
    })
    .from(departures)
    .innerJoin(packages, eq(departures.packageId, packages.id))
    .orderBy(asc(departures.departDate));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Jadwal Keberangkatan
        </h1>
        <Link
          href="/admin/departures/new"
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Jadwal baru
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/50">
          Belum ada jadwal keberangkatan.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-bold">Berangkat</th>
                <th className="px-4 py-3 font-bold">Pulang</th>
                <th className="px-4 py-3 font-bold">Paket</th>
                <th className="px-4 py-3 font-bold">Kuota</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ dep, packageName }) => (
                <tr key={dep.id} className="border-b border-ink/5">
                  <td className="px-4 py-3 font-semibold tabular-nums text-ink">
                    {tanggal.format(dep.departDate)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink/75">
                    {tanggal.format(dep.returnDate)}
                  </td>
                  <td className="px-4 py-3 text-ink/75">{packageName}</td>
                  <td className="px-4 py-3 tabular-nums text-ink/75">
                    {dep.quota}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        dep.status === "open"
                          ? "bg-brand-emerald/10 text-brand-emerald"
                          : dep.status === "almost_full"
                            ? "bg-brand-gold/15 text-brand-gold"
                            : "bg-ink/5 text-ink/50"
                      }`}
                    >
                      {statusLabel[dep.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/departures/${dep.id}`}
                        className="text-sm font-semibold text-brand-blue hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteDeparture}>
                        <input type="hidden" name="id" value={dep.id} />
                        <ConfirmSubmit confirmText="Hapus jadwal keberangkatan ini?">
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
