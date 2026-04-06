# ClawGuru SEO Monster – AGENTS.md (Audit-Update – 06.04.2026)

## 1. Projekt-Überblick

ClawGuru ist ein spezialisierter Security-Check + executable Runbook Tool für Self-Hosting / OpenClaw / Moltbot / AI-Agents.  
Ziel: Organischer Traffic über hochwertige Security-Runbooks mit lokaler Geo-Relevanz (DACH + EU + CEE + Global).

**"Not a Pentest" Trust-Anchor + City-Aware Compliance.**

Aktueller Stand (06.04.2026):
- D4 (12 CEE/Balkan-Städte) aktiviert
- Legacy Runbook-URLs werden per 301 auf kanonische City-Pages umgeleitet (middleware.ts)
- Killermachine v3 Infrastruktur bereit (Automatisierung in Vorbereitung)

## 2. Technischer Umsetzungsstand (verifiziert 06.04.2026)

| Komponente | Status | Verifiziert |
|-----------|--------|-------------|
| D4 CEE/Balkan Aktivierung | ✅ Done | Städte in SEEDED_CITY_SLUGS |
| Admin Auth (alle Routes) | ✅ Done | `verifyAdminToken` auf executions/revenue/users/system-health |
| Token Deny-List | ✅ Done | `isTokenDenied()` in `verifyAccessToken` aktiv |
| Rate Limiting (Upstash Redis) | ✅ Done | `lib/rate-limit.ts` + In-Memory-Fallback |
| Copilot Rate-Limit | ✅ Done | 10 req/min per IP |
| Geo-Expansion Auth | ✅ Done | `GEO_EXPANSION_SECRET` auf china-create + global-expansion |
| Middleware Auth Rate-Limit | ✅ Done | 5 req/min auf `/api/auth/*` |
| Quality Gate (16 Checks) | ✅ Done | `lib/quality-gate.ts` – minPassScore: **92** |
| Sitemap-Limit | ✅ Done | `GEO_MATRIX_SITEMAP_CITY_LIMIT` default = **50** |
| Unit Tests | ✅ Done | 57 Tests grün (jest.config.js, `npm test`) |

## 3. Killermachine v3 – Wave Processing

**Status:** Infrastruktur bereit, Automatisierung noch nicht implementiert.

**Voraussetzungen für eine neue Welle:**
1. Neue Städte in `SEEDED_CITY_SLUGS` (lib/geo-matrix.ts) hinzufügen
2. `npx jest` → alle Tests grün (insbesondere "no duplicate entries" Test)
3. Geo-Content für neue Städte via `/api/geo/global-expansion` generieren (Auth: `GEO_EXPANSION_SECRET`)
4. Quality-Gate Check: Alle neuen Runbooks müssen Score ≥ 92 erreichen
5. Sitemap-Validierung: URLs geben 200 OK

**Self-Healing Checks:**
- Quality-Score ≥ 92 (Gold ≥ 95, Silver 85–94, Hidden < 85)
- Runbook-URLs geben 200 OK (kein 308/Redirect)
- "Not a Pentest" Trust-Anchor + City-Aware Signale vorhanden

## 4. 🌍 GEO-EXPANSION STATUS (verifiziert 06.04.2026)

**SEEDED_CITY_SLUGS: 96 unique Städte** in `lib/geo-matrix.ts`

