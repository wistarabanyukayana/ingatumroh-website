# Ingatumroh Website

Marketing landing page and lightweight admin CMS for an Indonesian umroh travel
agency. Public traffic is static/ISR on Cloudflare Workers; admin mutations use
Supabase Auth plus Drizzle/Postgres server actions.

## Stack

- Next.js 16 App Router
- Cloudflare Workers via `@opennextjs/cloudflare`
- Supabase Postgres, Auth, and Storage
- Drizzle ORM, drizzle-zod, Zod 4
- Tailwind CSS 4
- pnpm

## Setup

```bash
pnpm install
pnpm dev
```

Create `.env` with the required local environment:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Wrangler configuration provides the public Supabase values for Workers. Keep
secrets such as `DATABASE_URL` out of committed files.

## Commands

```bash
pnpm dev        # local Next.js dev server
pnpm typecheck  # TypeScript
pnpm lint       # ESLint
pnpm build      # Next.js build
pnpm preview    # OpenNext build + local Workers preview
pnpm deploy     # OpenNext build + Cloudflare deploy
```

Database:

```bash
pnpm db:generate
pnpm db:migrate
```

## Deployment

The production target is Cloudflare Workers. GitHub Actions runs CI on pushes
and pull requests. The release workflow runs from version tags and deploys with
Cloudflare credentials from repository secrets.

Manual deploy:

```bash
pnpm deploy
```

Tag release:

```bash
git tag v0.1.1
git push origin v0.1.1
```

## Project Notes

- Public pages must not hit Postgres at request time.
- Editable staff content belongs in the database, not hardcoded components.
- CTA links must use `waLink()` with the WhatsApp number from site settings.
- Keep new dependencies small; the Worker must stay within the free-tier size
  budget.

See `AGENTS.md` and `docs/PLAN.md` for the detailed project rules and roadmap.
