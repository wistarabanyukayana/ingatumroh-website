import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { site } from "@/config/site";

import "./globals.css";

// Indonesian-designed typeface (Tokotype) — geometric-rounded like the logo
// wordmark. Self-hosted by next/font at build time; no runtime requests.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Umroh Amanah & Berizin Resmi`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Umroh Amanah & Berizin Resmi`,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