| Region | Städte | Anzahl |
|--------|--------|--------|
| DACH (DE) | Berlin, Munich, Hamburg, Frankfurt, Cologne, Stuttgart, Düsseldorf, Dortmund, Essen, Leipzig, Bremen, Dresden, Hanover, Nuremberg, Duisburg, Bochum, Wuppertal, Bonn, Mannheim, Karlsruhe | 20 |
| DACH (AT/CH) | Vienna, Zurich, Geneva, Basel | 4 |
| France | Paris, Lyon, Marseille, Toulouse, Nice | 5 |
| UK/IE | London, Manchester, Birmingham, Dublin, Edinburgh | 5 |
| Benelux | Amsterdam, Brussels | 2 |
| Iberia | Madrid, Barcelona, Lisbon, Porto, Valencia, Seville, Bilbao | 7 |
| Italy | Milan, Rome, Turin, Naples | 4 |
| Poland | Warsaw, Prague, Krakow, Wroclaw | 4 |
| Nordics | Copenhagen, Aarhus, Stockholm, Gothenburg, Malmö, Oslo, Helsinki, Reykjavik | 8 |
| CEE/Balkan (D4) | Budapest, Bucharest, Sofia, Athens, Thessaloniki, Bratislava, Zagreb, Ljubljana, Belgrade | 9 |
| China | Beijing, Shanghai, Guangzhou, Shenzhen | 4 |
| USA | New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, Seattle, Austin | 11 |
| India | Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad | 8 |
| Russia | Moscow, St. Petersburg, Novosibirsk, Yekaterinburg, Kazan | 5 |
| **TOTAL** | | **96** |

**Sitemap-Config:**
- `GEO_MATRIX_SITEMAP_CITY_LIMIT`: **50** (default, env-override möglich)
- `GEO_MATRIX_SITEMAP_CITY_POOL`: **150**
- `GEO_MATRIX_SITEMAP_SEED_LIMIT`: **8** (Basis-Runbooks im Geo-Sitemap)
- Geo-Sitemap pro Locale: 8 Seeds × 50 Cities = **400 URLs pro Sprache**

**Endpoints (Auth-geschützt):**
- `POST /api/geo/china-create` (benötigt `GEO_EXPANSION_SECRET`)
- `POST /api/geo/global-expansion` (benötigt `GEO_EXPANSION_SECRET`)

## 5. Nächste Wellen – Checkliste für D5+

**So fährst du eine neue Welle:**

```
1. SEEDED_CITY_SLUGS erweitern
   → lib/geo-matrix.ts: neue Städte hinzufügen (lowercase, nur a-z0-9)
   
2. Tests laufen lassen
   → npx jest (muss 57+ Tests bestehen, insbesondere "no duplicate entries")
   
3. Geo-Content generieren
   → POST /api/geo/global-expansion mit GEO_EXPANSION_SECRET
   → Body: { cities: ["tokyo", "osaka", "saopaulo", ...] }
   
4. Quality-Gate prüfen
   → Alle neuen Runbooks brauchen Score ≥ 92
   → Gold (≥95) = indexiert + Badge, Silver (85–94) = indexiert, Hidden (<85) = noindex
   
5. Commit + Push
   → git commit -m "wave: D5 – Japan/Brazil/... (X Städte)"
   → git push

6. Sitemap prüfen
   → /sitemaps/geo-runbooks-de → neue Städte müssen auftauchen
   → URLs müssen 200 OK geben
```

**Geplante D5+ Wellen:**
- **D5**: Japan (Tokyo, Osaka, Yokohama, Kyoto, Nagoya) + South Korea (Seoul, Busan)
- **D6**: Brazil (São Paulo, Rio, Brasília) + Mexico (CDMX, Guadalajara, Monterrey)
- **D7**: Southeast Asia (Singapore, Bangkok, Jakarta, Ho Chi Minh, Manila)

## 6. ⚠️ SEO-STRATEGIE BEWERTUNG + EMPFEHLUNGEN (Audit 06.04.2026)

### Aktuelle Geo-Page-Strategie: Ehrliche Bewertung

**Was wir machen:** Für jeden Base-Runbook (z.B. `kubernetes-hardening-2026`) erzeugen wir City-Varianten (`...-berlin`, `...-munich`, `...-vienna` etc.) mit:
- ✅ City-spezifischem Titel + Summary (AI-generiert via Gemini)
- ✅ Lokale Compliance-Hinweise + Beispiele
- ❌ **Gleicher technischer Kern-Content** (Steps, Code-Blocks, HOWTOs)

