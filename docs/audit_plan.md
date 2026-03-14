# ClawGuru Forensic Execution Plan

## Purpose
Diese Datei dokumentiert den Status der Phase A/B Beobachtungen und Sicherheitsarbeiten, damit jeder Agent jederzeit nachschlagen kann.

## Aktueller Stand (Stand 14. März 2026)
1. **Phase A: Observability ohne Verhaltensänderung** – abgeschlossen
   - ✅ A.1 umgesetzt: `lib/ops/telemetry.ts`, `lib/ops/request-id.ts`, `middleware.ts` Request-ID Header
   - ✅ A.2 Teil 1 umgesetzt: Telemetrie in `stripe/checkout`, `stripe/webhook`, `auth/activate`, `download`, `sitemap.xml`, `sitemap-index`, `sitemaps/[name]`, `robots.txt`
   - ✅ gezielter Lint-Smoketest durchgeführt
2. **Phase B: Security Guardrails und Dummy-Endpunkte** – abgeschlossen
   - ✅ `lib/api-security.ts` eingeführt (Feature-Flags + Shared-Secret-Auth)
   - ✅ `/api/security-check` flag-gated abgesichert (`SECURITY_CHECK_REAL_ENABLED`)
   - ✅ `/api/v1/check-indicator` flag-gated abgesichert (`V1_CHECK_INDICATOR_ENFORCE_AUTH`)
   - ✅ `/api/v1/intel-feed/latest` flag-gated API-Key-Auth (`V1_INTEL_REQUIRE_AUTH`)
   - ✅ `/api/v1/runbook/[id]` mit default-auth + optionalem Flag (`V1_RUNBOOK_REQUIRE_AUTH`) abgesichert
   - ✅ echter Datenmodus für `/api/v1/runbook/[id]` über `RUNBOOKS` integriert (`V1_RUNBOOK_REAL_DATA`)
3. **Phase C: SEO Core Fixes** – In Arbeit
   - ✅ C.1 umgesetzt: Canonical/Hreflang-Metadaten für Locale-Home stabilisiert (`app/[lang]/layout.tsx`, `app/[lang]/page.tsx`)
   - ✅ Route-Konflikt bereinigt: doppelte Locale-CVE-Route (`app/[lang]/solutions/fix-[cve]/page.tsx`) entfernt
   - ✅ Locale-Linking auf Hub-Seiten korrigiert (`provider`, `issue`, `service`, `year`, `providers`, `issues`, `services`, `years`)
   - ✅ fehlende Locale-Route ergänzt: `app/[lang]/service/[slug]/page.tsx`
   - ✅ locale-aware Links/JSON-LD auch für `tools/check-[service_name]` korrigiert
4. **Phase D: SEO-Sitemap-Stack** – In Arbeit
   - ✅ `app/sitemap-index/route.ts` auf kanonischen Index umgestellt (308 Redirect auf `/sitemap.xml`)
   - ✅ Health-Checks auf den kanonischen `/sitemaps/*` Stack umgestellt (`lib/selfhealth.ts`, `app/api/sitemap-health/route.ts`)
   - ✅ Legacy-Sitemap-Endpunkte unter `app/sitemap/*` konsolidiert (alle auf 308 Redirect zu `/sitemap.xml`)
   - ✅ Middleware-BYPASS für `/sitemap/*` ergänzt, damit kein Locale-Redirect die Sitemap-Redirects überschreibt (`middleware.ts`)
   - ✅ D.2 vorbereitet: Post-Deploy-Checkskript `scripts/check-sitemap-redirects.js` + npm script `check:sitemap-redirects`
   - ✅ Live-Check gegen `https://clawguru.org` jetzt grün (`13 pass / 0 fail`)
   - ✅ Legacy-Route `/securitycheck` stabilisiert (`/securitycheck -> /check`, `/<lang>/securitycheck -> /<lang>/check`)
   - ✅ `/de/intel` Produktions-500 behoben (Root-Cause: ungültiger `i18n`-Funktionsaufruf in `components/intel/IntelFeed.tsx`)
   - ✅ `DYNAMIC_SERVER_USAGE` Produktions-500 auf `/<lang>/issue/*` behoben (`app/[lang]/issue/[slug]/page.tsx` locale-safe umgesetzt + `dynamic = "force-dynamic"`)
   - ✅ `DYNAMIC_SERVER_USAGE` Produktions-500 auf `/<lang>/provenance/*` behoben (`app/[lang]/provenance/[runbook-slug]/page.tsx` locale-safe Redirect + `dynamic = "force-dynamic"`)
   - ✅ Live-Smoke-Check grün: `https://clawguru.org/ru/issue/ebpf-security` = `200`, `https://clawguru.org/de/provenance/prometheus-rabbitmq-hsts-2030` = `307` zu kanonischem Provenance-Pfad
   - ✅ Monitoring-Check ergänzt: `npm run check:prod-smoke -- --base=https://clawguru.org` (kritische Pages + erwartete Redirect/Auth-Responses)
   - ⛔️ Rest: Search-Console-Reindexing/Monitoring-Auswertung (Sitemap technisch grün)

