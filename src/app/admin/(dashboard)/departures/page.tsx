import { asc, desc, eq } from "drizzle-orm";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";

import { deleteDeparture } from "@/actions/departures";
import { ConfirmSubmit } from "@/components/admin/ui";
import { getDb } from "@/db";
import { departures, packages } from "@/db/schema";
import { isoDate, jakartaTodayIso } from "@/lib/date";

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

const sortableColumns = {
  departDate: departures.departDate,
  returnDate: departures.returnDate,
  package: packages.name,
  quota: departures.quota,
  status: departures.status,
} as const;

type SortKey = keyof typeof sortableColumns;
type SortDir = "asc" | "desc";
type PageProps = {
  searchParams: Promise<{ dir?: string; sort?: string }>;
};

const staleReason =
  "Tanggal berangkat sudah lewat, tetapi status belum Sudah berangkat atau Dibatalkan. Jadwal ini tidak tampil di halaman publik.";

const hiddenReason =
  "Ikon ini berarti jadwal disembunyikan dari publik karena tanggal berangkat sudah lewat dan statusnya belum diperbarui.";

function isSortKey(value: string | undefined): value is SortKey {
  return value !== undefined && value in sortableColumns;
}

function SortHeader({
  activeDir,
  activeSort,
  children,
  sort,
}: {
  activeDir: SortDir;
  activeSort: SortKey;
  children: ReactNode;
  sort: SortKey;
}) {
  const isActive = activeSort === sort;
  const nextDir: SortDir = isActive && activeDir === "asc" ? "desc" : "asc";

  return (
    <th className="px-4 py-3 font-bold">
      <Link
        href={`/admin/departures?sort=${sort}&dir=${nextDir}`}
        className="inline-flex items-center gap-1.5 rounded-md text-ink/60 transition hover:text-ink focus:outline-2 focus:outline-brand-blue"
      >
        <span>{children}</span>
        <span className="text-[10px]" aria-hidden="true">
          {isActive ? (activeDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </Link>
    </th>
  );
}

function TooltipPill({
  children,
  className,
  label,
  tooltip,
}: {
  children?: ReactNode;
  className: string;
  label: string;
  tooltip: string;
}) {
  return (
    <details className="group relative inline-block">
      <summary
        aria-label={label}
        className={`list-none cursor-help [&::-webkit-details-marker]:hidden ${className}`}
        title={tooltip}
      >
        {children ?? label}
      </summary>
      <span className="absolute left-0 z-20 mt-2 hidden w-64 rounded-lg border border-ink/10 bg-white p-3 text-xs font-medium normal-case leading-relaxed text-ink shadow-lg group-open:block group-hover:block">
        {tooltip}
      </span>
    </details>
  );
}

export default async function DeparturesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sortKey = isSortKey(params.sort) ? params.sort : "departDate";
  const sortDir: SortDir = params.dir === "desc" ? "desc" : "asc";
  const today = jakartaTodayIso();
  const rows = await getDb()
    .select({
      dep: departures,
      packageName: packages.name,
    })
    .from(departures)
    .innerJoin(packages, eq(departures.packageId, packages.id))
    .orderBy(
      sortDir === "asc"
        ? asc(sortableColumns[sortKey])
        : desc(sortableColumns[sortKey]),
      asc(departures.id),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          Jadwal Keberangkatan
        </h1>
        <Link
          href="/admin/departures/new"
          className="w-full rounded-full bg-brand-blue px-5 py-2 text-center text-sm font-semibold text-white hover:brightness-110 sm:w-auto"
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
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="departDate"
                >
                  Berangkat
                </SortHeader>
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="returnDate"
                >
                  Pulang
                </SortHeader>
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="package"
                >
                  Paket
                </SortHeader>
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="quota"
                >
                  Kuota
                </SortHeader>
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="status"
                >
                  Status
                </SortHeader>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ dep, packageName }) => {
                const needsUpdate =
                  isoDate(dep.departDate) < today &&
                  dep.status !== "departed" &&
                  dep.status !== "cancelled";

                return (
                  <tr
                    key={dep.id}
                    className="border-b border-ink/5 transition-colors hover:bg-surface/60"
                  >
                    <td className="px-4 py-3 font-semibold tabular-nums text-ink">
                      <div className="flex items-center gap-2">
                        {needsUpdate && (
                          <TooltipPill
                            className="inline-grid h-8 w-8 place-items-center rounded-full border border-ink/10 bg-ink/5 text-ink/45 transition hover:text-ink"
                            label="Tidak tampil di publik"
                            tooltip={hiddenReason}
                          >
                            <FaRegEyeSlash className="h-4 w-4" />
                          </TooltipPill>
                        )}
                        <span>{tanggal.format(dep.departDate)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink/75">
                      {tanggal.format(dep.returnDate)}
                    </td>
                    <td className="px-4 py-3 text-ink/75">{packageName}</td>
                    <td className="px-4 py-3 tabular-nums text-ink/75">
                      {dep.quota}
                    </td>
                    <td className="px-4 py-3">
                      {needsUpdate ? (
                        <TooltipPill
                          className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700"
                          label="Perlu Diperbarui"
                          tooltip={staleReason}
                        />
                      ) : (
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
                      )}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