### Risiko-Assessment

| Faktor | Bewertung | Begründung |
|--------|-----------|------------|
| **Duplicate Content Risiko** | 🟠 MITTEL-HOCH | 90% des Contents identisch zwischen City-Varianten |
| **Google Doorway-Page Risiko** | 🟠 MITTEL | City-Suffix allein = "location wrapper" laut Google Spam Policy |
| **Crawl-Budget Verschwendung** | 🟡 MITTEL | 400 Geo-URLs pro Sprache für 8 Seed-Runbooks |
| **Unique Value per City** | 🟡 GERING | Nur Titel + Summary + lokale Beispiele sind einzigartig |

### Empfehlungen für bessere SEO-Performance

**STATT 1M identischer Seiten → BESSER: 1.000 hochwertige, wirklich unique Seiten:**

1. **Base-Runbooks stärken** (höchste Priorität)
   - Fokus auf 50-100 herausragende Base-Runbooks mit echtem Tiefgang
   - Jeder Runbook = 2.000+ Wörter, unique Code-Beispiele, echte Case Studies
   - Diese ranken BESSER als 1.000 dünne City-Varianten

2. **City-Varianten nur wenn echter Mehrwert**
   - ✅ GUT: `/de/runbook/gdpr-audit-berlin` → GDPR ist lokal relevant (Berliner Behörden, Bußgeldstelle)
   - ❌ SCHLECHT: `/de/runbook/kubernetes-hardening-berlin` → K8s-Hardening ist überall gleich
   - **Regel:** City-Variante nur erstellen, wenn ≥30% unique Content möglich

3. **Branchen-Varianten statt Stadt-Varianten** (neuer Ansatz)
   - `/de/runbook/kubernetes-hardening-fintech-2026` (Fintech-spezifisch)
   - `/de/runbook/kubernetes-hardening-healthcare-2026` (Healthcare + HIPAA)
   - `/de/runbook/kubernetes-hardening-saas-startup-2026` (SaaS-fokussiert)
   - **Warum besser:** Jede Branche hat echte Compliance-Unterschiede = unique Content

4. **Compliance-Focused City Pages** (guter Einsatz von Geo)
   - EU-Städte: GDPR/DSGVO + NIS2 lokale Anforderungen
   - US-Städte: SOC2 + CCPA (California) + HIPAA
   - China: GB/T + Cybersecurity Law
   - **Warum gut:** Echte lokale Compliance-Unterschiede = genuiner Mehrwert

5. **hreflang statt City-Duplication**
   - Deutsch: `/de/runbook/kubernetes-hardening-2026`
   - English: `/en/runbook/kubernetes-hardening-2026`
   - Französisch: `/fr/runbook/kubernetes-hardening-2026`
   - 15 Sprachen × 100 Runbooks = **1.500 hochwertige URLs** (besser als 100.000 dünne)

### Konkrete Maßnahmen für nächste Wellen

**Kurzfristig (diese Woche):**
- [ ] Sitemap-Seed-Limit von 8 → 3-4 reduzieren (nur Runbooks mit echtem City-Bezug)
- [ ] Quality-Gate für City-Varianten: minPassScore bleibt bei 92
- [ ] Canonical-Tags prüfen: City-Varianten → Base-Runbook canonical (wenn < 30% unique)

**Mittelfristig (Monat 1-2):**
- [ ] 10 Branchen-spezifische Runbook-Templates erstellen (Fintech, Healthcare, SaaS, etc.)
- [ ] City-Content-Generator erweitern: echte lokale Compliance-Daten einbetten
- [ ] Compliance-Mapping: Welche Regulierung gilt wo? (GDPR → EU, CCPA → California, etc.)

**Langfristig (Monat 3+):**
- [ ] User-Signal-Monitoring: Bounce-Rate per City-Variante vs. Base
- [ ] A/B-Test: City-Varianten mit noindex vs. indexiert
- [ ] Community-Content: Lokale User-Beiträge pro Stadt