## Nächste Schritte (Punkt für Punkt)
1. **Phase D.2**: Direkt nach Deploy `npm run check:sitemap-redirects -- https://<prod-domain>` ausführen.
2. Search Console prüfen: nur `/sitemap.xml` einreichen; Legacy-`/sitemap/*` als Redirect verifizieren.
3. Legacy-Crawler-Monitoring: 404/Redirect-Rate für alte `/sitemap/*` Pfade beobachten.
4. `npm run check:prod-smoke -- --base=https://clawguru.org` täglich nach Deploy ausführen und Ergebnisse protokollieren.

### Search-Console-Reindexing-Checkliste (operativ)
- Sitemap-Einreichung auf eine Quelle begrenzen: nur `https://clawguru.org/sitemap.xml`.
- Alte Einträge (`/sitemap-index`, `/sitemap/*`, `*.xml` Legacy) in der Search Console nicht neu einreichen; als Redirect akzeptieren.
- Für repräsentative Seiten Live-URL-Inspektion starten:
  - `https://clawguru.org/de/intel`
  - `https://clawguru.org/ru/issue/ebpf-security`
  - `https://clawguru.org/provenance/prometheus-rabbitmq-hsts-2030`
- Nach dem Deploy 48-72h beobachten:
  - `Gelesene Sitemaps` steigt für `/sitemap.xml`
  - `Weitergeleitete URL`-Signale für alte `/sitemap/*` sind erwartbar
  - keine neuen `500`/`Soft 404` Cluster auf `/issue/*` und `/provenance/*`

### Search-Console-Monitoring-Runbook (D.3)
- **Täglich (erste 14 Tage nach SEO-Deploy):**
  - `npm run check:sitemap-redirects -- https://clawguru.org`
  - `npm run check:prod-smoke -- --base=https://clawguru.org`
  - Search Console: Coverage/Indexing-Report auf neue Fehler-Spikes prüfen (`Serverfehler (5xx)`, `Soft 404`, `Weitergeleitete Seite`).
- **Wöchentlich (ab Woche 3):**
  - Search Console Vergleich zur Vorwoche: Anzahl gültiger indexierter Seiten vs. ausgeschlossene Seiten.
  - Legacy-Pfade stichprobenartig prüfen (`/sitemap/runbooks`, `/sitemap/providers.xml`, `/sitemap-index`) auf `308` → `/sitemap.xml`.
- **Zielwerte / Erwartung:**
  - Technische Checks bleiben stabil bei `13/0` (sitemap) und `7/0` (prod smoke).
  - Keine neuen 5xx-Cluster für `/<lang>/issue/*` und `/<lang>/provenance/*`.
  - Redirect-Excludes für alte `/sitemap/*` können anfangs steigen, sollten danach abflachen.
- **Eskalation (sofort handeln):**
  - irgendein FAIL in `check:sitemap-redirects` oder `check:prod-smoke`
  - Search Console zeigt neue 5xx-Häufung auf SEO-kritischen Routen
  - `/sitemap.xml` fällt auf `!=200` oder liefert kein `<sitemapindex>`

