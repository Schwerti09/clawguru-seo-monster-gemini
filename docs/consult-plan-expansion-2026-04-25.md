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

## Operational Notes

- `BookingButton` remains env-driven (`NEXT_PUBLIC_CAL_*_URL`) with mail fallback, so no deployment break if Cal URLs are missing.
- Checkout still writes recommendation + upgrade signals metadata, now reached from consulting flow for transactional tiers as well.
- Existing pricing surface can be migrated incrementally to helper-based formatting without breaking this rollout.
