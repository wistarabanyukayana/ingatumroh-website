import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { logout } from "@/actions/auth";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { KaabaMark } from "@/components/KaabaMark";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s | Admin ${site.name}` },
  robots: { index: false, follow: false },
};

const nav = [
  ["Dasbor", "/admin"],
  ["Paket", "/admin/packages"],
  ["Jadwal", "/admin/departures"],
  ["Testimoni", "/admin/testimonials"],
  ["Galeri", "/admin/gallery"],
  ["Pengaturan", "/admin/settings"],
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="size-7">
              <KaabaMark />
            </span>
            <span className="font-extrabold tracking-tight text-brand-blue">
              {site.name}
            </span>
            <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-gold">
              Admin
            </span>
          </Link>
          <nav className="order-3 -mx-4 flex w-[calc(100%+2rem)] items-center gap-1 overflow-x-auto px-4 text-sm font-medium text-ink/70 sm:order-none sm:mx-0 sm:w-auto sm:px-0">
            {nav.map(([label, href]) => (
              <AdminNavLink key={href} href={href}>
                {label}
              </AdminNavLink>
            ))}
            <form action={logout}>
              <button
                type="submit"
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-red-600 hover:bg-red-50"
              >
                Keluar
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-ink/40 sm:px-6 lg:px-8">
        Perubahan tersimpan langsung memperbarui halaman publik.{" "}
        <a href="/" target="_blank" className="font-semibold text-brand-blue">
          Lihat website →
        </a>
      </footer>
    </div>
  );
}