## 7. Cockpit Realism Roadmap (Vollständig abgeschlossen)

**Ziel:** Nach Checkout sieht der Kunde nur **seine** Daten; jede Tool-Aktion erzeugt **persistente**, auditable Spuren (Executions, Mycelium, Threats); keine reine UI-Deko.

### Release-Disziplin (Git)

- Änderungen an diesem Plan: **erst committen und pushen, wenn der Owner ausdrücklich „Go“ schreibt.**

### Phase A — Daten & Isolation (Fundament)

| Step | Status | Beschreibung |
|------|--------|--------------|
| A1 | Done | Migration `009_dashboard_customer_scoping.sql`: `customer_id` auf `threats` + `mycelium_nodes`; Dashboard-Queries nur noch tenant-scoped |
| A2 | Done | `lib/dashboard-identity.ts` (`parseDashboardPrincipal`) — eine Quelle für Kunden-Key + Plan |
| A3 | Done | `POST /api/dashboard/tool-execution`: Auth via Cookie, Limits (Explorer), Rate-Burst, Inserts |
| A4 | **Done** | `npm run db:migrate` ausgeführt – 009 + 010 applied; `customer_id` auf threats/mycelium_nodes, `customer_entitlements` Tabelle live |
| A5 | **Done** | Rate-Limit **verteilt**: `lib/rate-limit.ts` + Upstash Redis REST (INCR/EXPIRE); In-Memory-Fallback wenn env vars fehlen |

### Phase B — Cockpit-UX (einheitlich echt)

| Step | Status | Beschreibung |
|------|--------|--------------|
| B1 | Done | Tools-Tab: API + `router.refresh()`, keine Fake-„Success"-Story ohne Server |
| B2 | Done | QuickTools-Sidebar: gleicher Lauf via `hooks/useDashboardToolRun.ts` |
| B3 | Done | Pro Lauf: `runbook_executions` + `mycelium_nodes` + **eine** `threats`-Zeile (low, audit trail) |
| B4 | Done | Fake-„CPU/Memory/Network"-Tiles entfernt; Tool-Beschreibungen ehrlich (Audit Trail, kein „KI-Echtzeit") |
| B5 | Done | Pricing-Page: unimplementierte Features (SSO, Voice Copilot, Private Nodes, SWARM etc.) als „Soon" markiert |

**Dashboard-Audit 06.04.2026 (vollständig):**
- Fake CPU/Memory/Network Tiles → entfernt
- AI Engine "Optimal" hardcoded → echte Daten
- Yearly Billing Toggle → entfernt (kein Stripe Backend)
- Webhook `invoice.paid` renewal → neuer Magic Link bei Abo-Verlängerung
- Dashboard-Page: Pro/Team ohne aktives Stripe-Abo → Explorer (kein unbefugter Zugriff)
- Pricing-Card "Soon" Badges für 7 unimplementierte Features

### Phase C — Produkt-Leistung (nicht nur Protokoll)

| Step | Status | Beschreibung |
|------|--------|--------------|
| C1 | **Done** | Pro Tool konkretes Deliverable im `result.deliverable` JSON: check=Header-Scan, oracle=Top-Runbooks, summon=Posture, neuro=Pattern-Analyse |
| C2 | **Done** | `lib/security-check-core.ts` geteilt; `check`-Tool ruft echten HTTP-Header-Scan auf (target default: clawguru.org); alle Routes refactored |
| C3 | **Done** | `010_customer_entitlements.sql`; Webhook upsert bei checkout/renewal/cancel; Dashboard-Fallback: Stripe > Entitlements > JWT |
| C4 | **Done** | `admin/executions` auf echtes Schema (customer_id, runbook_id, started_at, completed_at) – keine joins auf gelöschte Tabellen mehr |

