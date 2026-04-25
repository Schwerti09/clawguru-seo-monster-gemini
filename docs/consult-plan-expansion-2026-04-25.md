# Consult Plan Expansion — 2026-04-25

## Goal

Expand and harden the `/consulting` conversion path so it is operationally consistent with checkout logic, easier to measure, and safer for SEO rollout.

## Scope Implemented

1. Unified plan-to-checkout mapping in `lib/autopilot-offering.ts`
2. Upgraded `/[lang]/consulting` pricing CTAs:
   - Starter and Pro now go directly to Stripe checkout
   - Scale stays high-intent and routes to booking (Cal.com/mail fallback)
3. SEO indexing rules updated so localized `pricing` and `consulting` routes are not suppressed by default locale-guard noindex logic
4. Sitemap expanded with explicit `/{locale}/consulting` entries
5. Unit tests extended for new plan mapping and locale-aware price formatting

## Why These Changes

### 1) Single source of truth for plan mapping

`BuyButton` previously had an internal, duplicate plan mapping function (`starter` -> `daypass`, `pro` -> `pro`, `scale` -> `team`).
This mapping now lives in `lib/autopilot-offering.ts` via:

- `mapAutopilotPlanToCheckoutProduct()`
- `formatAutopilotPlanMonthlyPrice()`

This prevents logic drift between recommendation logic and checkout payloads.

### 2) Consulting page conversion is now tier-aware

`app/[lang]/consulting/page.tsx` now uses mixed CTA strategy by plan intent:

- **Starter / Pro:** direct transactional CTA via `BuyButton` (faster conversion path)
- **Scale:** consultative CTA via `BookingButton` (demo/sales flow)

This aligns with the product-led + sales-assisted split:

- low-friction self-serve for lower tiers
- guided flow for enterprise-like needs

### 3) Locale SEO noindex carve-out for revenue pages

`middleware.ts` noindex guard now explicitly treats localized:

- `/{locale}/pricing`
- `/{locale}/consulting`

as indexable routes.

This avoids accidental crawl suppression of core monetization pages in locale rollouts.

### 4) Sitemap discoverability fix

`app/sitemaps/[name]/route.ts` now includes:

- `/{locale}/consulting`

in main locale chunks, improving crawl discoverability and canonical URL discovery.

## Files Changed

- `lib/autopilot-offering.ts`
- `components/commerce/BuyButton.tsx`
- `app/[lang]/consulting/page.tsx`
- `middleware.ts`
- `app/sitemaps/[name]/route.ts`
- `__tests__/autopilot-offering.test.ts`

## Validation Checklist

- [x] Autopilot plan mapping test coverage includes checkout mapping
- [x] Price format helper test coverage includes DE/EN formatting
- [x] `/consulting` plan cards route Starter/Pro to checkout and Scale to booking
- [x] sitemap includes localized `/consulting`
- [x] middleware route guard includes localized `/consulting` and `/pricing`
- [x] booking_click events are visible in admin funnel/profit analytics

## Consult analytics follow-up (2026-04-25)

To continue the 7consult rollout with measurable outcomes, consult booking signals were wired into analytics end-to-end.

### Backend

- `app/api/analytics/check/route.ts`
  - Added `booking_click` to accepted analytics events.
- `lib/check-funnel.ts`
  - Added 24h counters:
    - `bookingClicks24h`
    - `consultingBookingClicks24h`
  - Persistent SQL snapshot now tracks all bookings and consult-scoped bookings via `meta_json.source` (`consulting_*`, `enterprise_api_cta`).
- `app/api/admin/profit-analytics/route.ts`
  - Funnel payload now includes:
    - `bookingClicks`
    - `consultingBookingClicks`
    - `rates.pricingToBookingPct`
    - `rates.consultingBookingSharePct`

### Dashboard

- `components/admin/ProfitDashboard.tsx`
  - Conversion panel now shows:
    - Booking Clicks (24h)
    - Consulting Booking Share (% and count)
    - Pricing → Booking conversion rate

### Tests

- Added `__tests__/check-funnel.test.ts` to assert booking counters in snapshot flow.

## Source-level funnel breakdown follow-up (2026-04-25)

Added booking source visibility so consult performance can be evaluated per CTA slot/source tag.

- `lib/check-funnel.ts`
  - Added DB aggregation for top booking sources over 24h (`bookingSources24h`, top 8).
  - Uses `meta_json.source` from `booking_click` events.
  - Snapshot fallback returns an empty source list when DB is not configured.
