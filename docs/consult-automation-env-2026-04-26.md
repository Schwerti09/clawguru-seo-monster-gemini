# Consult Automation — ENV Reference (2026-04-26)

> **Eigentum:** Cursor (laut `AGENTS.md` Ownership Map). Erstellt von Windsurf auf User-Auftrag im Rahmen des Step-1-Plans aus [`docs/consult-automation-gaps-2026-04-26.md`](consult-automation-gaps-2026-04-26.md).
> **Healthcheck:** `GET /api/consult-health/env-check?secret=$CRON_SECRET` (siehe `app/api/consult-health/env-check/route.ts`).

---

## 1. Geltungsbereich

Dieses Dokument listet **alle ENV-Vars**, die für den `/consulting`-Workflow Ende-zu-Ende benötigt werden. Geltungsbereich:

- **Frontend:** `app/[lang]/consulting/page.tsx`, `components/commerce/BuyButton.tsx`, `components/booking/BookingButton.tsx`
- **Stripe-Flow:** `app/api/stripe/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, `app/api/auth/activate/route.ts`, `lib/stripe.ts`, `lib/access-token.ts`, `lib/api-guard.ts`
- **Email:** `lib/email.ts`
- **Analytics + Health:** `app/api/analytics/check/route.ts`, `app/api/consult-health/cron/route.ts`, `lib/check-funnel.ts`, `lib/consult-health-notify.ts`, `lib/profit-funnel.ts`
- **Persistenz:** `lib/db.ts` (Pool primary + secondary)

---

## 2. Severity-Levels

| Level | Bedeutung | Wirkung wenn fehlt |
|---|---|---|
| 🔴 **required** | Workflow bricht ohne diese Var | Healthcheck `status: "broken"` |
| 🟡 **recommended** | Workflow läuft degradiert oder unsicher | Healthcheck `status: "degraded"` |
| 🟢 **optional** | Feature-Flag oder Default-Override | Healthcheck `status: "ok"` |

---

## 3. ENV-Tabelle

### 3.1 Stripe (Payment Core)

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `STRIPE_SECRET_KEY` | 🔴 required | — | `isStripeActive() === false` → 503 auf alle Checkout-Routes (`lib/api-guard.ts:28`) | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | 🔴 required | — | Webhook-Route returns 500 → keine Magic-Link-Email, keine Entitlement-Persistenz (`app/api/stripe/webhook/route.ts:436-443`) | `whsec_...` |
| `STRIPE_PRICE_DAYPASS` | 🔴 required | — | 503 für Starter-Plan (Starter mappt zu `daypass`, `lib/autopilot-offering.ts:50`) | `price_...` |
| `STRIPE_PRICE_PRO` | 🔴 required | — | 503 für Pro-Plan | `price_...` |
| `STRIPE_PRICE_TEAM` | 🔴 required | — | 503 für Scale-Plan-Direct-Buy (Scale geht primär via BookingButton, aber Fallback bricht) | `price_...` |
| `STRIPE_PRICE_PRO_ANNUAL` | 🟢 optional | — | Annual-Toggle für Pro nicht verfügbar | `price_...` |
| `STRIPE_PRICE_TEAM_ANNUAL` | 🟢 optional | — | Annual-Toggle für Team nicht verfügbar | `price_...` |
| `STRIPE_PRICE_MSP` | 🟢 optional | — | MSP-Plan nicht buchbar | `price_...` |
| `STRIPE_PRICE_ENTERPRISE` | 🟢 optional | Fallback zu `STRIPE_PRICE_TEAM` | Enterprise-Direct-Buy nutzt TEAM-Preis | `price_...` |

### 3.2 Auth & Tokens

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `ACCESS_TOKEN_SECRET` | 🔴 required (oder eines der Aliases) | — | `signAccessToken()` throws → keine Magic-Link-Email nach Checkout (`lib/access-token.ts:35-36`) | `<32+ char random>` |
| `NEXTAUTH_SECRET` | 🟢 optional | Fallback für `ACCESS_TOKEN_SECRET` | Wirkt nur wenn `ACCESS_TOKEN_SECRET` fehlt | — |
| `SESSION_SECRET` | 🟢 optional | Fallback für `ACCESS_TOKEN_SECRET` | Wirkt nur wenn beide oben fehlen | — |

### 3.3 Email (Resend)

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `RESEND_API_KEY` | 🔴 required (außer `RESEND_DISABLED=true`) | — | `sendEmail()` throws → User bekommt keinen Magic Link (`lib/email.ts:19-23`) | `re_...` |
| `RESEND_FROM` | 🟡 recommended | `"ClawGuru <noreply@clawguru.org>"` | Default-Sender, ggf. Resend-Domain-Verifikation muss matchen | `"ClawGuru <noreply@yourdomain.com>"` |
| `RESEND_DISABLED` | 🟢 optional | — | Wenn `=true`/`=1`: alle Emails geloggt statt gesendet (Dev-Mode) | `1` |
| `SUPPORT_EMAIL` | 🟡 recommended | Fallback chain → `EMAIL_REPLY_TO` → `EMAIL_FROM` → `support@clawguru.org` | Email-Footer zeigt Default | `support@yourdomain.com` |
| `EMAIL_REPLY_TO` | 🟢 optional | — | Wirkt im Footer-Fallback | — |
| `EMAIL_FROM` | 🟢 optional | — | Wirkt im Footer-Fallback | — |

### 3.4 Site & Domain

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 🔴 required | `http://localhost:3000` | Magic-Link verlinkt auf localhost statt Production-Domain (`app/api/stripe/webhook/route.ts:415`) | `https://clawguru.org` |

