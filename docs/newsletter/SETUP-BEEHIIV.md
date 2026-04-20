# Beehiiv Setup Guide — ClawGuru Newsletter Platform

**Decision: Beehiiv** (chosen 20.04.2026)

## Why Beehiiv over ConvertKit

| Factor | Beehiiv | ConvertKit |
|--------|---------|------------|
| Built for | Newsletter-first publishers | Course creators |
| Free tier | up to 2,500 subs | up to 10,000 (basic) |
| Sponsor / ad network | ✅ Native Beehiiv Boosts + Ad Network | ❌ None |
| Referral program | ✅ Built-in (viral loop) | Paid add-on |
| Analytics | Cohorts, funnels, revenue attribution | Basic |
| API DX | Modern REST, clean docs | Older, more legacy |
| Monetisation path | Matches our €2–5k/week sponsor slot goal | Requires external ad sales |
| Brand alignment | Milk Road, The Hustle, tech publishers | Creator economy |

**Verdict:** Beehiiv is built for exactly what AGENTS.md Pillar 2 describes — "Newsletter as Growth Engine" + sponsor monetisation post-10k subs.

## One-Time Setup (≈10 minutes)

### 1. Create account
Go to <https://beehiiv.com> → Sign up → **Create Publication**:
- **Name:** ClawGuru Security Brief
- **URL:** `clawguru` (becomes `clawguru.beehiiv.com`)
- **Niche:** Technology / Cybersecurity
- **Description:** Daily CVE brief + fix guides for DevOps & security teams

### 2. Configure publication
- **Sending from:** `newsletter@clawguru.org` (add domain in Settings → Domains → authenticate SPF/DKIM/DMARC)
- **Reply-to:** `hello@clawguru.org`
- **Default preferences:** Daily cadence, UTC-7 send time (1 AM EST / 7 AM CET)
- **Welcome email:** Enable. Use content from `docs/newsletter/01-docker-socket.md` as first automation email.

### 3. Set up custom domain (optional but recommended)
Settings → Domains → Add `newsletter.clawguru.org` → follow DNS instructions.

### 4. Get API credentials
Settings → Integrations → API → **Create API Key**:
- Copy the key (shown once)
- Copy the **Publication ID** (starts with `pub_...`) from Settings → Publication

### 5. Add env vars

**Local dev** (`.env.local`):
```bash
BEEHIIV_API_KEY=your_api_key_here
BEEHIIV_PUBLICATION_ID=pub_xxxxxxxxxxxxxxxxxx
BEEHIIV_WELCOME_EMAIL=true
```

**Production** (Netlify Dashboard → Site settings → Environment variables):
```
BEEHIIV_API_KEY           = <api key>
BEEHIIV_PUBLICATION_ID    = pub_...
BEEHIIV_WELCOME_EMAIL     = true
```
Then trigger a redeploy.

### 6. Load the 7 evergreen issues into Beehiiv
Beehiiv → **Automations** → Create new automation:
- Trigger: **Subscriber added**
- Step 1 (immediate): Welcome email → paste `docs/newsletter/01-docker-socket.md` body
- Step 2 (+1 day): paste `02-postgres.md`
- Step 3 (+2 days): paste `03-nginx.md`
- ... through Step 7

After 7-day sequence completes, subscribers flow into the daily CVE brief list.

### 7. Backfill existing subscribers
Already have people in `newsletter_subscribers` table? One-shot sync:

```bash
# Dry run first
node scripts/newsletter/backfill-beehiiv.js --dry-run

# Real run (sends welcome email)
node scripts/newsletter/backfill-beehiiv.js

# Real run (no welcome spam for existing users)
node scripts/newsletter/backfill-beehiiv.js --welcome=false
```

## How It Works (Architecture)

```
User submits email on /check, /runbooks, /academy, etc.
          ↓
POST /api/newsletter/subscribe
          ↓
    ┌─────────────────────────┐
    │ 1. Insert into Postgres │   (source of truth, GDPR evidence)
    │    newsletter_subscribers│
    └──────────┬──────────────┘
               │
               ↓ (fire-and-forget, non-blocking)
    ┌─────────────────────────┐
    │ 2. POST to Beehiiv API  │   (delivery + automation)
    │    subscribeToBeehiiv()  │
    └─────────────────────────┘
               ↓
       Welcome email + 7-day onboarding → daily CVE brief
```

**Why dual-write?**
- Postgres = legal GDPR evidence (consent timestamp, IP hash)
- Beehiiv = delivery infrastructure + automations + analytics
- If Beehiiv is down or unkeyed → local signup still succeeds (fire-and-forget)

## Verification Checklist

After setup:
- [ ] Env vars deployed to Netlify prod
- [ ] Subscribe from `/de/academy` with a test email → email arrives from Beehiiv
- [ ] Check `newsletter_subscribers` table — row exists with consent_at
- [ ] Check Beehiiv dashboard → subscriber visible, marked `active`
- [ ] Welcome automation fires correctly

## Success Metrics (first 30 days)

| Metric | Target |
|--------|--------|
| Subscribers | 500 |
| Welcome email open rate | > 60% |
| Day-1 click-through | > 15% |
| Weekly growth | +20% WoW |
| Unsubscribe rate | < 2% |

## Cost Projection

| Tier | Subs | Monthly |
|------|------|---------|
| Free | 0–2,500 | €0 |
| Launch | 2,500–10,000 | €39 |
| Scale | 10,000–100,000 | €79–€299 |
| Sponsor revenue (after 10k) | — | **+€2–5k/week** (expected) |

## Future Enhancements

- [ ] Beehiiv Boosts (paid discovery after 1k subs)
- [ ] Beehiiv Referral Program (viral coefficient)
- [ ] Custom segments by locale (DE / EN / ES)
- [ ] Webhook listener for unsubscribes → update Postgres `status`
- [ ] API endpoint `/api/newsletter/issues` to fetch published issues for in-site display
