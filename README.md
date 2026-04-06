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

## Current SEO/Geo Execution Status (Apr 2026)

### Done

- `Roast My Stack` i18n pass shipped across all 15 locales; hardcoded EN UI remnants removed.
- Dedicated `Roast My Moltbot` landing route live at `/[lang]/roast-my-moltbot`, wired into homepage/openclaw link flows.
- Dedicated localized landing routes live: `/[lang]/openclaw`, `/[lang]/openclaw-security-check`, `/[lang]/moltbot-hardening`, `/[lang]/ai-agent-security`.
- Legacy intent redirects active in middleware: `/moltbot` and `/clawbot` (including localized variants) to canonical landing targets.
- Homepage CRO updates shipped (3-step exposure-to-fix narrative, locale-aware CTA copy, sticky mobile CTA, explicit "not a pentest" trust framing).
- Canonical/hreflang standardization and SEO guardrails operational (`npm run check:seo-canonicals`).
- 8-week content queue operationalized with shipped indexable pages under `/[lang]/...` and enforced internal-link patterning.
- Geo auth + dry-run/live trigger path validated for canary/guardrail scripts; 500-limit rollout tests executed safely.
- City-ranking canary-union fix landed and validated in production flow (top-N + canary DB union for reliable promotion eligibility checks).
- Controlled first canary-to-stable promotion wave executed; post-promotion lock and decision-gated runbook process documented.

### In progress

- Editorial premium-quality pass for locale copy (especially `roast` and landing-page nuance by market).
- Final D4 matrix commit and traffic activation gate execution (operator decision template and GO/NO-GO flow tracked in `AGENTS.md` §106).

### Open

- D4 matrix commit in production, followed by seed commit and fresh §46 GO cycle for the next live promotion wave.
- Daily/ops automation hardening for Killermachine v2/v3 (self-healing checks, report reliability, and promotion gateing).

Reference source of truth for strategy and rollout state: `AGENTS.md`.

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

**Core**
- `DATABASE_URL` – PostgreSQL connection string (Neon recommended)
- `NEXT_PUBLIC_SITE_URL` – full URL incl. protocol, e.g. `https://clawguru.org`

**Payments (Stripe)**
- `STRIPE_SECRET_KEY` – Stripe secret key (`sk_live_...` / `sk_test_...`)
- `STRIPE_PUBLISHABLE_KEY` – Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` – Stripe webhook signing secret (`whsec_...`)
- `STRIPE_PRICE_PRO` – Stripe Price ID for Pro plan
- `STRIPE_PRICE_TEAM` – Stripe Price ID for Team plan
- `STRIPE_PRICE_DAYPASS` – Stripe Price ID for Day Pass
- `STRIPE_PRICE_ENTERPRISE` – (optional) Enterprise Price ID

**Dashboard auth**
- `ACCESS_TOKEN_SECRET` – min. 32 bytes, used to sign `claw_access` JWT cookies

**Rate limiting (optional – falls back to in-memory)**
- `UPSTASH_REDIS_REST_URL` – Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` – Upstash Redis REST token

**Email**
- `EMAIL_FROM` – sender address for transactional emails
- `RESEND_API_KEY` or `SMTP_*` – depending on email provider

**AI**
- `GEMINI_API_KEY` – or other provider key(s) used by `lib/ai/providers.ts`

**Geo ops secrets**
- `GEO_CANARY_ROLLOUT_SECRET`
- `GEO_SITEMAP_GUARDRAIL_SECRET`
- `GEO_AUTO_PROMOTION_SECRET`
- `GEO_REVALIDATE_SECRET`
- `GEO_REVALIDATE_SLUGS`
- `GEO_EXPANSION_SECRET`

- `ANALYTICS_WRITE_KEY` (if analytics write path is enabled)

On Windows, `.env.local` may be hidden in Explorer; use terminal (`dir /a`) or your editor's file list to open it.

### 3) Migrate database

```bash
npm run db:migrate
```

Applies all pending migrations from `scripts/db/migrations/` in order.
Already-applied migrations are skipped (idempotent). Current migrations:

| File | What it does |
|------|--------------|
| `001_init.sql` | Base schema |
| `002_gsc_metrics.sql` | GSC metrics |
| `003_dashboard.sql` | `runbook_executions`, `threats`, `mycelium_nodes` |
| `004–008` | Geo pipeline tables |
| `009_dashboard_customer_scoping.sql` | Adds `customer_id` to `threats` + `mycelium_nodes` |
| `010_customer_entitlements.sql` | `customer_entitlements` table (Stripe → DB entitlement sync) |