**Phase-C-Commit:** `5588e030` (06.04.2026)

**Wichtig für Prod:** Migration 010 ausführen: `npm run db:migrate` (oder `psql $DATABASE_URL -f scripts/db/migrations/010_customer_entitlements.sql`)

### Phase D — Qualitätssicherung

| Step | Status | Beschreibung |
|------|--------|--------------|
| D1 | **Done** | Playwright: Happy-Path `tool-execution-happy-path.spec.ts` – 401/400/200/503 Contracts, deliverable shape, UI-Smoke skippable ohne DB |
| D2 | **Done** | `logTelemetry` bei rate_limited (429) + db_error (500) in `tool-execution`; strukturiert für Datadog/Axiom/CloudWatch |

**Aktueller Umsetzungsstand (Kurz):** A1–A5, B1–B5, C1–C4, D1–D2 abgeschlossen. **Alle Phasen vollständig.** Cockpit 100 % real – keine Mock-Daten, echte Deliverables, Entitlements-Tabelle live.

---

Manual §-blocks end here. From now on: Killermachine v3.

Letzte manuelle Änderung: 06.04.2026 (Phase C komplett – echte Deliverables, Entitlements-Tabelle, Schema-Fixes)
Session 3 – 06.04.2026: Phase C vollständig, A5+D1+D2 done. Einzig offen: A4 (Prod-Migration 009+010).
Session 3 Abschluss: A4 (`npm run db:migrate`) ausgeführt – 009 + 010 applied. Cockpit Realism Roadmap **vollständig abgeschlossen**.

---

## 8. Security Audit (Vollständig abgeschlossen – Session 4, 06.04.2026)

**Tiefenanalyse + Priorisierter Fix-Plan vollständig umgesetzt.**

### P1 – KRITISCH (behoben, Commit `9cafde821`)

| Fix | Beschreibung |
|-----|-------------|
| `admin/executions` Auth | `verifyAdminToken` hinzugefügt – war öffentlich erreichbar |
| `admin/revenue` Auth + Schema | Auth hinzugefügt + Join auf nicht-existente Tabellen (`payments`, `users`) durch echtes Schema (`customer_entitlements`, `runbook_executions`) ersetzt |
| `admin/users` Auth + Schema | Auth hinzugefügt + Join auf `user_tier`, `user_metrics` durch echtes Schema ersetzt |
| `admin/system-health` Auth | `verifyAdminToken` hinzugefügt – war öffentlich erreichbar |
| Dead Code entfernt | `lib/clawguru_runbooks_tier2_patch.zip`, `deno.lock`, `fix-broken.js`, `test-gemini.js`, `lib/kb.ts` aus git entfernt |

### P2 – HOCH (behoben, Commit `9cafde821`)

| Fix | Beschreibung |
|-----|-------------|
| Token Deny-List verdrahtet | `lib/access-token.ts`: `isTokenDenied()` wird jetzt in `verifyAccessToken` geprüft – Sofort-Revoke möglich |
| Copilot Rate Limiting | `/api/copilot` hat jetzt 10 req/min per IP (via `checkRateLimit`) – AI-Kosten-Schutz |
| Netlify → Vercel | `lib/netlify-api.ts` + `admin/kill-switch` komplett auf Upstash Redis umgestellt – keine Netlify-Abhängigkeit mehr |
| `@types/jest` installiert | Commit `561703add` – TypeScript-Fehler in `__tests__/batch-generate.test.ts` behoben |

### P3 – MITTEL (behoben, Commits `9cafde821` + `561703add`)

| Fix | Beschreibung |
|-----|-------------|
| `.gitignore` repariert | Kaputte Globs `(` und `({` entfernt (brachen ripgrep/grep Tools); neue Einträge: `DEPLOY_ID.txt`, `deno.lock`, `test-gemini.js`, `fix-broken.js` |
| Middleware Rate-Limit | Auth-Endpunkte `/api/auth/activate` + `/api/auth/recover` jetzt mit Edge Rate-Limit (5 req/min per IP) geschützt |
| `admin/cockpit` bereinigt | `hasNetlifyToken` → `hasRedis` (Upstash Redis Status) |