- `app/api/admin/profit-analytics/route.ts`
  - Funnel payload now includes `bookingSources24h`.
- `components/admin/ProfitDashboard.tsx`
  - Conversion panel now renders "Top Booking Sources (24h)" with source labels + counts.

This enables immediate readout of whether `consulting_*` slots, enterprise CTA, or other entry points are producing meeting intent.

## Slot / plan breakdown follow-up (2026-04-25)

Extended consult analytics so plan-level CTA slots are first-class metrics:

- `app/api/admin/profit-analytics/route.ts`
  - Added `consultSourceCounts` for:
    - `consulting_pricing_starter`
    - `consulting_pricing_pro`
    - `consulting_pricing_scale`
    - `consulting_bottom_cta`
    - `enterprise_api_cta`
  - Added booking-share rates for each slot (`*SlotBookingPct`) based on total booking clicks.
- `components/admin/ProfitDashboard.tsx`
  - Added "Consult Slot Breakdown (24h)" panel showing count + share per slot.

This makes it possible to compare plan-card and CTA-slot performance directly without log forensics.

## Retention signal follow-up (2026-04-25)

Consult demand is now part of retention evaluation instead of checkout-only logic.

- `lib/autopilot-retention.ts`
  - `RetentionInput` extended with:
    - `bookingClicks24h`
    - `consultingBookingClicks24h`
  - Added signal:
    - `consult_booking_share`
  - Added thresholding:
    - `< 20%` critical
    - `< 45%` watch
    - `>= 45%` healthy
  - If no booking clicks exist, the signal defaults to `watch` (insufficient signal).
- `app/api/admin/profit-analytics/route.ts`
  - Now passes booking metrics into `evaluateRetentionSignals(...)`.
- `__tests__/autopilot-retention.test.ts`
  - Updated fixtures to include booking inputs.
  - Added assertion for healthy consult-booking-share path.

## Contract hardening follow-up (2026-04-25)

To make consult analytics safer to evolve, source-slot calculation has been extracted into a dedicated helper module:

- `lib/consult-funnel.ts`
  - Centralizes:
    - source-slot counters
    - slot-level booking-share rates
    - pricing-to-booking and consult-share rates
- `app/api/admin/profit-analytics/route.ts`
  - Now consumes `buildConsultSourceSnapshot(...)` instead of re-implementing the math inline.
- `__tests__/consult-funnel.test.ts`
  - Adds focused contract coverage for slot counts + computed rates.

This keeps route complexity lower and prevents subtle drift in slot-rate calculations during future consult iterations.

## Source concentration follow-up (2026-04-25)

Added a consult source concentration signal to spot over-reliance on a single CTA slot.

- `lib/consult-funnel.ts`
  - New `insights` block:
    - `topSource`
    - `topSourceCount`
    - `topSourceSharePct`
    - `sourceConcentrationLevel` (`balanced` / `watch` / `critical`)
  - Concentration thresholds:
    - `>= 70%` critical
    - `>= 50%` watch
    - otherwise balanced
- `app/api/admin/profit-analytics/route.ts`
  - Exposes `consultInsights` inside funnel payload.
- `components/admin/ProfitDashboard.tsx`
  - Shows top source + share + concentration level in conversion panel.
- `__tests__/consult-funnel.test.ts`
  - Added concentration-risk test case.

## Robustness + UX follow-up (2026-04-25)

Added a small hardening pass for source data quality and improved dashboard readability.

- `lib/consult-funnel.ts`
  - Added `normalizeBookingSources(...)`:
    - trims source labels
    - maps empty source to `unknown`
    - clamps negative/invalid counts to `0`
    - merges duplicate source entries
  - `buildConsultSourceSnapshot(...)` now returns normalized source rows (`bookingSources24hNormalized`) and computes insights from normalized data.
- `app/api/admin/profit-analytics/route.ts`
  - now emits normalized `bookingSources24h`.
- `components/admin/ProfitDashboard.tsx`
  - top booking source list now shows count + share percentage
  - concentration level is highlighted (`BALANCED/WATCH/CRITICAL`) in slot panel
- `__tests__/consult-funnel.test.ts`
  - added normalization contract test for duplicate and malformed rows

## Funnel contract test follow-up (2026-04-25)

Added a dedicated, testable funnel contract builder so route-level changes do not silently break consult analytics shape.

- `lib/profit-funnel.ts`
  - New `buildProfitFunnel(...)` helper:
    - computes the full funnel payload (rates, consult counts, insights, notes)
    - consumes normalized consult snapshot from `lib/consult-funnel.ts`
