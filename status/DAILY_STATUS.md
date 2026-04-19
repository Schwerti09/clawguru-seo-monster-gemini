# Daily Status — 2026-04-19 (Saturday · War Plan Day 0)

> **Current Active Sprint:** Phase A — Viral Foundation (Week 1 of 12)
> **Sprint End:** 2026-05-03
> **Days remaining to 90-day target (€10k MRR):** 91

---

## 🎯 Today's Plan (Sat 19.04)

1. **[DONE]** Morning brief + Revenue War Plan established & documented in AGENTS.md (v6.0)
2. **[DONE]** Total War Round 12 all 7 phases completed (6 commits pushed)
3. **[HIGH]** Tomorrow (Sun 20.04): Start Phase A Sprint — Task A1 (Public Score Pages) is the #1 priority

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

**Total: 6 commits, 0 build errors, ~500 LOC added, 48 new pre-rendered URLs, 18 geo cities activated.**

---

## 🚧 Blockers / Open Decisions

- **Newsletter Platform choice:** Beehiiv (free up to 2.5k subs, best for sponsorships) vs ConvertKit (better automations) vs Resend (transactional-first, DIY). **Decision needed before Task A7.**
- **Analytics tooling:** Plausible (€9/mo, EU-hosted, GDPR-clean) vs Umami (self-hosted, free but we maintain it). **Decision needed this week** to have data for Day 7 review.
- **OG Image rendering:** Use `@vercel/og` (Next.js native, zero-config) or custom SVG route. `@vercel/og` is probably fastest. **Default: @vercel/og unless objection.**

---

## 📅 Next Session Priority (Sunday 20.04)

**Top task:** Start **A1 — Public Score Pages (`/score/[id]`)**

### A1 Breakdown (est. 1 day)
1. DB schema: `public_scores` table (id, token, score, top_risks JSONB, created_at, locale)
2. Migration file + seed logic in existing security-check flow
3. `/app/[lang]/score/[id]/page.tsx` — SSG with `generateStaticParams` returning empty (dynamic on demand)
4. OG Image route `/app/score/[id]/opengraph-image.tsx` (using `@vercel/og`)
5. Share buttons component (X, LinkedIn, Reddit, Copy Link) with pre-filled text
6. Integration: After `/check` result, surface public-link CTA
7. Test: build exit 0, manual test with 3 locales (de, en, fr)

### A2 Follow-up (0.5 day after A1)
- Embed Badge SVG route `/app/badge/[id]/route.ts` with configurable size/theme
- "Copy embed code" button on score page
- README snippet generator: `<img src="https://clawguru.org/badge/abc123" alt="ClawGuru Security Score">`

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
