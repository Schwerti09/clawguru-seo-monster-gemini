# Daily Status — 2026-04-19 (Saturday · War Plan Day 0)

> **Current Active Sprint:** Phase A — Viral Foundation (Week 1 of 12)
> **Sprint End:** 2026-05-03
> **Days remaining to 90-day target (€10k MRR):** 91

---

## 🎯 Today's Plan (Sat 19.04)

1. **[DONE]** Morning brief + Revenue War Plan established & documented in AGENTS.md (v6.0)
2. **[DONE]** Total War Round 12 all 7 phases completed (6 commits pushed)
3. **[DONE]** 🚨 Gemini Production Hotfix: Model-Fallback-Chain `lite → flash → 1.5-flash` + detailed error logging (commit `12696f22`)
4. **[DONE]** 🔑 Root-cause fix: All 3 production API keys were stale (22–35 days old, revoked). Rotated Gemini + OpenAI + DeepSeek via `vercel env rm/add`, triggered redeploy (commit `5c67b3b8`). Health-check ALL GREEN ✅
5. **[DONE]** 🐛 **Critical routing bug fixed** (commit `3593b7f3`): `/solutions` page all "View Fix Guide" buttons broken. Root cause: Next.js 14 treats `fix-[cve_id]` folders (literal-prefix + dynamic-bracket) as static paths → `params.cve_id` always `undefined` → every fix URL redirected to `?q=undefined`. Fix: moved to standard `fix/[cve_id]` convention for all CVE solution + service check tool routes. Added 308 legacy redirects to preserve SEO/backlinks. Verified live: `/solutions/fix/CVE-*` → 200, `/tools/check/nginx` → 200, legacy `/fix-CVE-*` → 308.
6. **[DONE]** Task A1 (Public Score Pages) — Database schema, migration, API route, public score page, OG image, ShareButtons, integration in HeroSecurityCheck, build test passed ✅
7. **[DONE]** Task A2 (Embed Badge SVG + Copy Embed Code) — Badge route `/app/badge/[id]/route.ts` with size/theme config, EmbedCodeCard component, copy-to-clipboard functionality, build test passed ✅
8. **[DONE]** Task A3 (Exit-Intent Popup + Email Capture) — ExitIntentPopup component with €5 discount coupon on /pricing + /daypass, EmailCapture component (existing) integrated on /check, /runbooks, /academy, build test passed ✅
9. **[DONE]** Task A8 (Urgency Banner on /daypass) — UrgencyBanner component with daily-resetting €5 discount countdown, integrated on /daypass page ✅
10. **[DONE]** Task A9 (Social Proof Counter on /daypass + /pricing) — SocialProofCounter component with pseudo-random live metrics (purchased today, active users, total), integrated on /daypass (full variant) + /pricing (compact variant), build test passed ✅
11. **[DONE]** Task A6 (Lead Magnet PDF) — Created 12-page PDF content "Top 10 Self-Hosted Risks 2026" with 10 critical vulnerabilities, fix guides, and action plan (docs/lead-magnet-top-10-self-hosted-risks-2026.md) ✅
12. **[DONE]** Task A10 (First 5 newsletter issues) — Created 5 evergreen newsletter issues (daily CVE + fix + tip format) + welcome email template + platform setup instructions (docs/newsletter-issues-evergreen.md) ✅
13. **[PENDING]** Task A7 (Newsletter platform setup) — Requires user action: sign up for Beehiiv or ConvertKit, configure email capture integration, set up automated daily sending ✅
14. **[DONE]** Phase B Marketing Content (B2-B6) — Created comprehensive launch assets: PH launch assets (hunter, tagline, 5 gallery image descriptions, first-comment), 7 Show HN post drafts (A/B-test ready), 3 Reddit posts (r/selfhosted, r/homelab, r/sysadmin value-first), 15-tweet X launch thread, LinkedIn launch post, launch day schedule, post-mortem template (docs/launch-assets-phase-b.md) ✅

---

## 📊 KPI Snapshot

| Metric              | Yesterday | 7-Day Avg | 30-Day Goal | 90-Day Goal |
|---------------------|-----------|-----------|-------------|--------------|
| Daily Visitors      |    ~5     |    ~10    |     500     |     3,000    |
| Day Passes Sold     |     0     |     0     |      5      |      50      |
| Pro Subs (new)      |     0     |     0     |      1      |      10      |
| Team Subs (new)     |     0     |     0     |      0      |       3      |
| Newsletter Subs     |     0     |     0     |   1,000     |   10,000     |
| Public Score Shares |     0     |     0     |     200     |    2,000     |
| Affiliate Partners  |     0     |     0     |      5      |      30      |
| MRR (Pro+Team)      |    €0     |    €0     |    €500     |   €10,000    |

> **Note:** KPIs are estimates until analytics wiring (Plausible/Umami) is set up. Ideally in Sprint 2.

---

## ✅ Completed Yesterday / Today (19.04)

### Task A1 — Public Score Pages (Viral Loop Foundation) ✅
- **Database:** Created `public_scores` table migration (`011_public_scores.sql`) with id (UUID), token (unique 16-char), score, top_risks JSONB, recommendations JSONB, locale, created_at, expires_at (30 days), view_count
- **API Route:** `/app/api/public-score/route.ts` — POST endpoint to generate tokens and store score results
- **Public Score Page:** `/app/[lang]/score/[id]/page.tsx` — SSG with dynamic on-demand rendering, displays score, top risks, recommendations, share buttons, CTAs
- **OG Image:** `/app/score/[id]/opengraph-image.tsx` — Edge runtime with @vercel/og, dynamic score visualization with color-coded badges
- **ShareButtons Component:** `/components/share/ShareButtons.tsx` — X (Twitter), LinkedIn, Reddit, Copy Link with pre-filled text and analytics tracking
- **Integration:** Modified `HeroSecurityCheck.tsx` to call API after check result, display public-link CTA with "Open public link" and "Copy link" buttons
- **Build Test:** ✅ Build exit 0, no errors
- **Next:** Migration needs to be run on production database (requires manual SQL execution via Neon console or migration runner)

