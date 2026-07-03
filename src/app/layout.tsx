import type { Metadata } from "next";
import type { ReactNode } from "react";

import { site } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Umroh Amanah & Berizin Resmi`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
