# Consult Automation — Gap Analysis & Step-by-Step Plan (2026-04-26)

> **Eigentum:** Cursor (laut `AGENTS.md` Ownership Map). Diese Datei wurde von **Windsurf auf direkten User-Auftrag** angelegt. Hand-off an Cursor ist explizit gewünscht — bitte fortführen.
> **Vorgängerdoku:** [`docs/consult-plan-expansion-2026-04-25.md`](consult-plan-expansion-2026-04-25.md)

---

## 1. Executive Summary

Die `/consulting`-Automation funktioniert real **zu ~85 %**. Zu 100 % fehlen 6 dokumentierte Lücken. Dieses Dokument priorisiert sie und definiert einen Step-by-Step-Plan, der einzeln, klein und committable ist.

**Architektur (kurz):**

```
User → /[lang]/consulting (page.tsx)
  ├─ Starter/Pro → BuyButton → POST /api/stripe/checkout → Stripe Session
  │   → Webhook checkout.session.completed → sendAccessEmail() + upsertEntitlement()
  └─ Scale → BookingButton → Cal.com (NEXT_PUBLIC_CAL_DEMO_URL) oder mailto-Fallback

Jeder CTA-Klick → trackEvent() → /api/analytics/check
  → recordCheckFunnelEventPersistent() → check_funnel_events (DB)

Cron alle 15 min (Vercel + Netlify):
  /api/consult-health/cron
    → getCheckFunnelSnapshotPersistent()
    → buildProfitFunnel()           [score 0-100, alertFlags, routing]
    → maybeNotifyConsultHealthAlerts() → Webhook (Slack/JSON)
    → consult_health_notify_events (DB telemetry)
```

---

## 2. Was real bereits solide funktioniert (✅)

| Komponente | Datei | Status |
|---|---|---|
| Plan-Mapping SSoT | `lib/autopilot-offering.ts:47-51` | ✅ |
| Consulting-Page (3 Tiers + Trust + CTAs) | `app/[lang]/consulting/page.tsx:1-389` | ✅ |
| BuyButton → Stripe | `components/commerce/BuyButton.tsx:70-80` | ✅ |
| BookingButton (Cal.com + mailto-Fallback) | `components/booking/BookingButton.tsx:65` | ✅ |
| Stripe Checkout API (POST) | `app/api/stripe/checkout/route.ts:201-226` | ✅ |
| Stripe Webhook (Session, Invoice, Refund, Cancel) | `app/api/stripe/webhook/route.ts:480-501` | ✅ |
| Analytics Collector akzeptiert `booking_click` | `app/api/analytics/check/route.ts:20` | ✅ |
| Funnel Persistence 24h + 7d (SQL) | `lib/check-funnel.ts:129-165` | ✅ |
| Migration `check_funnel_events` | `scripts/db/migrations/007_check_funnel_events.sql` | ✅ |
| Consult-Funnel Slot-Counts + Concentration | `lib/consult-funnel.ts:40-94` | ✅ |
| Profit-Funnel + Health-Score (4 Flags) | `lib/profit-funnel.ts:40-104` | ✅ |
| Notify (Slack + generic JSON + cooldown) | `lib/consult-health-notify.ts:177-234` | ✅ |
| Persistente Notify-Telemetrie 24h/7d/30d | `lib/consult-health-notify.ts:248-323` | ✅ |
| Cron-Route (CRON_SECRET) | `app/api/consult-health/cron/route.ts:24-49` | ✅ |
| Vercel Cron `*/15 * * * *` | `vercel.json:6-11` | ✅ |
| Netlify Scheduled Function `*/15 * * * *` | `netlify/functions/consult-health-cron.js`, `netlify.toml:45-46` | ✅ |
| Retention-Signal `consult_booking_share` mit 7d-Gate | `lib/autopilot-retention.ts:85-106` | ✅ |
| Middleware `/[lang]/consult` → 308 → `/[lang]/consulting` | `middleware.ts:431-442` | ✅ |
| Middleware SEO-Indexable Whitelist | `middleware.ts:468` | ✅ |
| Tests (4 Suites) | `__tests__/consult-*.test.ts` | ✅ |

---

## 3. Identifizierte Gaps & Priorisierung

| # | Gap | Severity | Effort | Prio | Fix-Status |
|---|---|---|---|---|---|
| 5 | ENV-Documentation + Healthcheck fehlt | 🔴 Critical | Klein | **P0** | Pending |
| 1 | Doppel-Cron Vercel + Netlify gleichzeitig | 🟡 High | Trivial | **P0** | Pending |
| 4 | In-Memory `consultingBookingClicks` zählt falsch (Source-Filter fehlt) | 🟡 High | Klein | **P1** | Pending |
| 2 | Notify-Cooldown In-Memory → nicht cold-start-resistent | 🟠 Medium | Mittel | **P1** | Pending |
| 3 | `NEXT_PUBLIC_CAL_DEMO_URL` ungesetzt → mailto-Fallback (UX-Issue) | 🟢 Low | Trivial (env) | **P2** | Pending |
| 6 | Kein End-to-End-Test für Stripe-Payment-Flow | 🟢 Low | Groß | **P3** | Pending |

