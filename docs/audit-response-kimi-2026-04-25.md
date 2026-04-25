# Audit-Response: Kimi 2.5 ClawGuru-Analyse (25.04.2026)

**Quelle:** Externe Analyse von Kimi 2.5, übergeben vom User 25.04.2026.
**Methode der Analyse:** Vermutlich SERP-basiert (öffentliches Crawling über Google, kein Codebase-Zugriff).
**Bilanz:** ~30 % korrekt, ~50 % halb-richtig, ~20 % schlicht falsch — einige "Findings" zeigen Sachen, die als Features absichtlich so sind.

Diese Doku verifiziert jeden Punkt gegen die Codebase und leitet Action-Items ab.

---

## §1 Sprachstruktur — **ÜBERWIEGEND FALSCH**

**Kimis Claim:** "Mindestens 8 Sprach-Subdirectories, Inhalte wild durcheinander, keine konsistente Sprachtrennung."

**Realität:**
- `lib/i18n.ts SUPPORTED_LOCALES` listet **32 Locales**: af, ar, bg, bn, cs, da, de, el, en, es, fi, fr, he, hi, hu, id, it, ja, ko, ms, nl, no, pl, pt, ro, ru, sv, th, tr, uk, vi, zh.
- `dictionaries/` hat 32 JSON-Dateien (33 inkl. en.json.bak — sollte gelöscht werden).
- Jede Comparison-Page (`/clawguru-vs-crowdstrike`, `/moltbot-vs-langchain` etc.) existiert in **allen** Locales unter `/[lang]/...` — nicht "exklusiv" pro Sprache. Kimi hat verschiedene Locales über Google angesteuert und falsch gefolgert die Seite gäbe es nur dort.

**Was aber stimmt:** Ein großer Teil des Contents auf den nicht-DE/EN-Seiten ist **nicht echt übersetzt**, sondern fällt auf EN/DE zurück. Genau dafür läuft jetzt die Pipeline B mit Ollama (siehe [i18n-pipeline-state-2026-04-25.md](i18n-pipeline-state-2026-04-25.md)).

**hreflang:** Kimi: "Keine hreflang-Tags sichtbar." **FALSCH.** `app/layout.tsx`, `app/[lang]/layout.tsx`, `app/[lang]/page.tsx` und mind. 15 weitere generieren `alternates: { languages: ... }` via `buildLocalizedAlternates()` (Next.js Standard). Das produziert korrekte `<link rel="alternate" hreflang="...">`-Tags.

**Action:**
- ☐ Spot-Check der hreflang-Coverage über alle [lang]-Routes (Audit-Skript: für jede `/[lang]/<slug>/page.tsx` prüfen, ob `generateMetadata` `buildLocalizedAlternates()` nutzt).
- ☐ `dictionaries/en.json.bak` löschen oder in `.gitignore`.

---

## §2 Tech-Architektur-Claims — **MARKETING ≠ CODE**

**Kimis Claim:** "Backend: PostgreSQL + Supabase, Mycelium graph database, Docker/Kubernetes."

**Realität (Code):**
- DB: **Neon** (`@neondatabase/serverless`) mit Auto-Failover auf `DATABASE_URL_2`, siehe [docs/db-failover-2026-04-24.md](db-failover-2026-04-24.md). **Nicht Supabase.**
- Frontend: Next.js 14 — ✅ stimmt.
- "Mycelium graph DB": Branding für die Runbook-Knowledge-Graph-Schicht (`app/mycelium/`, `lib/stats.ts` etc.). Kein eigener DB-Server.
- Hosting: **Netlify** (siehe `AGENTS.md` deployment notes). Keine Kubernetes-Pods in Production. Docker-Referenzen sind Academy-Mission-Inhalte.

**Action:**
- ☐ Auf der **Lacework-Comparison-Page** (`/[lang]/clawguru-vs-lacework`) die "PostgreSQL + Supabase"-Behauptung suchen und durch korrekten Stack ersetzen (Neon + Netlify Functions + Next.js 14). Marketing != Lüge.
- ☐ Stack-Description-Block in eine zentrale Komponente ziehen (`components/marketing/StackDescription.tsx`), damit die nicht in 9 Vergleichsseiten unterschiedlich driftet.

---

## §3 "4,2 Mio Runbooks" Inkonsistenz — **VALID + BEREITS BEKANNT**

**Kimis Claim:** Zahlen widersprechen sich (4,2M / 1M+ / 3,4M / 3M+).

