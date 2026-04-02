# ClawGuru - Mycelial Singularity Engine v4.0

AI-native security operations platform with executable runbooks, localization-first SEO architecture, and a geo-adaptive content matrix.

[![Live Demo](https://img.shields.io/badge/Live_Demo-clawguru.org-FF0033?style=for-the-badge&logo=next.js)](https://clawguru.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Postgres-Neon-00D4FF?style=for-the-badge)](https://neon.tech)

---

## What is in this repo

ClawGuru combines:

- an executable runbook system for cloud/security incidents,
- AI-assisted tools and assistants (`/check`, `/copilot`, `/oracle`, `/summon`, `/neuro`),
- multi-locale pages and metadata for international discovery,
- programmatic SEO infrastructure with quality guardrails,
- a Geo-Living Matrix pipeline for city-aware runbook variants.

---

## Core capabilities

### Product

- Command-center style dashboard and admin analytics surfaces.
- Viral feature: `Roast My Stack` with share-focused output and OG support.
- Persistent funnel analytics for `/check` events in Postgres.

### SEO and content system

- 15 supported locales (`de`, `en`, `es`, `fr`, `pt`, `it`, `ru`, `zh`, `ja`, `ar`, `nl`, `hi`, `tr`, `pl`, `ko`).
- Locale-aware canonical/hreflang alternates through shared i18n utilities.
- Modular sitemap architecture with geo expansion controls.
- Canonical regression guard: `npm run check:seo-canonicals`.

### Geo-Living Matrix

- Geo profile detection in middleware (edge headers + accept-language fallback).
- Geo variant slug handling (`/de/runbook/<base>-<city>`).
- AI-generated localized runbook overlays (provider/compliance/local intent aware).
- Persistence to `geo_variant_matrix` for quality tracking and ops automation.
- Canary-to-stable rollout controls, guarded live automation, and revalidation hooks.

---

## Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **AI:** Gemini (provider orchestration in `lib/ai/providers.ts`)
- **Database:** PostgreSQL (`pg`) + SQL migration runner in `scripts/db/migrate.js`
- **Cache:** Next cache + optional Redis/Upstash for geo city data
- **UI:** React, Tailwind, Framer Motion, Three.js/R3F
- **Payments:** Stripe
- **E2E tests:** Playwright

---

## Quick start

### 1) Install

```bash
git clone https://github.com/Schwerti09/clawguru-seo-monster-gemini.git
cd clawguru-seo-monster-gemini
npm install
```

### 2) Configure env

```bash
cp .env.example .env.local
```

Set at least:

- `DATABASE_URL`
- AI provider key(s) used by your environment
- optional cache/ops secrets as needed

### 3) Migrate database

```bash
npm run db:migrate
```

### 4) Run locally

```bash
npm run dev
```

App starts on [http://localhost:3000](http://localhost:3000).

---

## Important scripts

### Quality and SEO checks

- `npm run check:i18n`
- `npm run check:seo-canonicals`
- `npm run check:sitemap-redirects`
- `npm run check:prod-smoke`

### Geo operations

- `npm run check:geo-ops-readiness`
- `npm run geo:sitemap-guardrail:dry-run`
- `npm run geo:canary-rollout:dry-run`
- `npm run geo:auto-promotion:dry-run`
- `npm run geo:ops-cycle:dry-run`
- `npm run geo:ops-live-guard`

Detailed runbook: `docs/geo-ops-runbook.md`.

---

## Deployment notes

- Netlify and CI pipelines are active.
- Vercel workflow now safely skips deploy when `VERCEL_TOKEN` is not configured.
- If you want Vercel production deploys, add `VERCEL_TOKEN` in GitHub secrets.

---

## Project structure (high-level)

- `app/` - routes, metadata, API handlers
- `components/` - UI and feature components
- `lib/` - domain logic (AI, i18n, geo, SEO, analytics)
- `scripts/` - checks, ops triggers, migrations
- `docs/` - operational runbooks and project docs

---

## Contributing

PRs are welcome. Focus areas:

- runbook quality and factual accuracy,
- SEO/index quality and metadata integrity,
- geo rollout safety and observability,
- performance and UX improvements.

---

## License

MIT - 2026 ClawGuru contributors