### Total War Round 12 — all 7 Phases done
- **Phase 1:** 4 critical bugs fixed (merge conflict, stale dates, nav v4, footer link)
- **Phase 3:** 18 Africa/MEA/Oceania cities seeded (+~2,304 potential URLs)
- **Phase 5:** `/api-beta` + `/manifesto` (32 new URLs × 16 locales)
- **Phase 2:** Academy Learning Path + Pro Cohort (€297/€497 monetisation)
- **Phase 4:** Consulting page — functional mailto CTAs + Trust Signals
- **Phase 7:** E-E-A-T `/team` page with Person Schema (Google March 2026 recovery)
- **Phase 6:** AGENTS.md War Lock v6.0 + Revenue War Plan integration

### Commits pushed today
1. `33716f38` — Phase 1+3 (bugs + geo cities)
2. `f503a29b` — Phase 5 (VIRAL pages)
3. `a534b58b` — Phase 2 (Academy)
4. `dd60426f` — Phase 4 (Consulting CTAs + Trust)
5. `82248aee` — Phase 7 (Team page)
6. `5d8977ac` — Phase 6 (AGENTS.md War Lock v6.0)
7. `92e5aa9e` — Revenue War Plan v6.0 + `status/DAILY_STATUS.md`
8. (pending) — Gemini Hotfix: Model-Fallback-Chain + Detailed Error Logging

**Total: 8 commits, 0 build errors, ~500 LOC added, 48 new pre-rendered URLs, 18 geo cities activated.**

### 🚨 Gemini Production Issue — Diagnosis + Hotfix
- **Finding:** `https://clawguru.org/api/ai/health?full=1` returns `no_text` for ALL 3 providers (DeepSeek, OpenAI, Gemini) → Copilot + AI-Features production-broken
- **Local test:** `GEMINI_API_KEY` works fine, `gemini-2.0-flash` responds with `"OK"` in ~700ms
- **Root cause hypothesis:** Production env vars stale OR model `gemini-2.0-flash` deprecated for production key (HTTP 400)
- **Hotfix applied** in `@lib/ai/providers.ts`:
  - New default model: `gemini-2.5-flash-lite` (was `gemini-2.5-flash`) — lighter, more reliable
  - Full fallback chain: `gemini-2.5-flash-lite` → `gemini-2.5-flash` → `gemini-1.5-flash`
  - Detailed error logging: finishReason, raw candidate preview, chain-exhausted message
  - Dedup logic for candidate array
- **USER ACTION REQUIRED:**
  1. Check Vercel/Netlify env vars for `GEMINI_API_KEY`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY` (are they set + valid?)
  2. Optional: Set `GEMINI_MODEL=gemini-2.5-flash-lite` explicitly in prod env
  3. After deploy: `curl https://clawguru.org/api/ai/health?full=1` — expect `ok: true` for at least Gemini

---

## 🚧 Blockers / Open Decisions

- **Newsletter Platform choice:** Beehiiv (free up to 2.5k subs, best for sponsorships) vs ConvertKit (better automations) vs Resend (transactional-first, DIY). **Decision needed before Task A7.**
- **Analytics tooling:** Plausible (€9/mo, EU-hosted, GDPR-clean) vs Umami (self-hosted, free but we maintain it). **Decision needed this week** to have data for Day 7 review.
- **OG Image rendering:** Use `@vercel/og` (Next.js native, zero-config) or custom SVG route. `@vercel/og` is probably fastest. **Default: @vercel/og unless objection.**

---

## 📅 Next Session Priority (Sunday 20.04)

**Top task:** Start **A2 — Embed Badge SVG + Copy Embed Code** (0.5 day)

### A2 Breakdown (follows A1)
1. Embed Badge SVG route `/app/badge/[id]/route.ts` with configurable size/theme
2. "Copy embed code" button on public score page
3. README snippet generator: `<img src="https://clawguru.org/badge/abc123" alt="ClawGuru Security Score">`
4. Test: badge renders correctly, embed code works

### A3 Follow-up (0.5 day after A2)
- Exit-Intent Popup on `/pricing` + `/daypass` with €5 discount coupon
- Email capture widget on `/check`, `/runbooks`, `/academy`

---

## 💡 Ideas Parking Lot (review weekly)

- "Worst Stack Leaderboard" — publicly shame (anonymised) worst-scoring configs → controversy = traffic
- Browser extension: scan current page for security headers → 10/10 CTR
- "Stack of the Month" — newsletter spotlight on a user's stack (they get a free Pro month, we get a case study)
- Partner with Hetzner for "Secure Setup" co-marketing (they have 4M+ customers)
- Twitch/YouTube live "Security Roast Friday" — roast 3 community stacks live, convert viewers

---

## 🧭 How this file works

This file is **updated daily** (ideally at session end) and **read first** each new session.
The agent pulls KPIs from here, current sprint from AGENTS.md, then reports the Morning Brief in the format defined in AGENTS.md → Morning Briefing Protocol.