### 3.5 Database (Persistence)

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `DATABASE_URL` | 🔴 required | — | Analytics nur In-Memory → bei jedem Deploy verloren, keine 7d/30d-Trends, kein DB-Cooldown (`lib/check-funnel.ts:86-88`) | `postgresql://...` |
| `DATABASE_URL_2` | 🟡 recommended | — | Failover-Pool, springt ein wenn primary auf Quota-Fehler läuft (siehe `docs/db-failover-2026-04-24.md`) | `postgresql://...` (alternative cluster) |

### 3.6 Cron & Health Monitoring

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `CRON_SECRET` | 🔴 required | — | Cron-Endpoint öffentlich offen → jeder kann `/api/consult-health/cron` triggern und Webhook-Spam erzeugen (`app/api/consult-health/cron/route.ts:17-22`) | `<32+ char random>` |
| `CONSULT_HEALTH_WARN_WEBHOOK_URL` | 🟡 recommended | Fallback → `CONSULT_HEALTH_SLACK_WEBHOOK_URL` | Warn-Alerts (Score 35–60) werden in `consult_health_notify_events` als `skipped_no_webhook` geloggt, nicht zugestellt (`lib/consult-health-notify.ts:91-94`) | `https://hooks.slack.com/...` |
| `CONSULT_HEALTH_SLACK_WEBHOOK_URL` | 🟢 optional | — | Fallback für Warn | — |
| `CONSULT_HEALTH_PAGE_WEBHOOK_URL` | 🟡 recommended | Fallback → `CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL` | Page-Alerts (Score < 35) werden nicht zugestellt → kritische Outages bleiben unbemerkt | `https://events.pagerduty.com/...` |
| `CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL` | 🟢 optional | — | Fallback für Page | — |
| `CONSULT_HEALTH_ALERT_COOLDOWN_MS` | 🟢 optional | `3_600_000` (1h) | Wenn `< 60_000`: Default greift (Schutz gegen zu kurze Cooldowns) (`lib/consult-health-notify.ts:70-74`) | `3600000` |

### 3.7 Booking (Cal.com)

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `NEXT_PUBLIC_CAL_DEMO_URL` | 🟡 recommended | mailto-Fallback | Scale-Tier-CTA öffnet `mailto:enterprise@clawguru.org` statt Calendar-Picker → schlechtere UX, keine Confirmation (`components/booking/BookingButton.tsx:33`) | `https://cal.com/clawguru/enterprise-demo` |
| `NEXT_PUBLIC_CAL_STRATEGY_URL` | 🟢 optional | mailto-Fallback | Strategy-Call-CTA → mailto | `https://cal.com/clawguru/strategy` |
| `NEXT_PUBLIC_CAL_AUDIT_URL` | 🟢 optional | mailto-Fallback | Audit-CTA → mailto | `https://cal.com/clawguru/audit` |

### 3.8 Affiliate