## Flag-Konfiguration (zum schnellen Nachschlagen)
- `OBS_ENABLED` (default `0`) — aktiviert Logging-Sampling
- `OBS_SAMPLE_RATE` (0-1)
- `V1_CHECK_INDICATOR_ENFORCE_AUTH` (default `0`)
- `V1_INTEL_REQUIRE_AUTH` (default `0`)
- `SECURITY_CHECK_REAL_ENABLED` (default `0`)
- `SECURITY_CHECK_SECRET` (optional shared secret)
- `V1_CHECK_INDICATOR_SECRET` (optional shared secret)
- `V1_RUNBOOK_REQUIRE_AUTH` (default `1`, bei gesetztem Env auswertbar)
- `V1_RUNBOOK_REAL_DATA` (default `0`)
- `AI_RATE_LIMIT_ENABLED` (default `0`)

## Wichtige Referenzen
- Forensic Audit Report: Phase 1-14 (siehe Chat-Output vom 14.03.2026)
- Memory `ClawGuru Forensic Audit Scope`
- Flag-gesteuerte Rollout-Strategie (Phase A → Phase B, see plan above)

## Letzte Umsetzung (aktuelle Session)
- `middleware.ts`: `x-request-id` Header wird für pass-through und redirects gesetzt.
- Neue Utilities: `lib/ops/telemetry.ts`, `lib/ops/request-id.ts`.
- Instrumentierte Routen:
  - `app/api/stripe/checkout/route.ts`
  - `app/api/stripe/webhook/route.ts`
  - `app/api/auth/activate/route.ts`
  - `app/api/download/route.ts`
  - `app/sitemap.xml/route.ts`
  - `app/sitemap-index/route.ts`
  - `app/sitemaps/[name]/route.ts`
  - `app/robots.txt/route.ts`
  - `lib/api-security.ts`
  - `app/api/security-check/route.ts`
  - `app/api/v1/check-indicator/route.ts`
  - `app/api/v1/intel-feed/latest/route.ts`
  - `app/api/v1/runbook/[id]/route.ts`
  - `app/provider/[slug]/page.tsx`
  - `app/issue/[slug]/page.tsx`
  - `app/service/[slug]/page.tsx`
  - `app/year/[year]/page.tsx`
  - `app/providers/page.tsx`
  - `app/issues/page.tsx`
  - `app/services/page.tsx`
  - `app/years/page.tsx`
  - `app/[lang]/service/[slug]/page.tsx`
  - `app/tools/check-[service_name]/page.tsx`
  - `app/sitemap-index/route.ts`
  - `lib/selfhealth.ts`
  - `app/api/sitemap-health/route.ts`
  - `app/sitemap/runbooks/route.ts`
  - `app/sitemap/providers/route.ts`
  - `app/sitemap/tags/route.ts`
  - `app/sitemap/solutions/route.ts`
  - `app/sitemap/cves/route.ts`
  - `app/sitemap/runbooks.xml/route.ts`
  - `app/sitemap/providers.xml/route.ts`
  - `app/sitemap/tags.xml/route.ts`
  - `app/sitemap/solutions.xml/route.ts`
  - `app/sitemap/cves.xml/route.ts`
  - `scripts/check-sitemap-redirects.js`
  - `scripts/check-production-smoke.js`
  - `package.json`
  - `middleware.ts`
  - `components/intel/IntelFeed.tsx`
  - `components/intel/IntelApiDocs.tsx`
  - `app/[lang]/intel/page.tsx`
  - `app/securitycheck/page.tsx`
  - `app/[lang]/securitycheck/page.tsx`
  - `app/[lang]/issue/[slug]/page.tsx`
  - `app/[lang]/provenance/[runbook-slug]/page.tsx`

## D.2 Deployment-Runbook (kurz)
- Command: `npm run check:sitemap-redirects -- https://clawguru.org`
- Erwartung:
  - alte `/sitemap/*` und `/sitemap-index` liefern `308` auf `https://clawguru.org/sitemap.xml`
  - `https://clawguru.org/sitemap.xml` liefert `200` + `<sitemapindex>`
  - `https://clawguru.org/sitemaps/runbooks-a-f.xml` liefert `200` + `<urlset>`
- Wenn FAIL:
  - Redirect-Header in Vercel/Edge prüfen
  - Route-Konflikte mit alten Catch-All-Regeln ausschließen
  - Search Console erst nach grünem Check neu anstoßen
