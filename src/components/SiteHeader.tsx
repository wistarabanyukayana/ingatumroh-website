"use client";

import { useEffect, useState } from "react";

import { KaabaMark } from "@/components/KaabaMark";
import { WaIcon } from "@/components/Wa";
import { site, waLink } from "@/config/site";

const NAV = [
  ["Paket", "#paket"],
  ["Jadwal", "#jadwal"],
  ["Testimoni", "#testimoni"],
  ["FAQ", "#faq"],
] as const;

export function SiteHeader({ wa }: { wa: string }) {
  const [open, setOpen] = useState(false);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const consult = waLink(
    wa,
    "Assalamu'alaikum, saya ingin konsultasi paket umroh.",
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#beranda"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="size-8">
            <KaabaMark />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-brand-blue">
            {site.name}
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/70 md:flex">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative transition-colors hover:text-brand-blue"
            >
              {label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href={consult}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-emerald px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <WaIcon className="size-4" />
            Konsultasi
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={open}
          className="p-2 text-ink md:hidden"
          onClick={() => setOpen(!open)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-7"
            aria-hidden
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-ink/40 md:hidden"
        />
      )}
      <div
        className={`absolute left-0 top-full z-50 w-full overflow-hidden bg-white shadow-xl transition-all duration-300 md:hidden ${
          open
            ? "visible max-h-96 border-b border-ink/10 py-3 opacity-100"
            : "invisible max-h-0 opacity-0"
        }`}
      >
        {NAV.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="block px-6 py-3 font-semibold text-ink transition-colors hover:text-brand-blue"
          >
            {label}
          </a>
        ))}
        <div className="px-6 pb-3 pt-2">
          <a
            href={consult}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-full bg-brand-emerald px-5 py-3 font-semibold text-white"
          >
            <WaIcon />
            Konsultasi via WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