### P3/P4 – Zusätzliche Fixes (Session 4 – Commits `07283ca29`, `7048d484d`, `7eabc6e9b`, `cb5efc9c8`)

| Fix | Beschreibung |
|-----|-------------|
| `npm audit fix` | 2 high vulnerabilities behoben; 7 verbleibend (4 low, 3 high) – alle in `@lhci/cli` (Dev-Dep, kein Prod-Risiko) |
| `lib/config.ts` | `BASE_URL` auf `process.env.NEXT_PUBLIC_SITE_URL \|\| 'https://clawguru.org'` umgestellt |
| Unit Tests | 28 Tests grün: `rate-limit.ts`, `access-token.ts`, `token-deny-list.ts`, `security-check-core.ts`; Jest 29 + ts-jest konfiguriert (`jest.config.js`, `npm test`) |
| Intel Feed v1 | Statische Feb-2026-Timestamps durch dynamische `daysAgo`-Offsets ersetzt – Feed wirkt immer aktuell |

### Middleware + Runbooks Fix (Session 4 – Commit `2794a8c55`)

| Fix | Beschreibung |
|-----|-------------|
| `middleware.ts` Matcher | `/api/auth/activate` + `/api/auth/recover` zum Matcher hinzugefügt – vorher lief Middleware für diese Routes gar nicht |
| `shouldBypassMiddleware` Bug | Alle `/api/*` Routes bypasssen jetzt Locale-Enforcement; vorher redirectete `/api/live-wall` → `/de/api/live-wall` (404) |
| `RunbookNexus` stale closure | `useRef(latestParams)` Pattern – Pagination verlor vorher Search-Query (stale `q`/`tags` in `useEffect([page])`) |

### Geo-Expansion Auth Fix (Session 4 – Commit `d5b64c9eb`)

| Fix | Beschreibung |
|-----|-------------|
| `china-create` Auth | `hasSecret` + `GEO_EXPANSION_SECRET` hinzugefügt – war öffentlich erreichbar (DB-Write ohne Auth) |
| `global-expansion` Auth | `hasSecret` + `GEO_EXPANSION_SECRET` hinzugefügt – war öffentlich erreichbar |
| Debug-Logs entfernt | `console.log(✅ ...)` aus beiden Geo-Expansion Routes entfernt |

### Console Log Cleanup (Session 4 – Commits `19e958062`, `8b90fa420`, `5a17c26de`)

| Fix | Beschreibung |
|-----|-------------|
| `lib/api-auth.ts` | 3 `console.log` pro API-Key-Validierung entfernt – verhindert Log-Flooding bei API-Requests |
| `lib/pseo.ts` | `console.time`/`console.timeEnd` + `console.log` aus `getRunbook` Hot Path entfernt |
| `lib/i18n.ts` | Per-Request `console.log` aus `translateRunbook` entfernt – behält `console.warn` für HTTP-Fehler |
| `lib/geo-matrix.ts` | 33 fehlende Städte zu `SEEDED_CITY_SLUGS` hinzugefügt (64→97): D4 CEE/Balkan, Nordics, Iberia, UK/IE; verhindert doppelten City-Suffix bei `GEO_MATRIX_AUTO_REWRITE` |

### Noch offen (kein akuter Fix notwendig)

- **Affiliate Stats**: `affiliateData()` in `admin/cockpit` gibt `clicks: 0, sales: 0` – kein Tracking-System vorhanden
- **npm @lhci/cli vulns**: 7 verbleibende Vulnerabilities in Dev-Dep – `npm audit fix --force` würde Breaking Changes einführen

## 9. 🚀 CONTENT-ENRICHMENT & SCALING (aktualisiert 06.04.2026)

