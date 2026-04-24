# Autonomous Security Ops Rollout

## Goal

Transform ClawGuru from high-ticket consulting offers into an automation-first security operating system with clear product tiers, lower entry pricing, and measurable delivery outcomes.

## Final Offer Structure

- Autopilot Starter: 29 EUR / month
- Autopilot Pro: 99 EUR / month
- Autopilot Scale: 249 EUR / month
- Human Escalation Add-on: from 490 EUR per scoped case

## Delivery Model

- Continuous risk scanning instead of one-off audits
- AI remediation planning mapped to runbooks
- Proof-of-fix outputs with residual risk context
- Optional human escalation only for edge cases

## Rollout Phases

1. Positioning and messaging rewrite
   - Consulting page reframed to Autonomous Security Ops
   - High-ticket service language removed
2. Pricing surface alignment
   - Pricing metadata and plan comparison moved to Starter/Pro/Scale anchors
   - Pro/Scale toggle pricing updated to 99/249 anchors
3. Productized sales logic in code
   - Added `lib/autopilot-offering.ts` with canonical plan catalog and upgrade recommendation logic
4. Automated test coverage for offering logic
   - Added `__tests__/autopilot-offering.test.ts`
5. Conversion automation wiring (in progress)
   - Connected `suggestAutopilotPlan()` to checkout events and metadata
   - Added upgrade-signal capture (`workspaces`, API export need, policy-control need)
6. Autopilot delivery layer (in progress)
   - Added `lib/autopilot-delivery.ts` for prioritization, weekly digest, and proof-of-fix payloads
   - Added coverage in `__tests__/autopilot-delivery.test.ts`
7. Retention automation and funnel observability (in progress)
   - Added checkout-stage funnel metrics (`checkout_start`, `checkout_redirect`, `checkout_error`)
   - Added retention signal scoring for drop-off and error hotspots
   - Added admin dashboard visibility for conversion rates and retention signal levels
   - Added user dashboard retention hints based on local checkout friction patterns
   - Added retention v2: locale-aware hint copy, CTA deep-link to pricing, and 12h nudge cooldown after dismiss
   - Added retention v3 instrumentation: nudge impression/click/dismiss tracking + 24h nudge CTR in admin funnel view
8. Release gating and KPI loop (in progress)
   - Keep autopilot unit tests as required gate in CI (`npm run test:autopilot` → `build` job)
   - Added `npm run check:static-db` in CI so `app/[lang]/**` cannot import `@/lib/db` without `force-dynamic` (prevents Neon quota burn during `next build`; documented in [`docs/testing.md`](./testing.md))
   - Roast statistics: API + page resilient to Neon quota + `force-dynamic` (`lib/roast-stats-errors.ts`, commit `16ff17ed`)
   - Next: track trial-to-paid, plan upgrades, and churn by tier in admin / analytics surfaces

## KPI Targets (90 days)

- Trial to paid conversion: +40%
- ARPU: +25%
- Automated delivery without manual intervention: >85%
- 30-day churn: <6%