| Var | Severity | Default | Wirkung wenn fehlt | Beispiel |
|---|---|---|---|---|
| `AFFILIATE_CONNECT_ACCOUNTS` | 🟢 optional | `{}` | Keine Stripe-Connect-Transfers für Affiliates (`app/api/stripe/webhook/route.ts:234-243`) | `{"hetzner":"acct_xxx"}` |
| `AFFILIATE_COMMISSION_RATE` | 🟢 optional | `0.40` (40%) | Default-Rate greift | `0.40` |

### 3.9 Killswitches (Notfall)

| Var | Severity | Default | Wirkung | Beispiel |
|---|---|---|---|---|
| `DISABLE_ALL_APIS` | 🟢 optional | — | Wenn `=true`: alle API-geschützten Routes geben 503 (Stripe + AI + Cron) | `true` |
| `DISABLE_AI_FEATURES` | 🟢 optional | — | Wenn `=true`: nur AI-Features blockiert, Stripe bleibt aktiv | `true` |

---

## 4. Plattform-Setup

Production läuft auf **Railway** (Migration 20.04.2026, siehe `AGENTS.md:763`). Vercel + Netlify sind seit 26.04.2026 **nicht mehr als Cron-Quelle aktiv** — Railway ist die einzige Cron-Quelle.

### 4.1 Railway (Production — Web Service)

Der Haupt-`web`-Service von Railway braucht alle 🔴 required und 🟡 recommended Vars.

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_DAYPASS=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_TEAM=price_...

# Auth
ACCESS_TOKEN_SECRET=<32+ char random>

# Email
RESEND_API_KEY=re_...
RESEND_FROM="ClawGuru <noreply@clawguru.org>"
SUPPORT_EMAIL=support@clawguru.org

# Site
NEXT_PUBLIC_SITE_URL=https://clawguru.org

# DB
DATABASE_URL=postgresql://...
DATABASE_URL_2=postgresql://... # failover

# Cron + Health
CRON_SECRET=<32+ char random>
CONSULT_HEALTH_WARN_WEBHOOK_URL=https://hooks.slack.com/...
CONSULT_HEALTH_PAGE_WEBHOOK_URL=https://events.pagerduty.com/...

# Booking
NEXT_PUBLIC_CAL_DEMO_URL=https://cal.com/clawguru/enterprise-demo
```

### 4.2 Railway (Production — Cron Service)

Seit 26.04.2026 läuft der `/api/consult-health/cron`-Tick als separater Railway-Service. Setup:

**1) Neuen Service im selben Railway-Projekt anlegen**

Im Railway-Dashboard: `+ New` → `Empty Service` (oder `GitHub Repo` → selbes Repo).
Name: `consult-health-cron`.

**2) Service-Config setzen**

- **Source:** selbes Git-Repo, Branch `main`.
- **Build Command:** `npm install --legacy-peer-deps` (oder leer lassen, nixpacks erkennt).
- **Start Command:** `node scripts/cron/consult-health-tick.mjs`
- **Cron Schedule:** `*/15 * * * *` (Railway unterstützt Cron Schedules direkt in der Service-Config)
- **Restart Policy:** Never (der Service beendet sich nach jedem Tick sauber).

**3) ENV-Vars auf dem Cron-Service**

Minimal benötigt:

```bash
CRON_SECRET=<exakt gleicher Wert wie im Web Service>
SITE_URL=https://clawguru.org
# optional:
# CRON_TIMEOUT_MS=30000
# CRON_VERBOSE=1
```

**4) Verifikation**

- Nach erstem Deploy: Railway-Logs zeigen pro Tick eine JSON-Zeile `{"level":"info","message":"cron tick completed","status":200}`
- Nach 24h: `SELECT count(*) FROM consult_health_notify_events WHERE event IN ('attempted','sent','skipped_info','skipped_no_webhook','skipped_cooldown','failed');` sollte ~96 Events zeigen (24h × 4/h).
- Bei Auth-Problem: Exit-Code 2, Log zeigt `"authentication failed"` — Secret-Mismatch zwischen Services.

### 4.3 Notfall-Fallback (wenn Railway-Cron ausfällt)

Das Script `scripts/cron/consult-health-tick.mjs` ist **platform-agnostic**. Es kann identisch via externem Scheduler aufgerufen werden:

- **cron-job.org:** URL `https://clawguru.org/api/consult-health/cron` + Header `Authorization: Bearer $CRON_SECRET` + Schedule `*/15 * * * *`.
- **GitHub Actions:** `.github/workflows/consult-health-cron.yml` mit `schedule: - cron: "*/15 * * * *"` und `run: node scripts/cron/consult-health-tick.mjs` (Delay-Risiko 10-30 min beachten).
- **systemd timer / cron / Windows Task Scheduler:** `node scripts/cron/consult-health-tick.mjs` als Befehl.