- `app/api/admin/profit-analytics/route.ts`
  - `conversionFunnel(...)` now delegates to `buildProfitFunnel(...)`
- `__tests__/profit-funnel.test.ts`
  - Adds contract test for key consult analytics fields and rate outputs.

This improves maintainability and catches payload drift before it reaches the admin dashboard.

## Consult health score follow-up (2026-04-25)

Added a compact health signal for consult funnel quality, combining conversion, source mix, and checkout stability.

- `lib/profit-funnel.ts`
  - Added `consultHealth` block:
    - `score` (0–100)
    - `level` (`healthy` / `watch` / `critical`)
    - `reasons` (human-readable diagnostics)
  - Score blends:
    - pricing→booking conversion
    - consult booking share
    - source concentration
    - checkout error pressure
- `components/admin/ProfitDashboard.tsx`
  - Added "Consult Health (24h)" section in conversion panel.
- `__tests__/profit-funnel.test.ts`
  - Extended contract assertions to include `consultHealth`.

## Route compatibility follow-up (2026-04-25)

Added a compatibility redirect for users hitting the legacy consult slug.

- `middleware.ts`
  - `/{locale}/consult` now redirects via HTTP `308` to `/{locale}/consulting`.
  - Keeps locale context and aligns path behavior with the canonical consulting route.

This removes a high-intent 404 entry point and consolidates SEO/canonical signals to `/consulting`.

## Source-group rollup follow-up (2026-04-25)

Added a grouped source-family view so consult demand can be read at channel-family level, not only by raw source labels.

- `lib/profit-funnel.ts`
  - Added grouped source families from normalized `bookingSources24h`:
    - `pricingSlots` (`consulting_pricing_*`)
    - `bottomCta` (`consulting_bottom_cta`)
    - `enterpriseCta` (`enterprise_api_cta`)
    - `other` (all remaining sources)
  - Exposes:
    - `consultSourceGroups` (count + share per family)
    - `consultDominantSourceGroup` (largest family in 24h window)
- `components/admin/ProfitDashboard.tsx`
  - Added "Consult Source Groups (24h)" panel with family count/share + dominant group.
- Tests
  - `__tests__/profit-funnel.test.ts` extended for grouped-source contract assertions.
  - Added route-level contract coverage in `__tests__/profit-analytics-route.test.ts`.

This improves executive readability and makes it easier to spot whether demand is mostly card-driven (`consulting_pricing_*`) or coming from non-core sources.

## Consult health alert routing policy (2026-04-25)

Structured consult health diagnostics so operators can see explicit alert flags and a simple routing hint (for future Slack/PagerDuty wiring).

- `lib/profit-funnel.ts`
  - `consultHealth.alertFlags` (when thresholds trip):
    - `low_conversion` — pricing→booking rate below 15%
    - `low_consult_mix` — consult share of bookings below 30%
    - `source_concentration` — top booking source share in watch/critical band (`consultInsights.sourceConcentrationLevel` not `balanced`)
    - `checkout_error_pressure` — checkout error rate ≥ 10% of checkout starts
  - `consultHealth.routing`:
    - `severity`: `info` | `warn` | `page`
    - `action`: `none` | `slack` | `pagerduty` (intent only; no outbound integrations yet)
    - `reason` — short human-readable policy summary
  - Policy sketch:
    - **page** when score < 35 or **low_conversion** and **checkout_error_pressure** together
    - **warn** when two or more flags fire or score < 60 (and not paged)
    - **info** otherwise
- `components/admin/ProfitDashboard.tsx`
  - Consult Health panel shows flags, routing severity/action, and routing reason.
- Tests
  - `__tests__/profit-funnel.test.ts` — default fixture asserts `info`/`none` with checkout pressure only; second case asserts `warn`/`slack` when concentration + checkout pressure both flag.

## Consult health outbound webhooks (2026-04-25)

When consult routing is **warn** or **page**, the server can POST to optional webhooks (fire-and-forget) so ops channels get signal without polling the dashboard.

- `lib/consult-health-notify.ts`
  - `maybeNotifyConsultHealthAlerts(health, { generatedAt })` — no-op for `info`; otherwise resolves URL by severity:
    - **warn:** `CONSULT_HEALTH_WARN_WEBHOOK_URL` or legacy `CONSULT_HEALTH_SLACK_WEBHOOK_URL`
    - **page:** `CONSULT_HEALTH_PAGE_WEBHOOK_URL` or legacy `CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL`
  - **Cooldown:** default 1 hour per alert fingerprint (`severity` + sorted flags + rounded score). Override with `CONSULT_HEALTH_ALERT_COOLDOWN_MS` (minimum 60_000).
  - **Payload:** URLs containing `hooks.slack.com` receive Slack incoming format `{ "text": "..." }`. Other URLs receive a small JSON envelope (`source`, `severity`, `alert`, `flags`, `score`, …).
