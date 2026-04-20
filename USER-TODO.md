# 👤 User TODO — Manual Tasks for Schwerti

> **Purpose:** Track all actions that only YOU (the founder) can do — account creation, API keys, content recording, outreach, etc.
> **Rule:** Agent adds items here as they come up. User checks them off when done.
> **Priority:** Items higher up = higher revenue impact per minute of your time.

---

## 🔥 HIGH PRIORITY — Revenue-critical, ≤1 hour each

### 1. Beehiiv Newsletter Platform Setup
- [ ] Create account on <https://beehiiv.com>
- [ ] Create Publication "ClawGuru Security Brief" (URL: `clawguru`)
- [ ] Settings → Domains → authenticate `newsletter@clawguru.org` (SPF/DKIM/DMARC)
- [ ] Settings → Integrations → API → Create API Key (copy once!)
- [ ] Copy Publication ID (starts with `pub_...`)
- [ ] Add to Netlify Env Vars:
  - `BEEHIIV_API_KEY=<key>`
  - `BEEHIIV_PUBLICATION_ID=pub_xxxxx`
  - `BEEHIIV_WELCOME_EMAIL=true`
- [ ] Trigger Netlify redeploy
- [ ] Test: subscribe with test email on `/de/academy` → check Beehiiv dashboard
- [ ] Build 7-day automation sequence in Beehiiv using `docs/newsletter/01..07-*.md`
- [ ] Run backfill for existing subscribers:
  - `node scripts/newsletter/backfill-beehiiv.js --dry-run` → inspect
  - `node scripts/newsletter/backfill-beehiiv.js --welcome=false` (existing = no re-welcome)

**Docs:** `docs/newsletter/SETUP-BEEHIIV.md`
**Expected outcome:** Every `/check` signup triggers welcome email + 7-day onboarding → daily CVE brief.

---

### 2. Calendly / Cal.com for /consulting + /enterprise-api
(Added once Phase D code is live)
- [ ] Create Cal.com account (recommended, open-source alternative)
- [ ] Create 3 event types:
  - "Strategy Call — 30min" (free discovery)
  - "Security Audit Scoping — 60min" (free)
  - "Enterprise Demo — 45min" (for /enterprise-api)
- [ ] Copy booking URLs
- [ ] Provide them to agent OR add to env vars:
  - `NEXT_PUBLIC_CAL_STRATEGY_URL=...`
  - `NEXT_PUBLIC_CAL_AUDIT_URL=...`
  - `NEXT_PUBLIC_CAL_DEMO_URL=...`

---

### 3. YouTube Shorts Channel Setup
- [ ] Create / claim YouTube channel: "ClawGuru Security"
- [ ] Channel banner + logo + bio link
- [ ] Install capture tool (OBS / ScreenStudio / ScreenFlow)
- [ ] Record first 3 Shorts (agent will deliver scripts in Phase C6)
- [ ] Upload cadence: 1 Short/week minimum
- [ ] Add video descriptions with `/check` CTA

---

### 4. LinkedIn Founder Account Hygiene
- [ ] Update headline: "Founder @ ClawGuru · Security Intelligence for Self-Hosted Infra"
- [ ] Pin ClawGuru post on profile
- [ ] Connect with 50 DevOps/SecOps leaders/week (target list from Phase D4)
- [ ] 1 substantive post/week with real client case (anonymised)

---

### 5. Author Photo / Avatar
- [ ] Record or select a professional photo for `/public/author/schwerti.png`
- [ ] Recommended: clean background, neutral expression, 400×400px min
- [ ] Fallback: keep current initial avatar — but real photo significantly boosts E-E-A-T

---

## 🟡 MEDIUM PRIORITY — Can wait 1-2 weeks