**Realität:**
- `dictionaries/de.json:488` → `"3,4 Mio Runbooks"` (Vorstellung-Timeline 2026 Q2)
- `components/home/HeroPreview.tsx:97` → `"3,4 Mio Runbooks"` (Hero-Tags)
- `components/vorstellung/VorstellungClient.tsx:207` → `"3,4 Mio Runbooks"`
- `app/[lang]/solutions/eu-ai-act-compliance-checklist/page.tsx:83` → eigene Zahl
- **Bereits dokumentiert** in [docs/seo/eeat-strategy.md](seo/eeat-strategy.md) Zeile 33 als 🔴 **Critical:** `"3.4 Million Runbooks" / "Millionen Runbooks" (boast without proof) — ~8 files`.

**Mit "4,2 Mio" auf der Startseite oder "1M+" auf /fr/pricing konnte ich im Code nichts matchen** — entweder:
(a) Kimi sah eine veraltete deployte Version,
(b) Kimi hat falsch gelesen,
(c) ein cached Edge-Layer servierte alte HTML.

**Action:**
- ☐ EEAT-Strategy-Doc-Plan abarbeiten: alle "Million Runbooks"-Mentions ersetzen durch "Über 3 Millionen Runbooks — täglich von SecOps-Experten geprüft" (einheitliche Phrase, einheitliche Zahl). Eine **einzige Konstante** in `lib/stats.ts` exportieren, alle Strings darauf binden.
- ☐ Production-Cache nach Rollout invalidieren (Netlify deploy-trigger).

---

## §4 Provenance-Chain Future-Dates — **MINOR, FUNKTIONAL OK**

**Kimis Claim:** "Letztes Event 2026-06-01 in der Zukunft → Demo-Daten."

**Bewertung:** Ein Audit-Feature mit zukünftigen Demo-Events ist akzeptabel solange als "Demo" gekennzeichnet. Wird ein Lead misstrauisch, ist das ein Marketing-Problem, kein Sicherheits-Problem.

**Action:**
- ☐ Provenance-Demo-Page klar als "Demo" labeln, oder Demo-Events einfach auf realistische Vergangenheit setzen (z.B. last-30-days rolling).

---

## §5 Pricing-Inkonsistenz — **VALID**

**Kimis Claim:** Comparison-Pages zeigen Explorer/Pro/Team mit verschiedenen Preisen (999€/4999€/14999€) und Einheiten (EP/Assets/Hosts). Hauptseite zeigt 29€/99€/249€ monatlich.

**Realität:**
- `app/pricing/page.tsx`: Free / Starter 29€ / Pro 99€ / Scale 249€ — alles **monatlich**.
- Vergleichsseiten haben offenbar einen anderen Preisraster (Explorer/Pro/Team mit Jahrespreisen). Beide existieren parallel in der Codebase.

**Das ist genau der Inkonsistenz-Killer den Kimi flaggt.**

**Action (höchste Priorität für Conversion):**
- ☐ **Single Source of Truth** für Pricing in `lib/pricing.ts` (oder bereits `lib/checkout-upgrade-signals.ts`?). Alle Pages/Components müssen dort ziehen.
- ☐ Comparison-Pages auf die echten Tier-Namen+Preise umstellen.
- ☐ Eine **Einheit** wählen (Assets ODER Endpoints ODER Hosts), nicht alle drei mischen.

---

## §6 Comparison-Pages-Strategie — **FUNKTIONIERT WIE BEABSICHTIGT**

**Kimis Claim:** "5 Vergleichsseiten, oberflächlich, einseitig — natürlich gewinnt ClawGuru immer."

**Realität:** Mind. **22 Comparison-Pages** existieren:
- `clawguru-vs-{aquasec, checkov, crowdstrike, datadog, lacework, orca-security, prisma-cloud, snyk, trivy, wiz}` (10)
- `moltbot-vs-{autogen, autogpt, clawbot, crewai, grafana, haystack, langchain, llamaindex, opsgenie, pagerduty, semantic-kernel, splunk, victorops}` (13)
- `openclaw-vs-{crowdsec, crowdstrike, falco}` (3)

**Das ist eine bewusste SEO-Strategie**, nicht ein Bug. Kimis Kritik "natürlich gewinnt ClawGuru immer" ist banal — jede Vendor-Comparison-Page bei jedem SaaS-Anbieter macht das.

**Aber:** Wenn die Pages tatsächlich oberflächlich sind, ist das ein Quality-Issue. Heute keine Action, aber Backlog: jede Comparison-Page sollte mindestens 1 ehrliche "Wann der Konkurrent besser ist"-Sektion haben (E-E-A-T Signal).

---

## §7 Robots.txt / Sitemap.xml — **FALSCH (Kimi-Timeout-Issue)**

**Kimis Claim:** "Nicht erreichbar (Timeout)."

**Realität:**
- `app/robots.txt/route.ts` — vollständige Implementation, locale-aware Disallows, AI-Crawler-Whitelist (PerplexityBot, GPTBot, ClaudeBot, Google-Extended).
- `app/sitemap.xml/route.ts`, `app/sitemap-index/route.ts`, plus partitionierte Sitemaps unter `app/sitemap/{cves,providers,runbooks,solutions,tags}.xml/` und dynamische `app/sitemaps/[name]/route.ts`.