- `app/api/admin/profit-analytics/route.ts`
  - After building the funnel, calls `maybeNotifyConsultHealthAlerts` so each authenticated poll can trigger at most one outbound post per cooldown when routing is warn/page.
  - Response augments `consultHealth.webhooksConfigured` so the dashboard shows whether warn/page URLs are set (no secrets exposed).
- `__tests__/consult-health-notify.test.ts` — unit coverage for no-op, Slack payload, generic JSON, and cooldown reset.
- `app/api/admin/profit-analytics/route.ts`
  - Adds `consultHealth.notifyTelemetry` snapshot to dashboard payload (`attempted`, `sent`, `failed`, and skip counters).
- `components/admin/ProfitDashboard.tsx`
  - Consult Health panel now displays compact notify telemetry counters for quick delivery diagnostics.
- `__tests__/profit-analytics-route.test.ts`
  - Route contract now asserts telemetry shape in `consultHealth`.

## Consult health cron decoupling follow-up (2026-04-25)

Alert dispatch for consult health is now decoupled from admin dashboard polling.

- `app/api/consult-health/cron/route.ts` (new)
  - Secured with `CRON_SECRET` (Authorization Bearer or `?secret=` query).
  - Builds a fresh consult funnel snapshot via `getCheckFunnelSnapshotPersistent()` + `buildProfitFunnel(...)`.
  - Triggers `maybeNotifyConsultHealthAlerts(...)`.
  - Returns operational status payload (`notifiedCandidate`, `consultHealth`, `webhooksConfigured`).
  - Supports optional `checkoutCompleted` query for ad-hoc override checks.
- `app/api/admin/profit-analytics/route.ts`
  - No longer triggers outbound notify directly.
  - Remains read-only analytics endpoint while still exposing `consultHealth.webhooksConfigured`.
- Tests
  - Added `__tests__/consult-health-cron-route.test.ts` (unauthorized + authorized notify path).

This prevents alert delivery from depending on human dashboard traffic and makes scheduling explicit via cron.

## Scheduler wiring follow-up (2026-04-25)

Connected consult-health cron route to hosting schedulers so alerting runs without manual dashboard usage.

- `vercel.json`
  - Added cron entry:
    - path: `/api/consult-health/cron`
    - schedule: `*/15 * * * *`
- `netlify.toml`
  - Added scheduled Netlify function config:
    - `[functions."consult-health-cron"]`
    - `schedule = "*/15 * * * *"`
- `netlify/functions/consult-health-cron.js` (new)
  - Scheduled function that calls `/api/consult-health/cron`.
  - Uses `Authorization: Bearer ${CRON_SECRET}` when configured.
  - Returns upstream response body/status for easier scheduler debugging.

Required environment:
- `CRON_SECRET` (shared by route and scheduler caller)
- optional `SITE_URL` (Netlify function fallback target)

## Persistent notify telemetry follow-up (2026-04-25)

Webhook delivery telemetry can now survive process restarts when a database is configured.

- `lib/consult-health-notify.ts`
  - Added optional persistent event sink table:
    - `consult_health_notify_events`
    - columns: `event`, `severity`, `meta_json`, `created_at`
  - Added event writes for:
    - `attempted`, `sent`, `failed`
    - `skipped_info`, `skipped_no_webhook`, `skipped_cooldown`
  - Added `consultHealthNotifyTelemetrySnapshotPersistent()`:
    - reads 24h aggregated counters from DB
    - falls back to in-memory counters if DB is unavailable
- `app/api/admin/profit-analytics/route.ts`
  - Uses persistent telemetry snapshot for `consultHealth.notifyTelemetry`.
- Tests
  - Added `__tests__/consult-health-notify-persistent.test.ts` for DB snapshot + fallback behavior.

This keeps delivery counters stable across deploy/runtime restarts and makes telemetry more reliable for ops readouts.

## Operational Notes

- `BookingButton` remains env-driven (`NEXT_PUBLIC_CAL_*_URL`) with mail fallback, so no deployment break if Cal URLs are missing.
- Checkout still writes recommendation + upgrade signals metadata, now reached from consulting flow for transactional tiers as well.
- Existing pricing surface can be migrated incrementally to helper-based formatting without breaking this rollout.
