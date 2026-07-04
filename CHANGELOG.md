# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning: [SemVer](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-07-04

### Added

- README with setup, verification, and deployment notes.
- Public privacy policy and terms of service pages linked from the footer.
- Sortable package table headers in the admin package list.
- React Icons eye-slash marker for admin schedules hidden from public pages.

- Admin CMS (Phase 2) at /admin: Supabase Auth login with middleware
  guard, dashboard, and full CRUD for packages, departures,
  testimonials, gallery, and site settings. Every mutation is a server
  action that verifies the session, validates with the shared Zod
  schemas, and revalidates the public page on save.
- Image uploads: browser-side resize/compress (canvas → WebP, per-slot
  max widths) to a public Supabase Storage bucket.

- PIHK (haji khusus) license alongside PPIU: new `pihk_license_no`
  column in site settings, shown in the trust bar and footer.

### Changed

- Refined the public footer layout for clearer legal, contact, and WhatsApp conversion information.
- Improved admin mobile layout with wrapping navigation, stacked list headers, phone-width action buttons, smaller mobile cards, and responsive headings.

- Real license numbers (SK PPIU 64/2020, SK PIHK 690/2020) replace the
  seed placeholders.

## [0.1.0] - 2026-07-03

### Added

- Public landing page (Phase 1): hero, trust bar with PPIU license,
  packages, departure schedule, why-us, testimonials, gallery, FAQ,
  closing CTA, footer — all content from Postgres at build time,
  WhatsApp-first CTAs throughout.
- SEO: JSON-LD (TravelAgency + FAQPage), Open Graph metadata.
- Drizzle schema + migrations for packages, departures, testimonials,
  gallery, site settings, leads, articles; RLS enabled on all tables.
- Seed script (`scripts/seed.ts`) with launch content.
- Deployment: Cloudflare Workers via @opennextjs/cloudflare with
  R2-backed ISR cache; CI (lint, typecheck, build) and CD (deploy on
  push to main) via GitHub Actions.
