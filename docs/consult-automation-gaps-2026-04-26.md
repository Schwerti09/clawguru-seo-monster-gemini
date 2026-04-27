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

### **Step 5 — Gap 3: Cal.com Demo-URL setzen + URL-Validation (P2)** ✅ Done (27.04.2026)

**Ausgangsproblem:** Wenn `NEXT_PUBLIC_CAL_DEMO_URL` fehlt, fällt der Scale-CTA auf `mailto:enterprise@clawguru.org` zurück. Funktional, aber UX-Issue: kein Calendar-Picker, kein Confirmation-Flow.

**Zweites Problem (während Implementierung entdeckt):** Vor Step 5 akzeptierte `BookingButton` jeden truthy String als Cal-URL — ein Tippfehler im Railway-Dashboard (`NEXT_PUBLIC_CAL_DEMO_URL=TODO`, `cal.com/...` ohne Schema, `javascript:...`) hätte den CTA komplett zerbrochen statt zum sicheren Mailto-Fallback zu gehen. Außerdem hätte `/api/consult-health/env-check` die Var fälschlich als "configured" gemeldet, obwohl die User-facing Funktion offline ist.

**Implementierte Deliverables:**

1. ✅ **`lib/booking-url.ts` (neu, 60 Zeilen):**
   - `isValidBookingUrl(url)` — predikat-Check: String, https-Schema, Host auf `cal.com` / `calendly.com` / Subdomain.
   - `resolveBookingUrl(url)` — gibt getrimmte URL zurück oder `null`. Konsumenten haben einen 1-Liner-Fallback-Hook.

2. ✅ **`components/booking/BookingButton.tsx`:** verwendet `resolveBookingUrl(...)` statt `Boolean(...)`. Alle 3 Cal-Vars (Strategy/Audit/Demo) gehen durch dieselbe Validation. Mailto-Fallback bleibt unverändert.

3. ✅ **`app/api/consult-health/env-check/route.ts`:** `EnvCheck` um optional `validator: (value: string) => boolean` erweitert. Die 3 booking-Checks bekommen `validator: isValidBookingUrl`. Ein Tippfehler im Railway-Dashboard erscheint jetzt als `summary.recommended.missing` (für `cal_demo`) bzw. `summary.optional.missing` (für `cal_strategy`/`cal_audit`) → `status` springt auf `degraded`.

4. ✅ **Doku-Update** in `docs/consult-automation-env-2026-04-26.md` §3.7 — Validation-Regeln, Fehlerbilder, Test-Referenzen. Außerdem §4.1 Railway-Snippet erweitert um Hinweis auf URL-Validation.

5. ✅ **Tests:**
   - `__tests__/booking-url.test.ts` (neu) — 39 Cases: valide URLs, leere/null/undefined, Placeholder, falsches Schema (http/javascript/data/mailto/ftp/file), fremde Hosts, Case-Insensitivity, `resolveBookingUrl`-Vertrag.
   - `__tests__/consult-health-env-check-route.test.ts` (erweitert) — 5 zusätzliche Cases für die neuen Validation-Verhalten.
   - Jest run beider Suites: **60 passed, 0 failed**, ~2.4s.

**Akzeptanzkriterien:**
- ✅ Scale-CTA öffnet Cal.com-Flow im neuen Tab (wenn ENV korrekt gesetzt).
- ✅ Falsche/fehlende ENV → sicherer Mailto-Fallback statt kaputter URL.
- ✅ `booking_click`-Event hat `channel: calendly` bei valider URL, `channel: mailto` sonst.
- ✅ `/api/consult-health/env-check` flagt Tippfehler im Dashboard.

**Pending User-Action:** Im Railway-Dashboard die echten Cal.com-URLs eintragen (mindestens `NEXT_PUBLIC_CAL_DEMO_URL`).

**Foreign-WIP-Beobachtung beim Test-Run (multi-agent commit hygiene):** Vor dem Step-5-Commit zeigte die Full-Jest-Suite 5 Failures in `__tests__/consult-health-notify*` — alle in Files, die **nicht** zu Step 5 gehören. `git diff HEAD -- lib/consult-health-notify.ts` zeigt: ein anderer Agent hat den synchronen Memory-Cooldown-Check aus Commit `9f270106` (Step 4) durch eine all-async Refactoring-Variante ersetzt, die jetzt Cooldown-Race-Conditions im Single-Process-Setup nicht mehr blockt → `fetch` wird 2× statt 1× aufgerufen. Das ist **nicht meine Regression**, deshalb habe ich diese Files **nicht** in den Step-5-Commit aufgenommen (`git add` mit expliziten Pfaden statt `git add -A`). Die in Isolation gefahrenen Step-5-Tests sind alle grün (60/60). Empfehlung an den Owner von `lib/consult-health-notify.ts`: synchronen Memory-Check vor dem `void (async () => { ... })()`-Block wiederherstellen, wie in `9f270106`.

**Files (alle Windsurf-Scope, keine Shared/Cursor-Files berührt):**
- `lib/booking-url.ts` (new)
- `__tests__/booking-url.test.ts` (new)
- `components/booking/BookingButton.tsx` (modified)
- `app/api/consult-health/env-check/route.ts` (modified)
- `__tests__/consult-health-env-check-route.test.ts` (modified)
- `docs/consult-automation-env-2026-04-26.md` (modified)
- `docs/consult-automation-gaps-2026-04-26.md` (modified)

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
| 2026-04-26 | Step 1 ENV-Doku + Healthcheck | Windsurf (delegated by user) | ✅ Done | `6dca59a1` |
| 2026-04-26 | Step 2 Railway-native Cron | Windsurf (delegated by user) | ✅ Done — needs Railway Dashboard setup | `52b4e07b` |
| 2026-04-26 | Step 3 Source-Filter | Windsurf (delegated by user) | ✅ Done — code in mega-bundle commit | `f244c072` ⚠️ |
| 2026-04-26 | Step 4 Cooldown DB-persistent | Windsurf (delegated by user) | ✅ Done | `9f270106` |
| 2026-04-27 | Step 5 Cal.com URL + Validation | Windsurf (delegated by user) | ✅ Done — needs Railway-Dashboard ENV input | (next commit) |
| — | Step 6 E2E Stripe | Cursor | ⏳ Pending | — |