---

## 4. Step-by-Step Plan (in Reihenfolge der Ausführung)

### **Step 1 — Gap 5: ENV-Documentation + Healthcheck (P0)**

**Warum zuerst:** Ohne klares ENV-Verständnis läuft kein Fix in Produktion. Schafft die Basis für alle weiteren Steps.

**Deliverables:**
1. **Neues Dokument** `docs/consult-automation-env-2026-04-26.md` mit:
   - Vollständige Liste aller ENV-Vars für den Workflow
   - Pflicht/Optional-Markierung
   - Wirkung wenn fehlt
   - Beispielwerte (ohne Secrets)
   - Pro Plattform (Vercel + Netlify)

2. **Healthcheck-Endpoint** `/api/consult-health/env-check` (NEU):
   - GET-Route, mit `CRON_SECRET` geschützt
   - Liest alle erwarteten ENV-Vars und meldet `configured: true|false`
   - Antwortet mit Severity (`ok` / `degraded` / `broken`)
   - Liefert konkrete Hinweise pro fehlender Var

**Akzeptanzkriterien:**
- `docs/consult-automation-env-2026-04-26.md` enthält alle ENV-Vars aus `app/api/stripe/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, `app/api/auth/activate`, `lib/email.ts`, `lib/access-token.ts`, `app/api/consult-health/cron/route.ts`, `lib/consult-health-notify.ts`, `components/booking/BookingButton.tsx`.
- `/api/consult-health/env-check` liefert in einem unkonfigurierten Setup z. B. `{ status: "broken", missing: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", ...], degraded: ["NEXT_PUBLIC_CAL_DEMO_URL"] }`.
- Test: `__tests__/consult-health-env-check-route.test.ts`.

**Files (alle in Cursor-Scope):**
- `docs/consult-automation-env-2026-04-26.md` (neu)
- `app/api/consult-health/env-check/route.ts` (neu)
- `__tests__/consult-health-env-check-route.test.ts` (neu)

---

### **Step 2 — Gap 1: Cron-Strategie für Railway-Production (P0)**

**Problem (kontextualisiert):**
Production läuft auf **Railway** (laut `AGENTS.md:763` Migration 20.04.2026). Vercel + Netlify sind Standby/Staging. `railway.json` enthält **keinen Cron** — Railway hat keinen nativen Cron-Mechanismus für Web-Services. Aktuell registrieren BEIDE Standby-Plattformen denselben Cron `*/15 * * * *` auf ihren eigenen Domains, die nicht zwingend mit Production-DB synced sind. → **Risiko:**
- Vercel-Cron feuert auf Vercel-Standby-Deploy → ruft Vercel-eigenen `/api/consult-health/cron` → liest evtl. eine andere DB (oder dieselbe → dann werden Production-Webhooks vom Standby-Deploy gesendet)
- Netlify-Cron feuert via Scheduled Function → ruft `https://clawguru.org/api/consult-health/cron` (Production-Domain auf Railway) → korrekter Pfad, aber dann doppelt mit Vercel
- Beide Plattformen haben In-Memory-Cooldown, der zwischen Plattformen NICHT geteilt wird

**Empfehlung (zur Bestätigung):**

**Option A (sauber, empfohlen):** Externer Cron-Scheduler (cron-job.org, EasyCron, GitHub Actions Schedule)
- Ruft Production-URL `https://clawguru.org/api/consult-health/cron?secret=$CRON_SECRET` alle 15 min
- Vercel + Netlify Crons komplett entfernen
- Railway bleibt unberührt (kein Cron-Service nötig)

**Option B (pragmatisch, minimal):** Nur Netlify Scheduled Function behalten
- Sie ruft via `fetch()` die Production-URL auf — funktioniert plattformunabhängig (siehe `netlify/functions/consult-health-cron.js:9` `URL("/api/consult-health/cron", siteUrl)`)
- Vercel-Cron entfernen (würde nur eigenen Standby-Deploy hitten)
- Voraussetzung: Netlify-Account muss aktiv bleiben (auch nur für Cron)

**Option C (Railway-native):** Separater Railway-Cron-Service
- Neuer Service-Type in Railway Project (Schedule Worker)
- Ruft `https://clawguru.org/api/consult-health/cron` alle 15 min
- Bedingt Railway-Plan, der Cron-Services unterstützt
- Höchste Konsolidierung

**Deliverables (Option B, falls bestätigt — kleinste Änderung):**
1. `vercel.json` `crons`-Block entfernen
2. `netlify.toml` + `netlify/functions/consult-health-cron.js` bleiben (Netlify Scheduled Function callt Production-URL über `SITE_URL` ENV)
3. ENV `SITE_URL=https://clawguru.org` auf Netlify gesetzt (oder Default ist OK, da `URL || DEPLOY_PRIME_URL || SITE_URL || "https://clawguru.org"` Fallback hat)
4. Doku-Update mit Plattform-Entscheidung

**Akzeptanzkriterien:**
- Nur EINE Quelle ruft `/api/consult-health/cron` alle 15 min
- Cron-Endpoint trifft Production-DB (Railway), nicht Standby-DB
- Verifizierbar via 24h Log-Beobachtung in `consult_health_notify_events`-Tabelle (genau 96 ± 4 `attempted`/`skipped_*` Events pro Tag = 24h × 4 alle 15 min)

**Files (alle Cursor-Scope mit Shared):**
- `vercel.json` (Shared — coordination)
- ggf. `netlify.toml` (Shared — coordination)
- `docs/consult-automation-env-2026-04-26.md` (Cursor-Scope)
- ggf. `netlify/functions/consult-health-cron.js` (Cursor-Scope)

> ⚠️ Plattform-Entscheidung muss vom User bestätigt werden, bevor Edits an Shared-Files erfolgen.

---

### **Step 3 — Gap 4: In-Memory-Snapshot Source-Filter fixen (P1)**

**Problem:** `lib/check-funnel.ts:67`:

```ts
consultingBookingClicks24h: countSince("booking_click", since24h),
```

Zählt **alle** booking_clicks, nicht nur consult-sourced. SQL-Variante (`line 138-144`) filtert korrekt nach `source LIKE 'consulting_%' OR source = 'enterprise_api_cta'`. Bei DB-Ausfall → falsch-positiv inflated → Profit-Funnel-Health-Score zu hoch → Alert wird fälschlicherweise unterdrückt.

**Deliverables:**
1. **`recordCheckFunnelEvent`-Signatur erweitern** um optionalen `source: string`-Parameter.
2. **In-Memory-Rows zusätzlich `source: string` speichern.**
3. **`countSince`-Variante hinzufügen** die nach Source-Pattern filtert.
4. **`getCheckFunnelSnapshot()` korrigieren** um `consultingBookingClicks24h` korrekt zu filtern.
5. **Test:** `__tests__/check-funnel-source-filter.test.ts` — pumpt 5 booking_clicks mit gemischten Sources rein, asserted, dass `consultingBookingClicks24h` korrekt zählt.

**Akzeptanzkriterien:**
- In-Memory-Variante zählt nur `consulting_*` + `enterprise_api_cta`.
- Bestehende DB-Variante bleibt unverändert.
- Kein Breaking Change für `recordCheckFunnelEvent`-Aufrufer ohne Source.

**Files (alle in Cursor-Scope, mit einer Ausnahme):**
- `lib/check-funnel.ts` (laut AGENTS.md vmtl. Cursor-Scope, da `check-funnel` zur Consult-Domain gehört — verify before edit)
- `app/api/analytics/check/route.ts` (Source aus meta_json an `recordCheckFunnelEventPersistent` durchreichen)
- `__tests__/check-funnel-source-filter.test.ts` (neu)

---

### **Step 4 — Gap 2: Notify-Cooldown DB-persistent machen (P1)**

**Problem:** `lib/consult-health-notify.ts:20`:

```ts
const lastSentMs = new Map<string, number>()
```

In-Memory. Bei Serverless-Cold-Start (häufig bei niedrigem Traffic) wird der Map geleert. → Erste Cron-Invocation nach Cold-Start sendet erneut, auch wenn `consult_health_notify_events` einen `sent`-Eintrag von vor 5 min hat.

**Deliverables:**
1. **`maybeNotifyConsultHealthAlerts()` umbauen:**
   - Vor Notify: `SELECT max(created_at) FROM consult_health_notify_events WHERE event = 'sent' AND meta_json->>'fingerprint' = $1`.
   - Wenn `now - max(created_at) < cooldownMs()` → skip mit `recordPersistent('skipped_cooldown', ...)` und return.
   - Fallback: Wenn DB nicht verfügbar (`hasDatabase() === false`), bleibt In-Memory-Cooldown aktiv.
2. **`fingerprint()` als Meta-Field beim `attempted`/`sent`-Insert speichern** (in `meta_json`), damit der Cooldown-Lookup ihn finden kann.
3. **Test:** `__tests__/consult-health-notify-cooldown-db.test.ts` — simuliert Cold-Start (clear `lastSentMs`), aber DB hat `sent`-Eintrag innerhalb Cooldown → Notify wird unterdrückt.

**Akzeptanzkriterien:**
- Cooldown wirkt auch bei Cold-Start.
- Tests bestätigen DB-Lookup-Path.
- In-Memory bleibt Fallback für DB-loses Setup.

**Files (alle in Cursor-Scope):**
- `lib/consult-health-notify.ts`
- `__tests__/consult-health-notify-cooldown-db.test.ts` (neu)

---

### **Step 5 — Gap 3: Cal.com Demo-URL setzen (P2)**

**Problem:** Wenn `NEXT_PUBLIC_CAL_DEMO_URL` fehlt, fällt der Scale-CTA auf `mailto:enterprise@clawguru.org` zurück. Funktional, aber UX-Issue: kein Calendar-Picker, kein Confirmation-Flow.

**Deliverables:**
1. **ENV-Setup:** `NEXT_PUBLIC_CAL_DEMO_URL` setzen (z. B. `https://cal.com/clawguru/enterprise-demo`) — auf Vercel + Netlify.
2. **Doku-Update** in `docs/consult-automation-env-2026-04-26.md`: ENV als "stark empfohlen" kennzeichnen.
3. **Optional UX-Verbesserung (later):** Inline-Booking-Form mit Cal-Embed statt externer Redirect.

**Akzeptanzkriterien:**
- Scale-CTA öffnet Cal.com-Flow im neuen Tab.
- `booking_click`-Event hat `channel: calendly`.

**Files:** Reines ENV-Setup. Optional UX-Fix in `components/booking/BookingButton.tsx` (Cursor-Scope).

---

### **Step 6 — Gap 6: End-to-End Stripe-Test (P3)**

**Problem:** Unit-Tests prüfen Funnel-Math und Route-Contracts, aber keiner fährt einen kompletten Stripe-Test-Modus-Checkout durch.

**Deliverables:**
1. **Playwright-Test** `tests/e2e/consulting-checkout.spec.ts`:
   - Lädt `/de/consulting`.
   - Klickt "Pro aktivieren".
   - Erwartet Redirect zu `checkout.stripe.com`.
   - (Optional, mit Stripe-Test-Mode + Test-Cards) Vollendet Checkout, erwartet Magic-Link-Email-Mock-Receipt.
2. **CI-Job:** `npm run test:e2e:consulting` (separater Job, da langsamer).
3. **Stripe-CLI-Webhook-Test:** Skript, das `stripe trigger checkout.session.completed` schießt und Webhook-Verarbeitung prüft.

**Akzeptanzkriterien:**
- Playwright-Test lädt, klickt, erwartet Stripe-URL-Redirect (basis-level).
- Webhook-Trigger-Skript dokumentiert in `docs/consult-automation-env-2026-04-26.md`.

**Files (alle in Cursor-Scope):**
- `tests/e2e/consulting-checkout.spec.ts` (neu)
- `scripts/test-stripe-webhook.sh` (neu)
- `package.json` (Shared, koordinieren)

---

## 5. Hand-off & Coordination

- **Primary Owner ab hier:** Cursor (laut AGENTS.md Ownership Map).
- **Touched-Shared-Files (mit Coordination-Pflicht):** `vercel.json`, `netlify.toml`, `package.json`.
- **Commit-Convention:** Pro Step ein Commit, single concern. Beispiel: `feat(consult-automation): step 1 — env documentation + healthcheck endpoint`.
- **5-Page-Rule (laut User-Workflow):** Alle 5 abgeschlossenen Schritte → Commit + Push.

## 6. Status Log

| Datum | Step | Owner | Status | Commit |
|---|---|---|---|---|
| 2026-04-26 | Plan dokumentiert | Windsurf | ✅ Done | `b06c6d9a` |
| 2026-04-26 | Step 1 ENV-Doku + Healthcheck | Windsurf (delegated by user) | ✅ Done | (next commit) |
| — | Step 2 Cron-Strategie (Railway primary) | Pending platform decision | ⏳ Pending | — |
| — | Step 3 Source-Filter | Cursor | ⏳ Pending | — |
| — | Step 4 Cooldown DB | Cursor | ⏳ Pending | — |
| — | Step 5 Cal.com URL | Cursor | ⏳ Pending | — |
| — | Step 6 E2E Stripe | Cursor | ⏳ Pending | — |

### Step 1 Deliverables (2026-04-26)

- ✅ `docs/consult-automation-env-2026-04-26.md` — 35 ENV-Vars dokumentiert (10 required, 7 recommended, 18 optional)
- ✅ `app/api/consult-health/env-check/route.ts` — CRON_SECRET-protected GET endpoint, status `ok`/`degraded`/`broken`, no secret leakage
- ✅ `__tests__/consult-health-env-check-route.test.ts` — 16 unit tests, all green (auth/classification/aliases/security)
- ✅ jest run: 16 passed, 0 failed, 4.5s