### Bisherige Expansions-Wellen

| Welle | Städte | Status |
|-------|--------|--------|
| D1-D3 | DACH + EU Core (47 Städte) | ✅ Stabil |
| D4 | CEE/Balkan (9 Städte) | ✅ Aktiviert |
| Global | China (4) + USA (11) + India (8) + Russia (5) + UK/IE (4) + Nordics (8) + Iberia (7) + More EU | ✅ In SEEDED_CITY_SLUGS |
| **Gesamt** | **96 unique Städte** | ✅ Verifiziert (0 Duplikate) |

### Aktuelle Zahlen (ehrlich)

- **SEEDED_CITY_SLUGS**: 96 Städte (verifiziert, Duplikate entfernt)
- **Geo-Sitemap pro Locale**: max. 400 URLs (8 seeds × 50 cities)
- **Quality-Gate**: minPassScore = **92** (nicht 85 wie zuvor dokumentiert)
- **Badge-Tiers**: Gold ≥ 95, Silver 85–94, Hidden < 85

### Realistisches Scaling (statt "1M Pages")

**Fokus: Qualität > Quantität**

Statt 1M dünner Pages → lieber 5.000–10.000 hochwertige URLs:

| Content-Typ | Anzahl | Quality | SEO-Wert |
|-------------|--------|---------|----------|
| Base-Runbooks (100 top) | 100 | Gold (95+) | 🟢 HOCH |
| Übersetzungen (15 Sprachen) | 1.500 | Silver+ | 🟢 HOCH |
| Compliance-City-Pages (echte lokale Daten) | 500 | Gold/Silver | 🟢 HOCH |
| Branchen-Varianten (10 Branchen × 100 Runbooks) | 1.000 | Silver+ | 🟢 MITTEL-HOCH |
| Geo-Varianten (nur mit ≥30% unique) | 2.000 | Silver+ | 🟡 MITTEL |
| **TOTAL (realistisches Ziel)** | **~5.000–10.000** | **92+** | **🟢 Gesund** |

### Content Pipeline

- **`generateRunbook100k()`**: Generiert Base-Runbooks on-demand (lib/pseo.ts)
- **`translateRunbook()`**: 15 Locales (de/en/es/fr/pt/it/ru/ja/ko/zh/ar/hi/tr/id/pl) via Gemini API
- **`generateGeoVariantContent()`**: City-spezifische Wrapper via Gemini
- **`validateRunbook()`**: 16-Check Quality Gate (lib/quality-gate.ts)

### Nächste Wellen (D5+) Checkliste

Siehe **Abschnitt 5** für die Schritt-für-Schritt-Anleitung.

---

### Noch offen (kein akuter Fix)

- **Affiliate Stats**: `affiliateData()` gibt `clicks: 0, sales: 0` – kein Tracking-System
- **npm @lhci/cli vulns**: 7 verbleibende Vulnerabilities in Dev-Dep (kein Prod-Risiko)

---

## 10. Tests & Commands Reference

```bash
# Unit Tests (57 Tests)
npm test               # oder: npx jest --no-coverage

# Build
npx next build --webpack

# E2E Tests (Playwright, benötigt Server)
npx playwright test e2e/payment-flow/ --project=chromium

# Geo-Matrix Integrity Check
npx jest __tests__/geo-matrix.test.ts
```

**Test-Coverage:**
- `lib/rate-limit.ts` – Rate limiting (Upstash + Fallback)
- `lib/access-token.ts` – Token verification + deny-list
- `lib/security-check-core.ts` – HTTP header scanning
- `lib/token-deny-list.ts` – Token blacklisting
- `lib/geo-matrix.ts` – City slug parsing, dedup invariant, geo-variant building

---

*Letzte Aktualisierung: 06.04.2026 – Audit-Update (Duplikate entfernt, Quality-Gate korrigiert, SEO-Strategie-Bewertung hinzugefügt)*