**Mögliche Ursache des Kimi-Timeouts:**
- Beide Routes sind `force-dynamic` + ziehen Daten aus Neon. Wenn der Neon-Quota-Failover (24.04.) gerade aktiv war, kann der Build des Sitemaps lange dauern oder timeoutten.

**Action:**
- ☐ `app/sitemap.xml/route.ts` review: ist Caching aggressiv genug? `Cache-Control: public, s-maxage=300` ist da, aber CDN muss es auch respektieren.
- ☐ `app/api/sitemap-health/` als externes Probe-Tool aktivieren — Cron alle 15 min, schreibt in Telemetrie.
- ☐ Manuelle Verifikation: `curl -I https://clawguru.org/robots.txt` + `curl -I https://clawguru.org/sitemap.xml` → Status 200 erwartet.

---

## §8 Fehlende Inhalte — **GEMISCHT**

| Kimi sagt fehlt | Realität | Action |
|---|---|---|
| Blog/Content-Hub | **TEILWEISE.** Es gibt `/intel`, `/guides`, `/research`, `/breaches`, `/cve-roasts`, `/runbooks` — aber kein `/blog/`. | ☐ Entscheiden: `/blog/` als Alias auf `/intel` (301-Redirect) oder echte separate Surface? Für Google "Blog" findability hilft. |
| Case Studies | **VORHANDEN.** `app/[lang]/case-studies/page.tsx` + `app/case-studies/page.tsx`. | Skip — ist da. Falls leer/dünn, eigenes Backlog-Item. |
| Karriere-Seite | **FEHLT.** Keine `/careers` oder `/jobs`. | ☐ Solo-Builder, ist akzeptabel zu fehlen. Aber 1 statische Page "We're not hiring yet, drop your resume" wäre billig und SEO-relevant. |
| API-Docs | **VORHANDEN.** `app/[lang]/api-docs/page.tsx` + `app/api-docs/page.tsx` + `app/[lang]/enterprise-api/page.tsx` + `app/[lang]/api-beta/page.tsx`. | Skip — gibt's mehrfach. |
| Status-Page | **FEHLT public.** `app/dashboard/health/page.tsx` ist intern. | ☐ Public `/status` mit minimal Uptime-Check (Netlify Functions cold-start, DB-Ping, Sitemap-Health). Standardize-Trust-Signal. |
| Changelog | **FEHLT.** | ☐ `/changelog` aus git tags + Release-Notes generieren. Statisches MDX-Loop wäre simpel. |

---

## §9 Action-Items konsolidiert (nach Priorität)

### 🔴 Critical
1. **Pricing Single-Source-of-Truth** — `lib/pricing.ts`, alle Pages binden. Comparison-Pages auf echte Tiers umstellen.
2. **"Mio Runbooks" Konstante zentralisieren** — `lib/stats.ts`, ein Wert, eine Phrase. EEAT-Strategy-Plan abarbeiten.
3. **Stack-Description-Komponente** — Lacework-Page nicht mehr "Supabase" sagen, alle Vergleichsseiten ziehen aus einer Quelle.

### 🟡 Important
4. **Public `/status`-Page** — Trust-Signal, kostet wenig.
5. **`/changelog`-Page** — aus Git generieren.
6. **`/blog/` 301-Redirect auf `/intel/`** — Google-Findability.
7. **Sitemap-Health-Cron** — Kimis "Timeout" reproduzierbar untersuchen.
8. **hreflang-Coverage-Audit-Skript** — über alle [lang]-Routes laufen lassen.

### 🟢 Nice to have
9. **`/careers`** "We're not hiring yet" Page.
10. **Provenance Demo-Events** auf realistische Vergangenheit normieren.
11. **`dictionaries/en.json.bak`** löschen.
12. **Comparison-Pages "Wann der Konkurrent besser ist"-Sektion** — E-E-A-T Bonus.

### Bereits in Arbeit
- ✅ i18n Coverage (4706 Strings × 28 Locales) — Pipeline B Ollama-Run läuft seit 25.04. (Kimis "Inhalte wild durcheinander"-Beschwerde wird damit substantiell adressiert).

---

**Owner:** Schwerti (rolli.peter123@gmail.com)
**Doc:** `docs/audit-response-kimi-2026-04-25.md`
**Verwandte Docs:** [seo/eeat-strategy.md](seo/eeat-strategy.md), [i18n-pipeline-state-2026-04-25.md](i18n-pipeline-state-2026-04-25.md), [db-failover-2026-04-24.md](db-failover-2026-04-24.md).
