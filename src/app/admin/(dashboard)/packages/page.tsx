import { asc, desc } from "drizzle-orm";
import Link from "next/link";
import type { ReactNode } from "react";

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

const sortableColumns = {
  sortOrder: packages.sortOrder,
  name: packages.name,
  priceFrom: packages.priceFrom,
  durationDays: packages.durationDays,
  isPublished: packages.isPublished,
} as const;

type SortKey = keyof typeof sortableColumns;
type SortDir = "asc" | "desc";
type PageProps = {
  searchParams: Promise<{ dir?: string; sort?: string }>;
};

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
        href={`/admin/packages?sort=${sort}&dir=${nextDir}`}
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

export default async function PackagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sortKey = isSortKey(params.sort) ? params.sort : "sortOrder";
  const sortDir: SortDir = params.dir === "desc" ? "desc" : "asc";
  const rows = await getDb()
    .select()
    .from(packages)
    .orderBy(
      sortDir === "asc"
        ? asc(sortableColumns[sortKey])
        : desc(sortableColumns[sortKey]),
      asc(packages.id),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          Paket
        </h1>
        <Link
          href="/admin/packages/new"
          className="w-full rounded-full bg-brand-blue px-5 py-2 text-center text-sm font-semibold text-white hover:brightness-110 sm:w-auto"
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
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="name"
                >
                  Nama
                </SortHeader>
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="priceFrom"
                >
                  Harga mulai
                </SortHeader>
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="durationDays"
                >
                  Durasi
                </SortHeader>
                <SortHeader
                  activeDir={sortDir}
                  activeSort={sortKey}
                  sort="isPublished"
                >
                  Status
                </SortHeader>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-ink/5 transition-colors hover:bg-surface/60"
                >
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
