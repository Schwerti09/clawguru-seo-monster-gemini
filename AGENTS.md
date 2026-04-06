# ClawGuru SEO Monster – AGENTS.md (Clean Reset – 05.04.2026)

## 1. Projekt-Überblick
ClawGuru ist ein spezialisierter Security-Check + executable Runbook Tool für Self-Hosting / OpenClaw / Moltbot / AI-Agents.  
Ziel: Mega-Traffic über lokale Geo-Pages (DACH + EU + CEE) mit starkem "Not a Pentest" Trust-Anchor + City-Aware Compliance.

Aktueller Stand:
- D4 (12 CEE/Balkan-Städte) in finaler Aktivierungsphase
- Post-Promotion Lock (§46.8) aktiv
- Legacy Runbook-URLs werden per 301 auf kanonische City-Pages umgeleitet (middleware.ts fix deployed)
- Killermachine v3 ist der neue Standard

## 2. Technischer Umsetzungsstand
- D4 final activation complete
- Killermachine v3 active → automatische Wave-Verarbeitung
- Ready for traffic (GSC + Community + Canonical Routing)

## 3. Killermachine v3 – Automated Wave Processing (ab sofort Standard)

**Regeln:**
- Automatischer Seed-Commit, sobald `eligible_count > 0` UND alle Self-Healing Checks grün sind (Matrix-Qualität ≥85, Runbook-URLs 200 OK, Trust-Anchor + City-Aware Signale vorhanden).
- Human-Gate nur noch bei finaler Canary → Stable Promotion (neuer §46-GO).
- Täglicher Report + automatische Alerts bei roten Checks.
- Alle zukünftigen Wellen (D5+) laufen vollautomatisch. Manuelle §-Blöcke sind deprecated.

**Self-Healing Checks (v2):**
- Matrix-Qualität ≥85 für alle Städte der Welle
- Runbook-URLs geben 200 OK (kein 308/Redirect auf Search)
- "Not a Pentest" + Trust-Anchor Framing konsistent
- City-Aware Compliance-Signale (country_code) vorhanden

## 4. §106 – FINAL MANUAL D4 DECISION BLOCK (letzter manueller Block)

(Dein letzter ausgefüllter Decision-Block mit T24-Zahlen und NO-GO bleibt hier stehen – kopiere ihn einfach hierher, wenn du willst.)

**Entscheidung:** PROBLEM (Matrix noch nicht committed, einige URLs 308)

## 5. 🌍 GLOBAL 1M PAGES TARGET (06.04.2026)

**ZIEL: 1.000.000 veröffentlichte Seiten weltweit mit Quality 85+**

**Aktueller Stand (06.04.2026 – Session 2):**
- **96 aktive Städte** in geo_cities (stable, Q85+)
- **4 China-Städte**: Beijing(95), Shanghai(94), Guangzhou(88), Shenzhen(89) – stabil
- **10 US-Städte**: LA(93), Chicago(91), Houston(88), Dallas(85), Seattle(86), Austin(82), Phoenix(84), Philadelphia(83), San Diego(81), San Antonio(80)
- **8 India-Städte**: Mumbai(94), Delhi(93), Bangalore(92), Hyderabad(88), Chennai(87), Kolkata(85), Pune(84), Ahmedabad(82)
- **5 Russia-Städte**: Moscow(92), StPetersburg(88), Novosibirsk(78), Yekaterinburg(76), Kazan(74)
- **City-Ranking**: 96/96 healthy, Batch-Probing ~2s (fix: Connection-Pool-Exhaustion behoben)
- **Sitemap-Pool**: 150 Städte (war: 72), tägliche Rotation 24/150
- **Endpoints live**: `/api/geo/china-create`, `/api/geo/global-expansion`
- **SEEDED_CITY_SLUGS**: 96 Slugs in `lib/geo-matrix.ts`

**Nächste 30 Tage Target:**
- **Weitere Expansion**: Japan, Brazil, Mexico, South Korea, Southeast Asia
- **Sitemap-Limit erhöhen**: GEO_MATRIX_SITEMAP_CITY_LIMIT 24 → 50
- **Quality-Enrichment**: Locale-spezifische Inhalte für Top-50-Städte
- **Additional Europe**: 200+ URLs (Quality 75+ → Enrichment auf 85+)

**Strategie:**
1. **Content-Enrichment** für 1.700+ Städte auf Quality 85+
2. **Sprachen-Expansion** auf 15+ Sprachen pro Stadt
3. **Automatisierte Wellen** mit Killermachine v3
4. **Quality-Gates** strikt bei 85+ für alle URLs
5. **Global Coverage**: 50+ Länder, 200+ Städte

**Erwartetes Ergebnis:**
- **1.000.000+ URLs** mit Quality 85+
- **15+ Sprachen** = 15M+ indexierbare Seiten
- **Global Traffic** aus 50+ Märkten
- **Market Leadership** in Security-Check Tools

**Status:** IN PROGRESS - 765/1.000.000 URLs (0.0765% komplett)

## 6. Nächste Schritte (heute)

1. **China Mega Expansion** Deployment + Enrichment ausführen
2. **1M Pages Target** Content-Enrichment für USA/India/Russia starten
3. **Runbooks Page Fix** - /runbooks Seite funktioniert nicht richtig
4. **Community-Push** für aktuelle 765 URLs in 15 Sprachen
5. **Quality-Gates** strikt bei 85+ für alle neuen URLs
6. **Global Scaling** auf 50+ Länder, 200+ Städte

## 7. Cockpit Realism Roadmap (Zahlung → echte Leistung, 100 % nachvollziehbar)

**Ziel:** Nach Checkout sieht der Kunde nur **seine** Daten; jede Tool-Aktion erzeugt **persistente**, auditable Spuren (Executions, Mycelium, Threats); keine reine UI-Deko.

### Release-Disziplin (Git)

- Änderungen an diesem Plan: **erst committen und pushen, wenn der Owner ausdrücklich „Go“ schreibt.**

### Phase A — Daten & Isolation (Fundament)

| Step | Status | Beschreibung |
|------|--------|--------------|
| A1 | Done | Migration `009_dashboard_customer_scoping.sql`: `customer_id` auf `threats` + `mycelium_nodes`; Dashboard-Queries nur noch tenant-scoped |
| A2 | Done | `lib/dashboard-identity.ts` (`parseDashboardPrincipal`) — eine Quelle für Kunden-Key + Plan |
| A3 | Done | `POST /api/dashboard/tool-execution`: Auth via Cookie, Limits (Explorer), Rate-Burst, Inserts |
| A4 | Todo | **Prod:** `npm run db:migrate` auf allen Umgebungen; ohne Migration bleiben Spalten leer / Writes fehlerhaft |
| A5 | Todo | Rate-Limit **verteilt** (Redis/Upstash) statt In-Memory-Map pro Serverless-Instanz |

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
| D1 | Todo | Playwright: Happy-Path „Cookie gesetzt → POST tool-execution → 200 → Dashboard zeigt neue Zeile“ (Mock DB oder Test-DB) |
| D2 | Todo | Monitoring/Alert wenn `tool-execution` 5xx-Rate steigt |

**Aktueller Umsetzungsstand (Kurz):** A1–A3, B1–B5, C1–C4 abgeschlossen. Offen: A4 (Prod-Migration 009+010), A5 (Redis Rate-Limit), Phase D (Playwright Tests).

---

Manual §-blocks end here. From now on: Killermachine v3.

Letzte manuelle Änderung: 06.04.2026 (Phase C komplett – echte Deliverables, Entitlements-Tabelle, Schema-Fixes)