### 4.4 Vercel + Netlify Status (26.04.2026)

- **Vercel:** `crons`-Block aus `vercel.json` entfernt. Deployments können weiterlaufen, aber Vercel feuert den Cron nicht mehr.
- **Netlify:** `[functions."consult-health-cron"]` aus `netlify.toml` entfernt. `netlify/functions/consult-health-cron.js` gelöscht. Netlify ist nicht mehr Cron-Quelle.

---

## 5. Healthcheck-Endpoint

`GET /api/consult-health/env-check?secret=$CRON_SECRET` (oder `Authorization: Bearer $CRON_SECRET`).

**Response-Schema:**

```json
{
  "status": "ok" | "degraded" | "broken",
  "checkedAt": "2026-04-26T13:00:00.000Z",
  "summary": {
    "required": { "total": 8, "configured": 8, "missing": [] },
    "recommended": { "total": 5, "configured": 3, "missing": ["NEXT_PUBLIC_CAL_DEMO_URL", "CONSULT_HEALTH_PAGE_WEBHOOK_URL"] },
    "optional": { "total": 11, "configured": 2 }
  },
  "configured": {
    "stripe": { "secret": true, "webhook": true, "prices": { "daypass": true, "pro": true, "team": true, "msp": false, "enterprise": false } },
    "auth": { "accessToken": true },
    "email": { "resend": true, "disabled": false, "from": true, "support": true },
    "site": { "url": true },
    "database": { "primary": true, "secondary": false },
    "cron": { "secret": true },
    "alerts": { "warnWebhook": true, "pageWebhook": false, "cooldownMs": "default" },
    "booking": { "cal_demo": false, "cal_strategy": false, "cal_audit": false },
    "affiliate": { "accounts": false, "rate": "default" },
    "killswitches": { "all_apis": false, "ai_features": false }
  }
}
```

**Status-Logik:**
- `broken`: ≥1 required-Var fehlt
- `degraded`: alle required ok, aber ≥1 recommended fehlt
- `ok`: alle required + alle recommended gesetzt

**HTTP-Code:**
- 200 für alle 3 Status (Healthcheck soll immer antworten)
- 401 ohne korrektes `CRON_SECRET`

**Niemals Secret-Werte ausliefern** — nur Boolean-Flags und ggf. Var-Namen.

---

## 6. Manuelle Validation

### 6.1 Lokal

```bash
# In .env.local setzen
CRON_SECRET=dev-secret-123

# Server starten
npm run dev

# Test
curl "http://localhost:3000/api/consult-health/env-check?secret=dev-secret-123"
```

### 6.2 Production (Railway)

```bash
curl "https://clawguru.org/api/consult-health/env-check?secret=$CRON_SECRET"
```

### 6.3 CI / Pre-Deploy Check

Optional: GitHub Actions Job, der nach jedem Deploy den Healthcheck ruft und `status: "broken"` als Fail markiert.

```yaml
- name: Verify ENV after deploy
  run: |
    response=$(curl -s "https://clawguru.org/api/consult-health/env-check?secret=$CRON_SECRET")
    status=$(echo "$response" | jq -r '.status')
    if [ "$status" = "broken" ]; then
      echo "::error::Deploy verification failed: $response"
      exit 1
    fi
```

---

## 7. Maintenance

Wenn neue ENV-Vars zu `/consulting` oder Stripe-Flow hinzugefügt werden:

1. Eintrag in Tabelle 3 (richtige Sub-Sektion + Severity-Level).
2. Aufnahme in `app/api/consult-health/env-check/route.ts` (Constant `ENV_CHECKS`).
3. Test in `__tests__/consult-health-env-check-route.test.ts` ergänzen.
4. Commit-Message: `docs(consult-automation): add ENV X for purpose Y`.