### 4) Run locally

```bash
npm run dev
```

App starts on [http://localhost:3000](http://localhost:3000).

---

## Dashboard / Cockpit

The paid dashboard at `/dashboard` is the customer-facing Mission Control.

### Payment → access flow

1. User visits `/pricing` → clicks **Buy** → Stripe Checkout
2. On success → `/api/auth/activate?session_id=…` verifies payment, signs a JWT, sets `claw_access` cookie
3. Cookie expiry: **24 h** (Day Pass) / **30 days** (Pro / Team)
4. Stripe webhook (`checkout.session.completed`) additionally sends a **Magic Link** email with a fresh token
5. On monthly renewal (`invoice.paid` + `billing_reason=subscription_cycle`): new Magic Link + DB entitlement refreshed
6. On cancellation (`customer.subscription.deleted`): DB entitlement revoked immediately; cookie expires naturally

### Tiers

| Tier | Plan value | Features |
|------|-----------|----------|
| Explorer | – (no cookie) | Read-only, locked tabs |
| Day Pass | `daypass` | All tools, 24 h |
| Pro | `pro` | All tools, unlimited, 30 d renewable |
| Team | `team` | Pro + team features (sharing coming soon) |

### Dashboard tools (real deliverables)

| Tool ID | What it actually does |
|---------|----------------------|
| `check` | HTTP header security scan via `lib/security-check-core.ts`; returns score 0–100, findings, recommendations |
| `oracle` | Queries top-5 runbooks by quality score from `geo_variant_matrix` |
| `summon` | Reads user's own execution history; returns posture summary (success rate, active threats) |
| `neuro` | Analyzes execution patterns from DB; returns dominant tool + insight |

Each tool run inserts one row in `runbook_executions`, one in `mycelium_nodes`, and one audit `threat` (severity: low).

### Tier priority (effectiveTier resolution)

```
Stripe active subscription → customer_entitlements DB → JWT cookie plan
```

### Rate limiting

20 requests / 60 s per `IP:customerKey`. Uses Upstash Redis when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set; falls back to in-memory (not shared across serverless instances).

### E2E tests

```bash
npm run test:e2e           # headless Chromium
npm run test:e2e:ui        # Playwright UI
```

Key spec: `e2e/payment-flow/tool-execution-happy-path.spec.ts` — tests 401/400/200/503 API contracts + UI smoke (skipped if `DATABASE_URL` absent).

---

## Important scripts

### Quality and SEO checks

- `npm run check:i18n`
- `npm run check:seo-canonicals`
- `npm run check:sitemap-redirects`
- `npm run check:prod-smoke`

### Geo operations

- `npm run check:geo-ops-readiness`
- `npm run check:geo-rollout-status`
- `npm run geo:sitemap-guardrail:dry-run`
- `npm run geo:canary-rollout:dry-run`
- `npm run geo:top-city-expansion:dry-run`
- `npm run geo:auto-promotion:dry-run`
- `npm run geo:ops-cycle:dry-run`
- `npm run geo:ops-live-guard`

Detailed runbook: `docs/geo-ops-runbook.md`.

Typical high-volume dry-run pattern (all locales, score-threshold tuning) is documented in `AGENTS.md` §10.

### Autonomous ops loop

Killermachine operations evolved from the v1 template to v2/v3 gated loops with explicit decision logs and lock semantics.
Use `AGENTS.md` as the canonical source of truth for the current execution gate (latest: `AGENTS.md` §106).

### Embeddable Moltbot widget

- Package source: `extension/widget`
- Package name: `clawguru-moltbot-hardener`
- Quick embed:
  - `<script src="https://unpkg.com/clawguru-moltbot-hardener/index.js"></script>`
  - `<div data-clawguru-moltbot-widget data-locale="en"></div>`
- Local hosted embed (immediate):
  - `<script src="https://clawguru.org/widgets/clawguru-moltbot-hardener.js"></script>`
- Distribution kit (OpenClaw README / Discord / skill registry snippets):
  - `docs/moltbot-widget-distribution.md`

---

## Deployment notes

- **Primary hosting:** Vercel (production env vars live in the Vercel project).
- Netlify-related artifacts (e.g. `netlify.env.import.template`) are **optional** — for CI or a possible future Netlify migration, not the default secret source.
- Vercel workflow safely skips deploy when `VERCEL_TOKEN` is not configured.
- For GitHub-driven Vercel deploys, add `VERCEL_TOKEN` in GitHub secrets when needed.

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