### 6. Launch Week Prep (Phase B) — full playbook ready in `docs/launch/`
**Complete copy-paste assets already written in repo — just execute:**
- [ ] **T-7 days:** read `docs/launch/README.md` end-to-end (launch day schedule + timing)
- [ ] **T-7 days:** claim ClawGuru page on Product Hunt → find a hunter with ≥500 followers (DM 10 candidates from PH leaderboard)
- [ ] **T-7 days:** design 5–7 gallery images per spec in `docs/launch/product-hunt-assets.md` (1270×760px)
- [ ] **T-5 days:** create Stripe coupons: `HUNTER50`, `SHOWHN50`, `REDDIT30`, `BIRDS25`, `LINKEDIN25` (specs in launch README)
- [ ] **T-3 days:** warm-up subreddits (comment genuinely on 5 threads/sub/day in r/selfhosted, r/homelab, r/sysadmin, r/devops)
- [ ] **T-3 days:** warm up X (follow 50 security/devops accounts, reply genuinely to 10 security tweets/day)
- [ ] **T-1 day:** schedule PH launch for Tuesday 00:01 PST + test all links + sanity-check `/check` and checkout flow on mobile
- [ ] **Launch Tuesday — follow exact schedule in `docs/launch/README.md`:**
  - 09:01 Berlin: PH live + First Comment (from `product-hunt-assets.md`)
  - 13:00 Berlin: "Show HN" (pick variant from `show-hn-post.md`)
  - 15:00 Berlin: X 15-tweet thread (from `x-launch-thread.md`)
  - 16:00 Berlin: Reddit r/selfhosted post (from `reddit-launch-posts.md`)
  - 16:30/17:00/17:30: r/homelab + r/sysadmin + r/devops
  - 18:00: LinkedIn post (from launch README)
- [ ] **Launch Tuesday:** clear calendar — answer every comment within 10 min for 8+ hours
- [ ] **T+1 day:** publish public `/launch-results` post-mortem (transparency = backlinks)

### 7. Press Outreach (Phase C8)
- [ ] Collect email addresses for:
  - Heise Security editor
  - The Register
  - Bleeping Computer
  - TechCrunch Europe
- [ ] Personalise pitches from `docs/press-pitch.md`
- [ ] Track responses in simple spreadsheet

### 8. Affiliate Partner Outreach (Phase C2)
- [ ] Make list of 30 security creators (Twitter/YouTube/blogs)
- [ ] Send warm DMs with affiliate offer
- [ ] Template ready in `docs/affiliate-recruitment-outreach.md`

### 9. Hetzner / DigitalOcean Partnership (Phase C3)
- [ ] Find BD contact on LinkedIn
- [ ] Pitch affiliate exchange
- [ ] Pitch doc ready in `docs/partnership-pitch-hetzner-do.md`

---

## 🟢 LOW PRIORITY — When you have free time

### 10. Community Survey for "State of Self-Hosted Security 2026" Report
- [ ] Create Google Form (10 questions, takes ≤3min)
- [ ] Promote on Reddit r/selfhosted, Discord, X
- [ ] Target: N=500 responses

### 11. Real Client Case Studies
- [ ] Reach out to 3 past clients for testimonial quote + logo permission
- [ ] Add to `/consulting` and `/for-saas` landing pages

### 12. GitHub Public Repo
- [ ] Decide which runbooks to open-source (show "we validate, not spam")
- [ ] Create `clawguru/runbooks-public` repo
- [ ] Add contribution guide + review process README

---

## ✅ COMPLETED

- ~~A1: Public Score Pages live (migration applied on Neon)~~
- ~~C4: Newsletter 7 Evergreen Issues written~~
- ~~C7: State of Self-Hosted Security report outlined~~
- ~~A7: Beehiiv integration code deployed (waiting on your API keys)~~
- ~~E-E-A-T: Strategy docs + toolkit (AuthorBox, LastUpdated, Schema) shipped~~
- ~~E-E-A-T: 88% AI-spam vocabulary cleanup (54 files, 204→24 matches)~~

---

## How to work with this list

- Agent adds new items to the right section with estimated priority
- You check items off when done (use `- [x]`)
- Completed items move to "✅ COMPLETED" section weekly
- Every session starts by agent reading this file + `status/DAILY_STATUS.md`