### Step 1 Deliverables (2026-04-26)

- ✅ `docs/consult-automation-env-2026-04-26.md` — 35 ENV-Vars dokumentiert (10 required, 7 recommended, 18 optional)
- ✅ `app/api/consult-health/env-check/route.ts` — CRON_SECRET-protected GET endpoint, status `ok`/`degraded`/`broken`, no secret leakage
- ✅ `__tests__/consult-health-env-check-route.test.ts` — 16 unit tests, all green (auth/classification/aliases/security)
- ✅ jest run: 16 passed, 0 failed, 4.5s

### Step 2 Deliverables (2026-04-26)

User decision: **Railway-only**. Netlify and Vercel completely removed as cron sources.

- ✅ `scripts/cron/consult-health-tick.mjs` — portable Node script, calls `https://clawguru.org/api/consult-health/cron` with Bearer auth, JSON-structured logging, exit-code semantics (0=ok, 1=transport, 2=auth, 3=server, 4=config)
- ✅ `vercel.json` — `crons` block removed
- ✅ `netlify.toml` — `[functions."consult-health-cron"]` block removed (replaced with comment pointing at Railway setup)
- ✅ `netlify/functions/consult-health-cron.js` — deleted via `git rm`
- ✅ `docs/consult-automation-env-2026-04-26.md` Section 4 — Railway Cron Service setup runbook + emergency fallback options (cron-job.org / GitHub Actions / systemd)

**Open action for user (Railway Dashboard):**
1. Create new service `consult-health-cron` in same Railway project
2. Source: same Git repo
3. Start command: `node scripts/cron/consult-health-tick.mjs`
4. Cron schedule: `*/15 * * * *`
5. ENV: `CRON_SECRET` (same as web service), `SITE_URL=https://clawguru.org`
6. Verify after 24h: `consult_health_notify_events` table shows ~96 events

### Step 3 Deliverables (2026-04-26)

Code shipped, but as part of mega-bundle commit `f244c072` (multi-agent hygiene incident, see `AGENTS.md` 26.04.2026 incident log). Step 3 work itself is correct and tested.

- ✅ `lib/check-funnel.ts` — `EventRow.source?` field added; `recordCheckFunnelEvent(event, source?)` accepts optional source; `isConsultingBookingSource()` mirrors the SQL filter (`LIKE 'consulting_%' OR = 'enterprise_api_cta'`); `countBookingClicksSince()` replaces the wrong `countSince("booking_click", ...)` calls; `recordCheckFunnelEventPersistent()` extracts `meta.source` and forwards it.
- ✅ `__tests__/check-funnel-source-filter.test.ts` — 9 unit tests pinning the in-memory filter contract: bookingClicks24h counts everything, consultingBookingClicks24h only counts consulting + enterprise_api_cta, whitespace handling, legacy single-arg signature still works, meta.source extraction, 7d window mirroring.
- ✅ jest run: 9 passed; full consult test suite: 38 passed across 6 suites, no regressions.

**Effect:** when `DATABASE_URL` is unavailable (failover scenario), the in-memory snapshot now produces the same consultingBookingClicks numbers as the SQL path, so the profit-funnel health score is no longer inflated and consult-channel alerts are no longer silenced during outages.

### Step 4 Deliverables (2026-04-26)

Addresses Gap 3 (P1): the alert cooldown lived only in a Node-process `Map<fingerprint, ms>`, which was emptied on every cold start. After a Railway redeploy or worker restart, the first cron tick could re-fire an alert that had been sent 5 minutes earlier by the previous worker.

- ✅ `lib/consult-health-notify.ts`:
  - new `lookupLastSentFromDb(fingerprint)` reads `MAX(created_at)` for `event = 'sent'` matching the fingerprint in `consult_health_notify_events`, returning ms or `null` on DB error.
  - `maybeNotifyConsultHealthAlerts()` now does in-memory cooldown first (fast), then optimistically marks the fingerprint as in-flight to block same-process races, then awaits the DB cooldown lookup before deciding to send.
  - DB hit → `skipped_cooldown` event with `cooldownSource: 'db'`, in-memory cache hydrated with the actual DB timestamp so subsequent polls skip the DB.
  - DB error (`null`) → fall through to send (defensive: better to maybe double-alert than to silence alerts during a DB outage).
  - All `attempted` / `sent` / `failed` / `skipped_cooldown` events now write the `fingerprint` into `meta_json` so the cooldown lookup can find them.
- ✅ `__tests__/consult-health-notify-cooldown-db.test.ts` — 8 unit tests covering: DB-hit blocks send, no-row allows send, expired-row allows send, DB-error falls through, no-DATABASE_URL falls back to in-memory only, cache hydration, fingerprint in meta_json, parallel same-process call protection.
- ✅ Full consult test suite: 48 passed across 8 suites, no regressions.

**Effect:** alerts now respect the cooldown window across cold starts and multi-worker fan-out. After a Railway redeploy at minute 7 of an hour, the next cron tick at minute 15 will see the prior worker's `sent` row from minute 5 in the DB and skip with `cooldownSource: 'db'` instead of re-firing.
