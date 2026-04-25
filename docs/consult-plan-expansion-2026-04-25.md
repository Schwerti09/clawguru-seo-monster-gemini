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

## Route compatibility follow-up (2026-04-25)

Added a compatibility redirect for users hitting the legacy consult slug.

- `middleware.ts`
  - `/{locale}/consult` now redirects via HTTP `308` to `/{locale}/consulting`.
  - Keeps locale context and aligns path behavior with the canonical consulting route.

This removes a high-intent 404 entry point and consolidates SEO/canonical signals to `/consulting`.

## Operational Notes

- `BookingButton` remains env-driven (`NEXT_PUBLIC_CAL_*_URL`) with mail fallback, so no deployment break if Cal URLs are missing.
- Checkout still writes recommendation + upgrade signals metadata, now reached from consulting flow for transactional tiers as well.
- Existing pricing surface can be migrated incrementally to helper-based formatting without breaking this rollout.
