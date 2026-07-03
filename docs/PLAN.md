# Ingatumroh Website — Plan

Single-page marketing site + /admin CMS. WhatsApp-driven conversion.
Invariants live in AGENTS.md; this file covers structure, phases, tradeoffs,
risks, and verification.

## Architecture

One Next.js app, two worlds:

- **Public (`/`)** — one statically generated landing page: hero, trust bar
  (PPIU license, legal entity, partner logos), featured packages + departure
  dates, testimonials, gallery, FAQ, footer. All data fetched from Postgres
  **at build/revalidate time only**; served from the R2 incremental cache.
  Every content-editing server action ends with `revalidatePath("/")`.
- **Admin (`/admin`)** — dynamic, behind Supabase Auth (middleware guard).
  CRUD for packages, departures, testimonials, gallery, site settings via
  server actions validated with the shared Zod schemas. Images uploaded to
  Supabase Storage, resized client-side before upload (canvas → WebP;
  hero ≤1920w, cards ≤800w, thumbs/photos ≤400w).

Package `slug` is kept from day one so per-package SEO routes
(`/paket/[slug]`) can be added in Phase 4 without schema change.

## Key decisions & tradeoffs

| Decision | Why | Tradeoff / upgrade path |
|---|---|---|
| `images.unoptimized` + resize at upload | Zero cost, no paid Cloudflare features | No on-the-fly srcset; upgrade to CF Images binding if needed |
| Drizzle over pooler (bypasses RLS) + auth check in actions | One data path, typed end-to-end | RLS is a safety net, not the gate; keep auth checks disciplined |
| drizzle-zod derivation | Schema defined once | jsonb fields need explicit Zod overrides (done in `src/lib/schemas.ts`) |
| Single page now | Matches actual scope | Package detail pages deferred to Phase 4 (slugs already reserved) |
| No shadcn/ui yet | Worker size budget (3 MiB gzip), landing needs little | Add per-component if admin forms get tedious |

## Phases

1. **Public landing page** — all sections, brand styling, schema.org
   (TravelAgency/Offer/FAQPage), OG tags, seeded content. *Verify: Lighthouse
   mobile ≥90 perf/SEO, LCP <2.5s, every CTA opens correct wa.me URL,
   `pnpm deploy` worker ≤3 MiB gzip.*
2. **Admin CMS** — Supabase Auth login, CRUD for all entities, image upload
   with client-side resize, on-demand revalidation. *Verify: unauthenticated
   /admin redirects to login; invalid input rejected by Zod with field
   errors; editing content updates the public page without a redeploy; DB
   unreachable → public page still serves.*
3. **Gallery & testimonials polish** — albums, ordering UI, lightbox.
   *Verify: staff can reorder without touching code.*
4. **Articles + per-package pages** — `/paket/[slug]`, article UI on the
   existing `articles` table, sitemap. *Verify: new package publishes its own
   indexed page.*
5. **Leads + notifications** — optional lead form fallback, Resend email
   notification. *Verify: lead row created + email received.*

Stop points: after each phase, confirm before starting the next.

## Risks

- **Worker size**: Next.js runtime + deps near the 3 MiB gzip free limit.
  Mitigation: check `pnpm deploy` output size in CI habitually; keep admin
  deps server-light; no heavy UI kits.
- **Supabase free-tier pause** (~1 week idle): admin/revalidation break until
  manually resumed; public site unaffected. Acceptable; document for staff.
- **Build-time DB dependency**: `next build` queries Postgres; a paused DB
  fails deploys. Resume DB before deploying.
- **drizzle-zod / Zod 4 edge cases** on jsonb defaults — covered by explicit
  overrides; typecheck is the tripwire.
- **Brand spelling** (Ingatumrah vs Ingatumroh) — unresolved; single constant
  in `src/config/site.ts`.
- **Supabase egress cap** (~5 GB/mo free, unified): public images served
  straight from Supabase Storage count against it. Fine at launch traffic;
  if it becomes the ceiling, move public images to R2 (zero egress, already
  in the stack for ISR) and keep Supabase Storage as the upload/admin store.

## This schema = "Phase ½" of the Delta Laras umroh schema

The 3-phase PT. Delta Laras Wisata schema (`database-schemas/`, Vertabelo/
RedGate exports) is a back-office ops system. This site's schema is a
deliberate tear-down of its **Phase I core** — call it Phase ½ — so the
company can grow incrementally: **½ (this site) → I → II → III**.

Mapping (Phase ½ ↔ Phase I):

| This site | Delta Laras | Notes |
|---|---|---|
| `packages` | `Paket` | + marketing fields (slug, hero, hotels, itinerary…); `description` ↔ `Deskripsi`; `Jenis_Layanan` deferred (umroh-only site) |
| `departures` | `Jadwal` ⋈ `Ketersediaan_Paket` | flattened: one package per departure, single price/quota. Upgrade = data migration splitting rows into schedule + availability |
| `leads` | pre-`Pelanggan` | intake feed for `Pelanggan`/`Pesanan` when ops arrives |
| `testimonials`, `gallery_images`, `site_settings`, `articles` | — | marketing-only, stays the website's layer |
| — | `Cabang`, `Karyawan`, `Agen_Mitra`, `Pesanan`, `Pembayaran` | transactional/back-office; no job on a static WhatsApp-conversion site |

Deliberately **not** adopted now (ops-level, YAGNI for a landing page):
per-schedule multi-package pricing (`Ketersediaan_Paket` junction),
`Sisa_Kuota` seat counting (derived from bookings we don't take), and
`ID_Karyawan` audit FKs (Supabase Auth is the actor; no staff table).

Upgrade recipe (½ → I): keep this Supabase Postgres as the shared DB; port
the Phase I ops tables in (English identifiers, Postgres types); `packages`
remains the single catalog (add ops columns rather than a parallel `Paket`);
migrate `departures` rows into schedule + availability; wire `leads` into
customer intake. Phases II/III then apply as designed.

## Verification (scaffold, this session)

- `pnpm typecheck`, `pnpm lint`, `pnpm build` pass.
- `pnpm db:generate` emits SQL matching the intended model (committed in
  `drizzle/`).
- `pnpm preview` serves the placeholder page in workerd.
