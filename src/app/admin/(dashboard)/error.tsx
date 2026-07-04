"use client";

import Link from "next/link";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
      <p className="text-sm font-bold uppercase tracking-wide text-red-700">
        Admin bermasalah
      </p>
      <h1 className="mt-2 text-2xl font-black">Halaman gagal dimuat.</h1>
      <p className="mt-2 max-w-2xl text-sm text-red-800">
        Coba muat ulang halaman ini. Jika masih gagal, kembali ke dashboard dan
        ulangi dari sana.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-red-700 px-5 py-2 text-sm font-bold text-white hover:bg-red-800"
        >
          Muat ulang
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-red-300 px-5 py-2 text-sm font-bold text-red-800 hover:bg-white"
        >
          Ke dashboard
        </Link>
      </div>
    </div>
  );
}
