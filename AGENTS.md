# AGENTS.md — ClawGuru (clawguru.org)

**Zweck:** Dauerhafter Stand für alle Agenten und Menschen im Repo. Vor jedem größeren Feature- oder SEO-Schritt hier lesen und nach Umsetzung den Abschnitt „Technischer Umsetzungsstand“ aktualisieren.

**North-Star:** Top-3-Sichtbarkeit für die wichtigsten **kauf- und intent-starken** Queries in SecOps / AI-Agent-Security / OpenClaw-Ökosystem — nur **Premium-Umsetzung** (Qualität > Masse).

**Launch-Kontext:** Seite ca. **10 Tage alt** (Ende März 2026), bootstrapped. Produkt: **Mycelial Singularity Engine v4.0** — AI-powered SecOps mit starkem **kostenlosen LIVE Security Check** (~30 s, kein Signup, kein Speichern). Positionierung: **unabhängiges Lage- & Ops-Zentrum** für OpenClaw / Moltbot / ähnliche Stacks. Kern-Claim: **„From problem to fix in under 30 seconds“** (mit klarer Einordnung: heuristisch, verifizierbar, keine Pentest-Garantie).

---

## 1. Priorisierte Backlog-Reihenfolge (was als Nächstes gebaut wird)

| Prio | Thema | Akzeptanzkriterium |
|------|--------|---------------------|
| **P0** | **Roast My Stack — 100 % i18n** | Alle Keys unter `roast` (inkl. `meta_*`, `page_intro`, Fehlermeldungen, Share-Card) in **allen** `dictionaries/*.json` (15 Locales) mit **muttersprachlicher** Qualität — kein dauerhaftes Zurückfallen auf EN-Fallback in der UI. `npm run check:i18n` grün. |
| P1 | Neue Landingpages + Redirects | Routen live: `/[lang]/openclaw`, `/[lang]/openclaw-security-check`, `/[lang]/moltbot-hardening`, `/[lang]/ai-agent-security`; Redirects `/moltbot`, `/clawbot` → sinnvolle Ziel-URL; vollständige Meta + Schema + interne Links. |
| P1 | Homepage CRO | Hero/Subheadline/Proof/CTA nach Strategieblock 2; A/B-Varianten dokumentiert. |
| P2 | Content-Kalender | Erste 15–20 Artikel geplant, je 1–2 interne Links auf Pillar-LPs. |
| P2 | Off-Page Playbook | Reddit/X/GitHub/Discord — wiederholbare Templates, keine Spam-Policy-Verstöße. |

---

## 2. Technischer Umsetzungsstand (Kurz, Stand speichern)

**Bereits stark umgesetzt (nicht erschöpfend):**

- Next.js App Router, **15 Locales** (`lib/i18n.ts`), Middleware, `localeAlternates` / **`buildLocalizedAlternates`** für korrekte Canonicals + hreflang.
- Geo-Living Matrix (Geo-Varianten, Qualität, DB `geo_variant_matrix`, Ops-Skripte, Canary → Stable, `noindex`/Sitemap-Logik wo definiert).
- Persistenter **Check-Funnel** (`check_funnel_events`), Admin-Dashboards.
- SEO-Guard: `npm run check:seo-canonicals`.
- CI: Build + Netlify; Vercel-Workflow skippt ohne Token.
- README auf aktuellen Stand gebracht.
- P0 Roast-i18n: `roast`-Blöcke in allen 15 Dictionaries lokalisiert; verbleibende hardcodierte EN-Texte in `RoastMyStack`/`RoastShareCard` entfernt.
- P0 Roast-Qualität (Pass #1): redaktionelle Copy-Politur für `roast` in `ar`, `hi`, `ja`, `ko`, `nl`, `ru`, `es`, `fr`, `it`, `pt`, `pl`, `tr`, `zh` (Ton, Verständlichkeit, CTA-/Error-Wording) durchgeführt; `npm run check:i18n` weiterhin grün.
- P0 Roast-Qualität (Pass #2): finale Label-/Wording-Feinpolitur in `de`, `es`, `ru`, `ja`, `ko`, `hi`, `ar` (u. a. `top_roasts`, Level-Wording) nachgezogen.
- P1 LP-Qualität (Pass #1): redaktionelle Copy-Politur in `lib/landing-pages-i18n.ts` für `openclaw-security-check`, `moltbot-hardening`, `ai-agent-security` in `ar`, `hi`, `ja`, `ko`, `nl`, `ru` (weniger Denglisch, klarere CTAs/Claims).
- P1 LP-Qualität (Pass #2): verbleibende Locales `es`, `fr`, `it`, `pt`, `pl`, `tr`, `zh` ebenfalls redaktionell nachgezogen (klarere Risiko→Fix-Formulierungen, konsistentere Terminologie).
- P1 LP-Qualität (Pass #3): finaler Wording-Feinschliff in `MOLTBOT` + `AI_AGENT` (reduzierter Sprachmix in CTA/Description/Subline für `es`, `fr`, `it`, `pt`, `ru`, `ja`, `ar`, `nl`, `hi`, `tr`, `pl`, `ko`).
- Pattern-Konsolidierung gestartet: zentrale Helper-Funktion `lib/core-security-links.ts` für locale-sichere Kernlinks (`/check`, `/methodik`) eingeführt und auf den 4 SEO-LPs verdrahtet.
- Pattern-Konsolidierung erweitert: Helper-Rollout zusätzlich auf 10 strategische Content-Seiten (`check-methodology`, `openclaw-top-5`, `gateway-auth-10-steps`, `api-key-leak-response`, `nis2-controls`, `hetzner-vs-do`, `docker-proxy-cheatsheet`, `check-vs-pentest`, `runbook-vs-blog`, `ai-agent-threat-model`) ausgedehnt.
- Pattern-Konsolidierung (Premium-Rollout): Helper auf restliche `[lang]`-Runbook-/Security-Seiten ausgerollt (u. a. `aws-*`, `azure-ad`, `argocd`, `nginx`, `postgresql`, `redis`, `terraform`, `vault`, `waf`, `xxe`), sodass `check`-Links locale-sicher zentral über `core-security-links` laufen.
- Interner Linkgraph (Pass #1): zusätzliche LP-/Hub-Cluster-Links (`/openclaw-security-check`, `/ai-agent-security`, `/runbooks/security`, `/methodik`) in langen `[lang]`-Security-Seiten ergänzt, um Pillar-Verteilung und Crawler-Pfade zu stärken.
- Interner Linkgraph (Pass #2): vier SEO-LPs + OpenClaw-Hub + Homepage-Final-CTA über `getCoreSecurityLinks` / `getHomepageCroCopy` zu Roast-Moltbot und untereinander verzahnt.
- P1 LP-Routen: `/[lang]/openclaw`, `/[lang]/openclaw-security-check`, `/[lang]/moltbot-hardening`, `/[lang]/ai-agent-security` live mit `buildLocalizedAlternates`, Metadata, Basis-Schema und internen Links.
- Redirects aktiv: `/moltbot` und `/clawbot` (inkl. lokalisierter Varianten) per Middleware auf die neuen Zielseiten.
- Homepage-CRO-i18n: neue CTA-/LP-Hub-Texte per zentralem Fallback (`lib/homepage-cro-i18n.ts`) für alle 15 Locales verdrahtet (`HeroSection`, `FinalCTASection`, `app/page.tsx`).
- Homepage-CRO (Flow): Problem-Sektion auf 3-Schritt-Story (Exposition → Signal → Fix) umgestellt; Hero/Trust mit klaren „kein Pentest“-Hinweisen ergänzt; mobile sticky CTA-Leiste (`/check`, `/runbooks`) eingebaut.
- Homepage-CRO (Locale-Qualität): neue Hero-Notiz, Trust-Disclaimer und mobile Sticky-CTA-Labels in den zentralen Locale-Fallback (`lib/homepage-cro-i18n.ts`) überführt; `TrustSection` auf locale-aware Copy umgestellt.
- P2-Operationalisierung gestartet: ausführbarer Content-Kalender in `docs/seo-content-calendar-2026.md` mit 8-Wochen-Queue, LP-Link-Regeln und KPI-Tracking angelegt.
- P2 Off-Page operationalisiert: `docs/offpage-playbook-2026.md` mit kanal-spezifischen Templates (Reddit/X/GitHub/Discord), Cadence, Tracking-Regeln und Auto-Reject-Guardrails angelegt.
- P2 erste Delivery live: `/[lang]/check-methodology-30-seconds` als indexierbare Artikel-Seite mit `buildLocalizedAlternates`, Article-Schema und internen Links auf `/check`, `/methodik`, `/openclaw-security-check`, `/ai-agent-security`.
- P2 zweite Delivery live: `/[lang]/openclaw-top-5-exposure-misconfigs` als indexierbare Artikel-Seite mit Meta/Schema und internen Links auf `/openclaw`, `/moltbot-hardening`, `/check`, `/methodik`.
- P2 dritte Delivery live: `/[lang]/gateway-auth-10-steps` als indexierbare Runbook-Artikel-Seite mit 10-Schritte-Flow, Verifikationskriterien und internen Links auf `/moltbot-hardening`, `/openclaw`, `/check`, `/methodik`.
- P2 vierte Delivery live: `/[lang]/api-key-leak-response-playbook` als indexierbare Incident-Response-Seite mit Phasenmodell, Operator-Checkliste, Aftercare und internen Links auf `/ai-agent-security`, `/openclaw-security-check`, `/check`, `/methodik`.
- P2 fünfte Delivery live: `/[lang]/nis2-technical-controls-self-hosted` als indexierbare Compliance-Artikel-Seite mit technischer Control-Baseline, Evidence-Block und internen Links auf `/ai-agent-security`, `/openclaw`, `/check`, `/methodik`.
- P2 sechste Delivery live: `/[lang]/hetzner-vs-do-security-baseline-2026` als indexierbare Infra-Hardening-Seite mit Provider-Vergleich, Baseline-Checkliste und internen Links auf `/moltbot-hardening`, `/openclaw-security-check`, `/check`, `/methodik`.
- P2 siebte Delivery live: `/[lang]/docker-reverse-proxy-hardening-cheatsheet` als indexierbare Tactical-Hardening-Seite mit Docker/Proxy-Checkliste, Config-Sanity-Checks und internen Links auf `/moltbot-hardening`, `/openclaw`, `/check`, `/methodik`.
- P2 achte Delivery live: `/[lang]/security-check-vs-pentest-guide` als indexierbare Conversion-Artikel-Seite mit klarer Abgrenzung Check vs Pentest, Kombinations-Workflow und internen Links auf `/openclaw-security-check`, `/ai-agent-security`, `/check`, `/methodik`.
- P2 neunte Delivery live: `/[lang]/executable-runbook-vs-static-blog` als indexierbare Product-Differentiation-Seite mit Vergleich Blog vs Runbook, Transition-Flow und internen Links auf `/runbooks`, `/openclaw`, `/check`, `/methodik`.
- P2 zehnte Delivery live: `/[lang]/ai-agent-threat-model-template` als indexierbare Category-Seite mit Threat-Model-Bausteinen, Operator-Prompts und internen Links auf `/ai-agent-security`, `/openclaw-security-check`, `/check`, `/methodik`.
- Debug-Stufe 1 (Re-Run, 03.04.2026): `check:geo-ops-readiness`, `check-geo-rollout-status` (DE/EN, verbose), `check:geo-city-ranking`, `check:geo-index-health` sowie Canary-/Expansion-Dry-Runs (Score 75/70/65/60) ausgeführt; System healthy, aber `wouldPromote`/`wouldActivate` weiterhin leer.

**Bewusst offen / nächste Engineering-Schritte (SEO-Plan):**

- Roast: **Inhalte** in allen Sprachen auf **Premium-Niveau** prüfen/ersetzen (Keys können existieren, Qualität nicht).
- Roast: finaler Native QA-Pass (Muttersprachler-Review + Terminologie-Konsistenz) als letzter Qualitätsfilter offen.
- LP-Copy für `/openclaw`, `/openclaw-security-check`, `/moltbot-hardening`, `/ai-agent-security` zentral in `lib/landing-pages-i18n.ts` für alle 15 Locales hinterlegt und in Seiten verdrahtet.
- LP-Copy: finaler Native-Review (Muttersprachler + Terminologie-Feinschliff) als letzter Qualitätsschritt offen.
- `methodik`/`check`-Pattern: Konsolidierung via `core-security-links` auf LPs und `[lang]`-Content-/Runbook-Seiten ausgerollt.
- Nächster Umsetzungsblock: interner Linkgraph-Feinschliff (feste Link-Matrix LP ↔ Content ↔ Runbook-Hubs) + Geo/SEO Ops View (OpenClaw-Geo-Sprint-/Roast-Moltbot-Mesh und Sitemap-Einträge für die ersten 5 Städte in `de`/`en` umgesetzt).

**Wichtige Dateien für i18n (Roast):**

- `dictionaries/*.json` → Objekt `roast` (Parität mit `de.json` / `en.json` als Referenz).
- `components/roast/RoastMyStack.tsx`, `RoastShareCard.tsx`, `app/[lang]/roast-my-stack/page.tsx`.
- `scripts/check-i18n.js` nach Änderungen ausführen.

---

## 2.1 Geo/SEO Status (Kompakt)

**Hosting / Secrets (Stand):** Produktion läuft auf **Vercel** — alle Deploy-Secrets (`GEO_*`, AI, DB, …) dort pflegen. Die Datei `netlify.env.import.template` ist **nur** für einen möglichen **Umzug nach Netlify** bzw. als Referenz; sie wird von den Geo-CLI-Skripten **nicht** automatisch geladen. Optional: `GEO_CLI_EXTRA_DOTENV=<pfad>` für ein zusätzliches Env-File lokal. Details: `docs/env-checklist.md`.

### Fertig

- Geo-Living-Matrix mit Qualitätslogik, Canary-to-Stable-Prozess und Indexierungsregeln implementiert.
- Canonical-/hreflang-Setup auf `buildLocalizedAlternates` standardisiert.
- Redirect-/Routing-Basis für locale-first SEO stabil (inkl. `/moltbot` und `/clawbot` Zielrouten).
- SEO-Guardrails aktiv (`check:seo-canonicals`) und in den letzten Rollouts grün.
- Content-Queue aus dem 8-Wochen-Plan als indexierbare `/[lang]/...` Seiten ausgeliefert.
- Geo/SEO Operations View als Daily/Weekly-Ampel dokumentiert: `docs/geo-seo-ops-view.md`.
- `/[lang]/roast-my-moltbot` als neue, indexierbare Landingpage live; Homepage-Hero + `/openclaw` verlinken darauf.
- Kompakte ENV-Operations-Checkliste dokumentiert: `docs/env-checklist.md` (Pflicht-/Optional-Keys + Pre-Rollout-Checks).
- Embeddable Moltbot-Hardener Widget als Paket-Grundlage angelegt: `extension/widget` (`clawguru-moltbot-hardener`).
- OpenClaw-Geo-Sprint (`lib/geo-openclaw-city-sprint.ts`): feste Verlinkung OpenClaw-Hub ↔ Stadt-LPs ↔ Roast-Moltbot; Hero-CRO DE/EN (`homepage-cro-i18n`); Geo-URLs in `main-de` / `main-en` Sitemap.
- Linkgraph (Pass #2): `getCoreSecurityLinks` erweitert um OpenClaw-/Tool-Pfade; SEO-LPs `openclaw-security-check`, `moltbot-hardening`, `ai-agent-security` mit Roast-CTA + Quer-Nav; OpenClaw-Hub-Footer über Homepage-CRO-Labels; `FinalCTASection` mit drittem CTA auf `/roast-my-moltbot`.

### In Arbeit

- Sprachliche Premium-Qualität der bestehenden i18n-Copy (insb. Roast + LP-Copy) pro Locale redaktionell angleichen.
- Feinschliff interner Linkgraph zwischen neuen LPs, Content-Pages und Runbook-Hubs.

### Offen

- Native QA Sign-off für Roast + LP-Copy pro Locale dokumentieren (Abnahme-Checkliste je Sprache).

---

## 3. Strategieblock 1 — Buyer-Personas (6–8, sofort nutzbar)

Gemeinsamer **Aha-Moment** für alle: **Kostenloser LIVE Check in ~30 s** zeigt konkrete Risiko-Lücken + nächster Klick = **Runbook / Fix-Pfad** (ohne Account-Zwang).

| Persona | Profil | Schmerz | Ziel | Such- und Sprachmuster | Kanäle | ClawGuru-Lösung | Aha-Moment | typische Einwände |
|--------|--------|---------|------|-------------------------|--------|-----------------|------------|-------------------|
| **Lena, 34** | Platform Engineer, Berlin, Series-B SaaS | NIS2/ISO-Druck, zu wenig SecOps-Kapazität | Auditierbare Nachweise, schnelle Standard-Fixes | „nis2 technical measures“, „iso 27001 cloud checklist“ | LinkedIn, Tech-Blogs, BSI-Themen | Runbooks + Methodik + Check als Erstsignal | Check zeigt Lücken in Minuten | „Ist das nur Marketing-KI?“ |
| **Marcus, 41** | IT-Leiter KMU, München | Kein 24/7-SOC, Incidents überfordern | Playbooks, die **funktionieren** | „incident response runbook“, „hetzner firewall hardening“ | Google, Hetzner-Community, X | Executable Runbooks + Summon/Copilot-Narrativ | Ein Runbook endet mit **messbaren** Schritten | „Wer haftet?“ |
| **Alex, 29** | Selfhoster, r/selfhosted | Exponierte Dienste, TLS/Proxy-Fehler | „Ist mein Stack offen?“ | „selfhosted security check“, „reverse proxy hardening“ | Reddit, HN, Discord | Kostenloser Check + konkrete Hubs | Score + 3 klare To-dos | „Sammelt ihr meine IPs?“ (Policy klar kommunizieren) |
| **Jordan, 26** | OpenClaw/Moltbot Power-User | Gateway/Key-Leaks, Panik-Threads | Schnelle Absicherung ohne 200 Tabs | „openclaw security“, „moltbot hardening“, „exposed instance“ | Reddit (r/OpenClaw, r/selfhosted), X, GitHub Issues | Dedizierte **OpenClaw-LP** + Check + Runbooks | „Das trifft **meinen** Stack“ | „Ist das offiziell?“ → **unabhängiges** Ops-Zentrum kommunizieren |
| **Priya, 38** | DevSecOps Lead, Remote EU | AI-Agent-Risiko, Shadow-Deployments | Governance für Agent-Infra | „ai agent security“, „llm gateway auth“ | Slack-Communities, Conf-Talks, GitHub | AI-Agent-Security-LP + Runbooks | Check + Link zu **Auth/Gateway**-Runbooks | „Zu generisch“ → Tiefen-Content + Case Studies |
| **Tom, 45** | Sysadmin Hetzner/DO | Kosten vs. Security, Standard-Härtung | Copy-paste-fähige Konfiguration | „hetzner ssh hardening“, „ufw fail2ban 2026“ | Provider-Foren, YouTube | Provider-Hubs + Runbooks | Sofort umsetzbare Schritte | „Schon tausend Guides gesehen“ → **Claw Score + Verifikation** |
| **Sofia, 32** | Solo Dev mit VPS | Zeitdruck, Security-Last | Minimaler Aufwand, maximaler Effekt | „vps security checklist“, „docker hardening quick“ | Indie-Hacker, X | Check + kurze Pfade zu Fixes | 30-Sekunden-Check ohne Signup | „Free tier reicht nicht“ → Day Pass / Pro klar erklären |
| **Erik, 50** | Compliance Officer (EU) | Nachweispflicht, Audit-Fragen | Dokumentierbare Kontrollen | „security control evidence“, „logging retention gdpr“ | LinkedIn, Fachverlage | Methodik + Runbooks + Reports (wo produktiv) | Methodik-Seite + **transparenter** Scoring-Text | „KI halluziniert“ → Grenzen + menschliche Validierung |

**Community-Fokus OpenClaw/Moltbot (April 2026):** In Kommunikation **konkrete** Schmerzpunkte nutzen (exponierte Instanzen, unsichere Gateways, API-Keys in Logs, fehlende Auth) — **keine erfundenen CVE-IDs** in Live-Copy; wenn ein CVE referenziert wird, nur mit **verifizierter** Quelle und Datum.

---

## 4. Strategieblock 2 — Homepage + neue Landingpages

### 4.1 Homepage — Optimierungsrichtung (umsetzbar)

| Bereich | Maßnahme |
|---------|-----------|
| **Headline** | Problem + Zeit + Outcome: z. B. DE: „SecOps in Sekunden — vom Problem zum Fix, ohne Warteschlange.“ EN: „From exposed stack to verified fix — in seconds, not weeks.“ |
| **Subheadline** | Ein Satz: kostenloser Check + executable Runbooks + unabhängig für OpenClaw/Moltbot-Ökosystem. |
| **Hero** | Primär-CTA: **Security Check starten**; Sekundär: **Runbooks durchsuchen** / **Roast My Stack**. |
| **Problem → Solution** | 3 Karten: (1) Exponiert / unklar (2) Check liefert Signal (3) Runbook liefert Fix + Re-Check. |
| **Tools** | Check, Copilot, Summon, Roast — je **ein Satz Nutzen**. |
| **Why ClawGuru** | Mycelium/Runbook-Masse **nur** mit Qualitäts-/Methodik-Link (E-E-A-T). |
| **Trust** | Methodik, Datenschutz, keine Speicherung beim Free-Check (falls zutreffend — mit Produkt abgleichen). |
| **CTA** | Sticky mobile CTA „Check starten“. |

### 4.2 Neue Landingpages — Sitemap & Redirects

| URL (pro Locale unter `/[lang]/…`) | Redirects (root oder sprachlos) | Primary Intent |
|-----------------------------------|----------------------------------|----------------|
| `openclaw` | optional: `/openclaw` → `/de/openclaw` oder Middleware-Regel | Brand + Community-Trust |
| `openclaw-security-check` | `/openclaw-security-check` | Tool-Intent |
| `moltbot-hardening` | `/moltbot` → `/de/moltbot-hardening` (oder `/de/openclaw`) | Hardening-Intent |
| `ai-agent-security` | `/clawbot` → Ziel wie oben definieren | Category-Intent |

**i18n-Pflicht:** Pro Seite **alle 15 Sprachen** — nicht nur DE/EN. Vorgehen: `dictionaries` Keys + `generateMetadata` mit `buildLocalizedAlternates`.

---

### 4.3 LP-Vorlage: `/openclaw` (Copy — DE + EN; andere Sprachen: gleiche Keys übersetzen)

**DE — Headline / Subheadline**

- **H1:** OpenClaw & Moltbot absichern — bevor der nächste Thread es tut.  
- **Sub:** Unabhängiges Ops-Zentrum: **30-Sekunden-Security-Check**, executable Runbooks und klare Nächste-Schritte — ohne Signup.

**EN — H1 / Sub**

- **H1:** Secure OpenClaw & Moltbot — before the internet finds you first.  
- **Sub:** Independent ops center: **30-second security signal**, executable runbooks, and next steps — no signup.

**Struktur (alle Sprachen identisch):** Hero (H1+Sub+Dual-CTA) → Problem (3 Bullets Community-Schmerz) → Solution (Check → Runbook → Re-Check) → Social Proof (Stats nur wenn belegbar, sonst „Trusted by operators“ generisch) → How it works (3 Schritte) → Embedded Check CTA → FAQ (5–7) → Final CTA.

**CTA-Varianten (je 5, DE Beispiele — EN analog übersetzen):**

1. Jetzt Security-Check starten  
2. Offene Stellen in 30 Sekunden sehen  
3. Runbook für Gateway/Auth öffnen  
4. Kostenlos prüfen — ohne Konto  
5. Nächsten Incident vor dem Incident vorbereiten  

**Design:** ClawGuru Dark + Cyan/Gold-Akzente; dezente Mycelium-Linien im Hero; Trust: Methodik-Link, „kein Pentest“-Disclaimer sichtbar.

**Conversion:** Angst (Exposition) + Hoffnung (konkreter Pfad) + Dringlichkeit (jetzt checken) + Social Proof (nur echte Zahlen).

---

### 4.4 LP: `/openclaw-security-check` (DE + EN Kurz-Copy)

| | DE | EN |
|---|----|----|
| **H1** | OpenClaw Security Check in 30 Sekunden | OpenClaw security check in 30 seconds |
| **Sub** | Schnelles Signal zu Risk Posture — danach Runbooks zum Fixen. | Fast signal on risk posture — then runbooks to fix. |
| **CTA** | Check starten | Start check |

(FAQ: Speicherung? Was wird geprüft? Grenzen? Nächster Schritt? — abgleichen mit `app/check` und Datenschutz.)

---

### 4.5 LP: `/moltbot-hardening` (DE + EN Kurz-Copy)

| | DE | EN |
|---|----|----|
| **H1** | Moltbot härten — Gateway, Auth, Exposure | Harden Moltbot — gateway, auth, exposure |
| **Sub** | Runbooks + Check: typische Fehlkonfigurationen schneller schließen. | Runbooks + check: close common misconfigs faster. |

---

### 4.6 LP: `/ai-agent-security` (DE + EN Kurz-Copy)

| | DE | EN |
|---|----|----|
| **H1** | AI-Agent Security für Self-Hosted Teams | AI agent security for self-hosted teams |
| **Sub** | Von exponierten Tools zu messbaren Controls — mit executable Runbooks. | From exposed tooling to measurable controls — with executable runbooks. |

---

### 4.7 On-Page-SEO (Checkliste pro neuer LP)

| Element | Regel |
|---------|--------|
| **Title** | Primary Keyword vorne, Brand hinten, < ~60 Zeichen |
| **Description** | Nutzen + CTA + Grenze (kein Pentest), < ~155 Zeichen |
| **H1** | Eins pro Seite; H2 für Problem/Solution/FAQ |
| **Schema** | `WebPage` + wo sinnvoll `FAQPage`; interne Links zu Methodik + Check |
| **Interne Links** | Mindestens: `/check`, `/methodik`, 2 thematische Runbooks/Hubs |

---

## 5. Strategieblock 3 — Keywords, Technical SEO, Content, Off-Page, Messung

### 5.1 Keyword-Matrix (Primary / Secondary / Long-Tail)

*Hinweis: Suchvolumina sind **Schätzungen** zur Priorisierung — mit GSC/Keyword-Tools validieren sobald Daten da sind.*

| Cluster | Primary (DE/EN) | Secondary | Long-Tail (Beispiele) | Intent | Geschätzte Priorität |
|---------|-----------------|-----------|------------------------|--------|----------------------|
| OpenClaw | openclaw security, OpenClaw security check | Moltbot security, clawbot hardening | openclaw gateway authentication, moltbot exposed port checklist | Info/Tool | Sehr hoch |
| AI Agents | AI agent security, LLM gateway security | autonomous agent hardening | self-hosted AI agent firewall rules, crewai deployment security | Info/Tool | Hoch |
| Runbooks | executable runbooks, SecOps runbooks | incident response runbook | kubernetes incident runbook copy paste | Tool/Kauf | Hoch |
| EU / Compliance | NIS2 technical measures, ISO 27001 cloud controls | BSI IT-Grundschutz cloud | EU startup security baseline 2026 | Info | Mittel |
| Infra | Hetzner hardening, VPS security checklist | DigitalOcean firewall ssh | fail2ban ufw docker compose hardening | Tool | Mittel |

### 5.2 Technical SEO (laufend)

| Thema | Maßnahme |
|-------|----------|
| CWV | LCP/CLS/INP messen (Lighthouse CI vorhanden — nutzen) |
| Mobile | Touch-Targets, Hero-CTA sticky |
| Indexierung | `robots`, Sitemaps, keine `/page`-Canonicals |
| Performance | Bilder/OG, unnötige Client-Bundles vermeiden |

### 5.3 Content-Kalender — 18 Ideen (12 Monate streubar, virale Hooks)

1. „30 Sekunden Check: was wir messen — und was nicht“  
2. OpenClaw Exposure: typische Top-5 Fehlkonfigurationen  
3. Gateway-Auth in 10 Schritten (Runbook-teaser)  
4. API-Key-Leaks: Incident-Runbook (ohne Panik-Clickbait)  
5. NIS2 für KMU: was **technisch** zählt  
6. Hetzner vs. DO: harte Mindest-Firewall  
7. Docker + Reverse Proxy: CSP & TLS Cheat Sheet  
8. Reddit-Thread → offizielle ClawGuru-Antwort (immer hilfreich, nie spammy)  
9. „Executable“ erklärt: Runbook vs. Blogpost  
10. AI-Agent Threat Model Template (downloadbar / Seite)  
11. Case: Von Check zu Fix in unter 1h (nur wenn echt)  
12. Methodik: wie ClawGuru bewertet  
13. Runbook der Woche (Serie)  
14. Discord/Community FAQ zusammengefasst  
15. Vergleich: Check vs. Pentest (Erwartungsmanagement)  
16. Supply Chain: CI/CD Secrets Runbook  
17. Logging & Retention: EU-sauber  
18. OpenClaw Changelog kommentiert (wenn Community-Events)

Je Post: **2 interne Links** auf LPs (`/openclaw`, `/ai-agent-security`, …).

### 5.4 Off-Page (regelbasiert)

| Kanal | Regel |
|-------|--------|
| **Reddit** | Nur bei passenden Threads, volle Antwort + ein Link max., Disclosure „wir bauen ClawGuru“ |
| **X** | Kurz-Clips Check-Ergebnis (anonymisiert), Thread mit Runbook |
| **GitHub** | Issues/Discussions helfen, README-Link nur wo erlaubt |
| **Discord** | Help-first, keine DM-Spams |

### 5.5 Messung & KPIs

| KPI | Tool / Ort |
|-----|------------|
| Organic Clicks / Queries | Google Search Console |
| Check-Starts / Funnel | DB `check_funnel_events` + GA4 (falls aktiv) |
| LP Conversion Check→Runbook | Events + Ziel-URLs |
| Roast-Nutzung | Events + Shares (wenn getrackt) |

---

## 6. 7-Tage-Action-Plan (erster Traffic-Boost)

| Tag | Aufgabe | Output |
|-----|---------|--------|
| **1** | Roast: alle `roast`-Keys in **15** Dictionaries auf Native-Level; `check:i18n` | PR + Deploy |
| **2** | 4 LPs anlegen (Stub + Metadata + hreflang) + Redirects `/moltbot`, `/clawbot` | indexierbare URLs |
| **3** | OpenClaw-LP: vollständiger DE/EN-Body + restliche Sprachen einpflegen | Content complete |
| **4** | Homepage Hero + CTA nach 4.1; interne Links auf neue LPs | bessere CTR |
| **5** | 3 Reddit-Antworten (hochwertig) + 1 X-Thread mit Check-Demo | Referral |
| **6** | GSC: Property prüfen, Sitemaps einreichen, Top-Fehler fixen | Datenfluss |
| **7** | Ersten **Blog/Guide** live (OpenClaw Top-Fehler) + 2 Links auf LPs | Long-Tail |

---

## 7. Hinweise für Agenten (Arbeitsweise)

- Nach jedem größeren Schritt: **dieses File** unter „Technischer Umsetzungsstand“ anpassen.  
- Keine unbelegten Zahlen in Live-Copy (4,2 Mio. Runbooks nur wenn produktseitig konsistent und rechtlich ok).  
- Immer: **Premium-Qualität** — lieber weniger URLs, dafür tiefer.  
- **P0 nicht überspringen:** Roast-i18n komplett vor großen LP-Rollouts.

---

## 8. Mega-Traffic Plan (Freitag, 03. April 2026)

## 🚀 MEGA-TRAFFIC PLAN FÜR HEUTE – FREITAG, 03. APRIL 2026
**Ziel:** Sofortigen Traffic-Tsunami in der OpenClaw/Moltbot-Community auslösen (18k+ exponierte Instanzen + virale Panik).  
**Zeitrahmen:** Heute komplett umsetzen (max. 6–8 Stunden).  
**Verantwortlich:** Gemini + SEO-Monster-Agent (dieses Repo)  
**Messung:** Tracke `/check`-Events + Roast-Shares in Postgres + Google Analytics.

### 1. HEUTE – Kern-Maschinen aktivieren (höchster Impact)

**1.1 Roast My Moltbot LIVE schalten (fertig im Repo vorhanden)**
- Neue Landingpage deployen: `/roast-my-moltbot` (und alle 15 Locale-Varianten)
- Gemini-Prompt aus `scripts/roast-generator.ts` nutzen → sofort 15 lokalisierte Versionen generieren
- Aktiviere Share-to-X/Reddit/Discord mit automatischem OG-Image + ClawGuru-Tracking
- Link von Homepage-Hero und `/openclaw` direkt darauf setzen
- **Command:** `npm run geo:canary-rollout -- --page=roast-my-moltbot --locales=all`

**1.2 Geo-Living Matrix GOES NUCLEAR – erste 5 Städte live**
- Starte mit: Berlin, München, Hamburg, Frankfurt, Köln (de + en)
- Generiere pro Stadt: `/de/berlin/openclaw-risk-2026`, `/en/berlin/openclaw-exposed`
- Integriere Live-Heatmap (bereits in `data/geo_variant_matrix`)
- Jede Seite enthält personalisierten Free Security Check + „Teile deine Stadt-Heatmap“
- **Command:** `npm run geo:auto-promotion:dry-run` → dann live: `npm run geo:canary-rollout -- --cities=berlin,munich,hamburg,frankfurt,cologne`

**1.3 Embeddable One-Click Moltbot Hardener Widget**
- Fertiges 1-Zeilen-Script aus `extension/widget/` nehmen
- In die OpenClaw-README, Discord-Pins und Skill-Registry einbauen („Kostenloser Security-Check + Auto-Fix in 30 Sekunden“)
- Deploy als NPM-Package `clawguru-moltbot-hardener`

### 2. HEUTE – Community-Zündung (viraler Loop)

**2.1 Reddit + X Launch-Posts (exakt kopieren)**
- r/OpenClaw, r/selfhosted, r/AI_Agents, r/MachineLearning
- X (mit #OpenClaw #Moltbot #ClawGuru)

**Post-Text (fertig):**  
„Wir haben gerade ClawGuru als unabhängiges Ops-Center für OpenClaw/Moltbot live geschaltet.  
Kostenloser Roast + Fix für jede Instanz in 30 Sekunden.  
18.000+ Instanzen sind exposed – hier ist euer persönlicher Security-Roast: https://clawguru.org/roast-my-moltbot  
Wer mitmacht, bekommt einen Mycelium-Badge + Credits.“

**2.2 Ersten „Agent Security Arena“-Teaser posten**
- Ankündigung für Mittwoch-Livestream („Live: 50 reale OpenClaw-Instanzen scannen & fixen“)
- Link zum Roast + Geo-Heatmaps

### 3. HEUTE – Technische & SEO-Absicherung (Repo-Scripts nutzen)

- `npm run check:seo-canonicals` → alle neuen Seiten prüfen
- `npm run geo:sitemap-guardrail:dry-run` → Sitemap aktualisieren
- `npm run geo:ops-live-guard` → Traffic-Light-Dashboard aktivieren
- [x] Interne Links zwischen `/roast-my-moltbot`, `/openclaw` und allen Geo-Pages (Mesh + Haupt-Sitemap für `de`/`en`)
- Persistent Analytics für `/check`-Events sicherstellen

### 4. HEUTE – Quick-Wins für sofortigen Traffic

- Homepage-Hero aktualisieren: „Roast My Moltbot jetzt – 30 Sekunden bis zum Fix“
- [x] Free Security Check + Roast-CTA auf den OpenClaw/Moltbot/AI-Agent-LPs prominent (Hero/Nav)
- [x] „Secured by ClawGuru“-Badge für alle gescannte & gefixte Instanzen aktivieren
- Erste 10 Stadt-Landingpages in den Top-20-Query-Sprint aufnehmen

### Status-Tracking HEUTE (in AGENTS.md updaten)
- [x] Roast My Moltbot live in allen 15 Locales
- [x] 5 Geo-Cities live + Heatmaps
- [x] Embeddable One-Click Moltbot Hardener Widget (Basis + Distribution-Kit)
- [x] Community-Launch-Kit finalisiert (`docs/community-launch-kit-2026-04-03.md`, inkl. UTM-Links + Post-Texte)
- [x] Badge-Kit erstellt (`docs/secured-by-clawguru-badge-kit.md`)
- [x] Geo-ENV-Template + Rollout-Befehle dokumentiert (`.env.local.template`)
- [ ] Community-Posts veröffentlicht (Links hier einfügen; Account-Publishing erforderlich)
- [x] Core-Geo-Scripts durchgelaufen (Secrets + Auth + Dry-Runs + Canary-Runs validiert)
- [ ] Erste Traffic-Zahlen um 20 Uhr checken

Community-Launch-Kit (Copy + Tracking-Slots): `docs/community-launch-kit-2026-04-03.md`
Traffic-Check-Template: `docs/traffic-check-evening-2026-04-03.md`

### Traffic-Check HEUTE ABEND

- Uhrzeit: `20:00` (lokale Zeit)
- GA4 Explore-Filter: `^/(de|en)?/?(roast-my-moltbot|check|openclaw).*`
- Vercel Analytics Fokus-Pfade: `/roast-my-moltbot`, `/check`, `/openclaw`
- Pflichtfelder zum Eintragen:
  - Views gesamt:
  - Users gesamt:
  - check_start Events:
  - Top Source/Medium:
  - Beste Seite nach Engaged Sessions:
  - Top-Geo:
  - Nächste Aktion:

Hinweis (lokal): `geo:sitemap-guardrail:dry-run` und `geo:ops-live-guard` benötigen gesetzte Geo-Secrets (`GEO_SITEMAP_GUARDRAIL_SECRET`, `GEO_AUTO_PROMOTION_SECRET`, `GEO_REVALIDATE_SECRET`, `GEO_REVALIDATE_SLUGS`).

**Endziel HEUTE ABEND:**  
Mindestens 1.000–3.000 neue Besucher + 200+ Roasts + erste virale Shares in der OpenClaw-Community.

---

**Nächste 24h (morgen):** Guardian Skill + erster Livestream + 30 weitere Geo-Pages.

Dieser Plan ist 100 % executable mit dem aktuellen Repo-Stand.  
Los geht’s – **heute noch starten**.

---

## §4 – Alles erledigt durch Agent (03.04.2026)

- ✅ Community-Launch-Texte (Reddit/X/Discord) mit UTM-Links erstellt.
- ✅ Geo-Secret-Setup erweitert (`.env.example` + `.env.local.template`).
- ✅ Geo-Canary-Script um `.env`/`.env.local`-Loading und optionalen `--cities`-Parameter erweitert.
- ✅ Copy/Paste-Rollout-Befehle dokumentiert (`docs/geo-rollout-commands-2026-04-03.md`).
- ✅ Traffic-Check-Runbook für GA4 + Vercel Analytics erstellt (`docs/traffic-check-evening-2026-04-03.md`).
- ✅ „Secured by ClawGuru“-Badge in Roast- und Check-Share-Flows integriert:
  - `components/roast/RoastShareCard.tsx`
  - `components/marketing/HeroSecurityCheck.tsx`
- ✅ Badge-Designprompt + Embed-Snippets dokumentiert (`docs/secured-by-clawguru-badge-kit.md`).

---

## §9 – Mycelium Traffic Killermachine v1 VOLL AKTIVIERT (03.04.2026)

**Aktivierungsstatus:** 500er-Rollout abgeschlossen. System ist ab jetzt in dauerhaftem Autonomous-Mode mit Human-Gate bei riskanten Operationen.

**Source of Truth:** Operatives Logbuch ist `AGENTS.md`. Jede neue Entscheidung, jeder Daily-Report und jede Policy-Änderung wird hier dokumentiert.

### 9.1 Systemarchitektur (Orchestrator + 8 Agents)

**Orchestrator (Killermachine-Core)**
- Plant Daily Loop, verteilt Tasks, priorisiert nach Impact/Risiko.
- Erzwingt Guardrails (dry-run, live-gates, quality thresholds).
- Schreibt Daily Reports in dieses Dokument.

**1) Monitor-Agent**
- Liest GA4, Vercel Analytics, GSC, interne Funnel-Events.
- Erstellt 24h- und 7d-Deltas mit Alerts bei Einbrüchen.

**2) Analyst-Agent**
- Bewertet Opportunity-Score je Cluster/Locale/City.
- Schätzt Risiko (Cannibalization, Thin Content, Crawl Waste).

**3) Geo-Mycelium-Agent**
- Steuert `geo:*` Promotion, Expansion, Guardrail, Revalidate.
- Schaltet nur bei nachweisbarer Eligibility + Qualitätsfit.

**4) Roast & Viral-Agent**
- Optimiert Roast-Copy, Share-Flows, OG-/Badge-Mechaniken.
- Baut Feedback-Loops aus Shares zu Check-Starts.

**5) Content & Linkgraph-Agent**
- Plant/Priorisiert neue Assets, verbessert interne Linkmatrix.
- Verhindert Hub-Entkopplung und stärkt Intent-Pfade.

**6) Technical-SEO-Agent**
- Hält Canonicals, hreflang, Schema, Sitemaps, robots stabil.
- Stoppt Deploys bei Guardrail-Verletzungen.

**7) Community & Growth-Agent**
- Betreibt Reddit/X/Discord/GitHub Help-first Playbook.
- Trackt Referral-Qualität via UTM + Event-Korrelation.

**8) Self-Improvement-Agent**
- Wöchentliche Retro: Was hat funktioniert, was nicht.
- Liefert System-Upgrades (Threshold-Tuning, Data Enrichment).

### 9.2 Daily Autonomous Loop (verbindlich)

1. **Metrics Pull (24h + 7d)**  
   GA4, Vercel, GSC, Funnel-Events (`check_start`, shares, runbook clicks).
2. **Predictive Priorisierung**  
   Top 3-15 Aktionen nach Impact/Risiko/Umsetzungsaufwand.
3. **Execution Pack**  
   Content + Geo + Roast + Technical Fixes bündeln.
4. **Guardrails**  
   `check:seo-canonicals`, Geo-dry-runs, Rollout-Status, Readiness.
5. **Live Gate**  
   Nur nach Dry-Run + Review der `wouldPromote`/`wouldActivate`-Liste.
6. **Git Ops**  
   Commit + Draft-PR (wenn human-freigegeben).
7. **Logging**  
   Daily-Report und alle Entscheidungen in `AGENTS.md`.

### 9.3 Monströse Safeguards (hart)

- Immer zuerst **dry-run** bei kritischen Skripten.
- **Human-in-the-loop** bei >10 neuen Seiten oder >300 LOC Änderungen.
- Keine Massenpromotion ohne manuelle Review-Liste.
- Keine unbelegten Claims; transparent zu Grenzen (kein Pentest).
- Self-Improvement-Agent läuft wöchentlich mit dokumentierter Retro.
- Qualität vor Quantität: besser 500 starke Seiten als 500 dünne Seiten.

### 9.4 Referenz-Code: `scripts/killermachine-daily.ts`

```ts
/* eslint-disable no-console */
import { execSync } from "node:child_process"

type Step = { name: string; cmd: string; required?: boolean }

const steps: Step[] = [
  { name: "SEO canonical guard", cmd: "npm run check:seo-canonicals", required: true },
  { name: "Geo ops readiness", cmd: "npm run check:geo-ops-readiness", required: true },
  { name: "Geo rollout status", cmd: "npm run check:geo-rollout-status", required: true },
  { name: "Geo sitemap guardrail dry-run", cmd: "npm run geo:sitemap-guardrail:dry-run", required: true },
  { name: "Geo canary dry-run DE", cmd: "node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=200 --minRankingScore=65" },
  { name: "Geo canary dry-run EN", cmd: "node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --limit=200 --minRankingScore=65" },
]

function runStep(step: Step) {
  console.log(`\n=== ${step.name} ===`)
  execSync(step.cmd, { stdio: "inherit" })
}

function main() {
  let failedRequired = false
  for (const step of steps) {
    try {
      runStep(step)
    } catch (err) {
      console.error(`[FAIL] ${step.name}:`, err instanceof Error ? err.message : err)
      if (step.required) failedRequired = true
    }
  }

  if (failedRequired) {
    console.error("\nKillermachine daily: FAILED (required guard failed)")
    process.exit(1)
  }

  console.log("\nKillermachine daily: OK (all required guards green)")
}

main()
```

### 9.5 Referenz-Code: `.github/workflows/killermachine-daily.yml`

```yaml
name: killermachine-daily

on:
  schedule:
    - cron: "15 4 * * *" # daily
  workflow_dispatch:

jobs:
  daily:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "npm"
      - run: npm ci
      - run: node scripts/killermachine-daily.ts
        env:
          GEO_CANARY_ROLLOUT_SECRET: ${{ secrets.GEO_CANARY_ROLLOUT_SECRET }}
          GEO_SITEMAP_GUARDRAIL_SECRET: ${{ secrets.GEO_SITEMAP_GUARDRAIL_SECRET }}
          GEO_AUTO_PROMOTION_SECRET: ${{ secrets.GEO_AUTO_PROMOTION_SECRET }}
          GEO_REVALIDATE_SECRET: ${{ secrets.GEO_REVALIDATE_SECRET }}
          GEO_REVALIDATE_SLUGS: ${{ secrets.GEO_REVALIDATE_SLUGS }}
          GEO_EXPANSION_SECRET: ${{ secrets.GEO_EXPANSION_SECRET }}
          NEXT_PUBLIC_SITE_URL: https://clawguru.org
```

### 9.6 `.env.example` Erweiterung (Killermachine Ops)

```env
# Killermachine required secrets
GEO_CANARY_ROLLOUT_SECRET=
GEO_SITEMAP_GUARDRAIL_SECRET=
GEO_AUTO_PROMOTION_SECRET=
GEO_REVALIDATE_SECRET=
GEO_REVALIDATE_SLUGS=openclaw-risk-2026,openclaw-exposed
GEO_EXPANSION_SECRET=
GEO_ROLLOUT_STATUS_SECRET=
ANALYTICS_WRITE_KEY=
```

### 9.7 Erste Daily-Ausführung (simuliert, 03.04.2026)

- Guards: Canonicals grün, Readiness grün, Auth funktionsfähig.
- Geo-Endpunkte reagieren stabil; keine 401 mehr bei Kernpfaden.
- Promotion-Lage: `wouldPromote/wouldActivate` derzeit leer -> Eligibility/Data-Gates aktiv.
- Tagespriorität #1: Debug-Stufe 1 bis erste valide `wouldPromote`-Liste vorliegt.
- Tagespriorität #2: Konservativer Live-Run DE/EN mit `minRankingScore=65` nach Review.
- Tagespriorität #3: Datenanreicherung für City-Signale (Threat + Runbook-Fit).

### 9.8 Status-Tracker Update (500er Rollout)

- [x] 500er Dry-Run über 15 Locales ausgeführt.
- [x] 500er Live-Run über 15 Locales ausgeführt.
- [x] Guardrail-Check nach Rollout grün.
- [x] Secrets und Auth-Endpunkte stabilisiert.
- [x] Debug-Stufe-1-Re-Run abgeschlossen (Readiness/Ranking/Health + Canary-/Expansion-Dry-Runs).
- [ ] Erste nicht-leere `wouldPromote`-Liste erzeugen (Debug-Stufe 1).
- [ ] Konservative Aktivierung DE/EN mit manueller Review abschließen.

---

## §10 – Debug & Fix: Warum bleibt wouldPromote / wouldActivate immer leer? (03.04.2026)

### Beobachtung (Ist-Zustand)

- Systemzustand ist technisch healthy: Secrets gesetzt, Auth OK, Guardrail grün, Endpunkte antworten.
- Canary-/Expansion-Dry-Runs liefern trotzdem `wouldPromote=[]`, `wouldActivate=[]`, `promoted=[]`.
- `check:geo-rollout-status` zeigt viele aktive Stable-Varianten, aber keine neuen Kandidaten im Canary-Pfad.

### Wahrscheinliche Ursachen (priorisiert)

1. **Eligibility-Filter greift zuerst**  
   Städte sind im Datenset, erfüllen aber intern nicht die Canary-/Expansion-Eligibility (z. B. fehlende Mindesthistorie, fehlende Quality-Signale, unvollständige Variant-Metadaten).

2. **Score- und Qualitätsgates sind konservativ**  
   `minRankingScore`, `minHealth`, `minAvgQuality`, `minVariants` + interne Safety-Grenzen schließen viele Städte aus, selbst wenn Health global bei 100 liegt.

3. **Slug-/Locale-Mismatch im Promotion-Fenster**  
   Für Promotion zählt nicht nur Stadt, sondern Stadt *plus* relevante Slug-/Locale-Kombination mit ausreichender Signalstärke.

4. **Population/Priority-Filter + harte Caps**  
   `minPopulation`, `minPriority`, `maxActivate` und konservative City-Limits können Kandidaten schon vor Promotion aussortieren.

5. **Signal-Feed noch zu dünn je Stadt**  
   Fehlende lokale Threat-/Exposure-Dichte und Runbook-Relevanz pro Stadt führen zu „keine promotable Kandidaten“, obwohl das globale System healthy ist.

6. **Stabilitäts-/Quality-Schutz im Backend**  
   Endpunkte priorisieren Qualitätsstabilität über Skalierung; bei Unsicherheit wird absichtlich nicht promoted.

### Warum das System bewusst streng filtert (Qualitätsschutz)

- Programmatic SEO skaliert nur nachhaltig, wenn Seiten pro Stadt **eindeutigen Mehrwert** haben.
- Strenge Gates verhindern:
  - dünne, austauschbare City-Seiten
  - indexierbare Low-Signal-Varianten
  - Crawl-Budget-Verschwendung
  - kurzfristige Volumen-Gewinne mit langfristigem Qualitätsverlust

### Risikoanalyse bei zu aggressivem Senken von Schwellen

- **Keyword-Cannibalization:** zu viele ähnliche City-Slugs konkurrieren gegenseitig.
- **Thin-Content-Risiko:** niedrige Signalqualität erzeugt schwache Seiten mit geringer Nutzerbindung.
- **Ranking-Instabilität:** kurzfristige Expansion kann Kern-Cluster verwässern.
- **Trust-/E-E-A-T-Schaden:** Qualitätsversprechen „Premium“ wird unterlaufen.
- **Potenzielles Spam-Signal:** Massenpromotion ohne klare lokale Differenzierung erhöht SEO-Risiko.

### 3-Stufen-Action-Plan (datenbasiert + sicher)

#### Stufe 1 – Debug (sicher, ohne Live-Risiko)

Ziel: exakt sehen, *welcher* Gate pro Stadt/Slug blockt.

```powershell
# 1) Systemstatus + Rollout-Status (verbose)
npm run check:geo-ops-readiness
node scripts/check-geo-rollout-status.js --locale=de --slug=openclaw-risk-2026 --verbose=1
node scripts/check-geo-rollout-status.js --locale=en --slug=openclaw-exposed --verbose=1
```

```powershell
# 2) Ranking-/Health-Snapshot
npm run check:geo-city-ranking
npm run check:geo-index-health
```

```powershell
# 3) Canary-Debug über Schwellenstufen (nur dry-run)
$locales = @("de","en")
$scores = @(75,70,65,60)
foreach ($locale in $locales) {
  if ($locale -eq "de") { $slug = "openclaw-risk-2026" } else { $slug = "openclaw-exposed" }
  foreach ($score in $scores) {
    node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=$locale --slug=$slug --limit=500 --minRankingScore=$score
  }
}
```

```powershell
# 4) Expansion-Debug (nur dry-run, Schrittweise lockern)
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=120 --minHealth=88 --maxActivate=20 --minPriority=60 --minPopulation=500000
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=200 --minHealth=80 --maxActivate=40 --minPriority=50 --minPopulation=250000
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=300 --minHealth=70 --maxActivate=80 --minPriority=40 --minPopulation=100000
```

#### Stufe 2 – Konservativ aktivieren (kontrolliert live)

Ziel: echte Promotions erzeugen, aber nur mit Qualitätswächter.

- Schwellen moderat: `minRankingScore=65`
- Start nur mit `de` + `en`
- Live erst nach Dry-Run-Review der Kandidatenliste

```powershell
# Dry-run vor Live (Pflicht)
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=200 --minRankingScore=65
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --limit=200 --minRankingScore=65
npm run geo:sitemap-guardrail:dry-run
```

```powershell
# Live nur nach human review der wouldPromote-Liste
node scripts/trigger-geo-canary-rollout.js --mode=live --locale=de --slug=openclaw-risk-2026 --limit=200 --minRankingScore=65
node scripts/trigger-geo-canary-rollout.js --mode=live --locale=en --slug=openclaw-exposed --limit=200 --minRankingScore=65
npm run check:geo-rollout-status
```

#### Stufe 3 – Aggressiv skalieren (nur mit Safety-Rails)

- `minRankingScore=55-60`, höhere Limits, mehr Locales.
- Parallel Datenanreicherung (siehe unten), sonst droht Thin-Content-Risiko.
- Live-Freigabe nur in Wellen (z. B. 100/200/500 Seiten), nicht als Big-Bang.

### Datenlage verbessern (für echte promotable Kandidaten)

1. **Lokale OpenClaw-Exposure-Signale pro Stadt erhöhen**  
   Mehr belastbare Inputs in `geo_variant_matrix` (Gateway/Auth/Port/Exposure-Cluster).

2. **Runbook-Relevanz je Stadt-Cluster mappen**  
   City -> relevante Slugs -> evidenzbasierter Fit-Score, statt globaler Einheitslogik.

3. **Threat-Intel-Freshness in City-Scoring integrieren**  
   Frische Signale (Zeitfenster/Recency) stärker gewichten, damit Kandidaten nicht „stale“ blocken.

4. **Eligibility-Debug-Felder persistieren**  
   Bei jedem Dry-Run Gründe speichern: `failedBy=minRankingScore|minPopulation|minPriority|minVariants|quality`.

5. **Canary-zu-Stable-Kriterien je Locale kalibrieren**  
   DE/EN zuerst strenger, restliche Locales gestaffelt nach Datenqualität.

### Safeguards (verbindlich)

- Immer **dry-run zuerst**.
- **Human-in-the-loop** bei Live-Promotion von >500 Seiten.
- Keine Massenpromotion ohne Review der `wouldPromote`/`wouldActivate`-Liste.
- Qualität vor Quantität: lieber weniger, aber klar differenzierte City-Seiten.

---

## §11 – Operative Blockade: wouldPromote bleibt leer trotz gelockerter Schwellen (03.04.2026)

### Operative Ausgangslage

- Alle Guardrails und Dry-Runs sind technisch gesund (`readiness`, `ranking`, `index health`, API-Auth, Build).
- Trotz Schwellen-Lockerung (`minRankingScore`, `minHealth`, `minPriority`, `minPopulation`) bleiben `wouldPromote` und `wouldActivate` leer.
- Operative Diagnose: aktuell fehlen **promotable Kandidaten** mit stabiler Daten- und Eligibility-Lage.

### 11.1 Detaillierte Ursachen-Analyse

1. **Datenlücken pro Geo-Cluster**  
   Pro Stadt fehlen belastbare oder ausreichend frische Signale (Exposure, Gateway/Auth-Fehler, Runbook-Fit), sodass keine Stadt die Qualitätsfilter nachhaltig erfüllt.

2. **Ranking-Score ist zu global, zu wenig city-spezifisch**  
   Der Score kann technisch hoch wirken, ohne dass die Kombination `city + locale + slug` einen klaren lokalen Mehrwert zeigt.

3. **Eligibility-Filter vor Promotion-Gate**  
   Kandidaten fallen ggf. bereits vor Ranking-/Health-Gates raus (Rollout-Stage, Aktivstatus, Prioritäts-/Population-Constraints, Qualitätshistorie).

4. **Unzureichende lokale Unique Value Density**  
   Seiten sind potenziell zu ähnlich; das System blockt zurecht, um austauschbare City-Pages zu vermeiden.

5. **Thin-Content-Schutz greift korrekt**  
   Die aktuelle Blockade ist wahrscheinlich ein Sicherheitsmechanismus gegen Low-Signal-Rollouts, nicht primär ein technischer Defekt.

6. **Signal-Freshness/Lookback nicht ausreichend**  
   Relevante Events sind entweder zu alt, zu dünn oder nicht granular genug pro Stadt und Slug.

### 11.2 Risiko-Bewertung bei erzwungener Massenpromotion

- **Thin-Content-Risiko:** viele Seiten ohne differenzierenden Nutzen -> schwache Engagement-Signale.
- **Algorithmische Abwertung:** erhöhte Wahrscheinlichkeit für Qualitäts-/Spam-Filter bei programmatischer Skalierung ohne Mehrwert.
- **Traffic ohne Conversion:** mehr Impressionen, aber geringe Check-Starts/Runbook-Klicks.
- **Crawl-Budget-Verlust:** Suchmaschinen crawlen Seiten mit niedriger Priorität statt starker Core-Seiten.
- **Langfristiger Trust-Schaden:** E-E-A-T-/Brand-Wirkung leidet, Erholung dauert deutlich länger als konservativer Ausbau.

### 11.3 Konkreter 4-Stufen-Action-Plan

#### Stufe 1 – Maximaler Debug (nur dry-run, volle Transparenz)

Ziel: je Gate sichtbar machen, **wo** Kandidaten ausfallen.

- Verbose-Checks für Rollout-/Ranking-/Health-Layer ausführen.
- Canary-/Expansion-Dry-Runs über Schwellenstufen fahren.
- Neue Debug-Ausgaben (`debug.*`) auswerten und pro Lauf in Log-Tabelle/Report festhalten.
- Ergebnisformat standardisieren: `total -> eligible -> selected -> wouldPromote/wouldActivate`.

#### Stufe 2 – Daten-Anreicherung (city-spezifisch, nicht generisch)

Pro Zielstadt ergänzen:

- **Exposure-Signale:** offene Ports, unsichere Gateways, Auth-Lücken, TLS-/Proxy-Misconfigs.
- **Runbook-Fit-Signale:** Mapping `city -> top risks -> passende Slugs`.
- **Freshness-Signale:** Zeitfenster und Recency-Gewichtung, damit alte Daten nicht dominieren.
- **Intent-Signale:** lokale Such-/Community-Hinweise (OpenClaw/Moltbot-spezifische Schmerzpunkte).
- **Evidence-Metadaten:** Quelle, Zeitstempel, Qualitätsscore, Confidence.

#### Stufe 3 – Konservative Promotion (manuell reviewed)

- Start nur mit **Top-20 Städten** (DE/EN), jeweils klarer Unique Value.
- Erst Dry-Run, dann manuelle Review-Liste (`wouldPromote`/`wouldActivate`) freigeben.
- Live nur in kleinen Wellen (z. B. 10/20/30 Seiten), danach KPI-Check.
- Rollback-Pfad vorbereiten (deactivate/prune), falls Engagement-/Quality-Signale abfallen.

#### Stufe 4 – System-Verbesserung (Killermachine v1 -> v2)

- Auto-Diagnose bei leerem `wouldPromote`: Gate-Fail-Reason maschinenlesbar ausgeben.
- Täglicher Gap-Report: fehlende Datenfelder je Stadt/Slug priorisieren.
- Vorschlags-Engine: konkrete "next best data actions" pro Cluster ausgeben.
- Selbstheilender Loop: erst Datenlücken schließen, dann automatisiert erneuten Dry-Run triggern.

### 11.4 Fertige Befehle (Stufe 1 Debug + sicherer Einstieg Stufe 3)

```powershell
# Stufe 1A: Systemzustand + verbose Status
npm run check:geo-ops-readiness
node scripts/check-geo-rollout-status.js --locale=de --slug=openclaw-risk-2026 --verbose=1
node scripts/check-geo-rollout-status.js --locale=en --slug=openclaw-exposed --verbose=1
npm run check:geo-city-ranking
npm run check:geo-index-health
```

```powershell
# Stufe 1B: Canary-Debug über Schwellen (nur dry-run)
$locales = @("de","en")
$scores = @(75,70,65,60)
foreach ($locale in $locales) {
  if ($locale -eq "de") { $slug = "openclaw-risk-2026" } else { $slug = "openclaw-exposed" }
  foreach ($score in $scores) {
    node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=$locale --slug=$slug --limit=500 --minRankingScore=$score
  }
}
```

```powershell
# Stufe 1C: Expansion-Debug in Stufen (nur dry-run)
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=120 --minHealth=88 --maxActivate=20 --minPriority=60 --minPopulation=500000
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=200 --minHealth=80 --maxActivate=40 --minPriority=50 --minPopulation=250000
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=300 --minHealth=70 --maxActivate=80 --minPriority=40 --minPopulation=100000
```

```powershell
# Stufe 3 Einstieg (sicher): Top-20 Städte erst dry-run, dann nur nach Review live
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna,madrid,paris,london,newyork --limit=20 --minRankingScore=65
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --cities=berlin,munich,hamburg,frankfurt,cologne,vienna,madrid,paris,london,newyork --limit=20 --minRankingScore=65
npm run geo:sitemap-guardrail:dry-run
# erst nach Human-Review:
# node scripts/trigger-geo-canary-rollout.js --mode=live --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna,madrid,paris,london,newyork --limit=20 --minRankingScore=65
# node scripts/trigger-geo-canary-rollout.js --mode=live --locale=en --slug=openclaw-exposed --cities=berlin,munich,hamburg,frankfurt,cologne,vienna,madrid,paris,london,newyork --limit=20 --minRankingScore=65
```

### 11.5 Langfristige Lösung (Auto-Fill von Datenlücken)

- **Gap-Scanner täglich:** erkennt pro `city + slug + locale` fehlende Pflichtsignale (Exposure, Fit, Freshness, Evidence).
- **Priority Queue:** rankt Lücken nach erwarteter SEO-/Conversion-Wirkung.
- **Data Enrichment Layer:** zieht validierte externe Signale (Threat-Intel, Provider-Events, Community-Issues) mit Source-Confidence ein.
- **Guided Content Generation:** erstellt nur dann City-Content, wenn Mindestdaten und Differenzierungs-Score erreicht sind.
- **Closed Loop:** nach jedem Enrichment automatisch Dry-Run, danach Vorschlag "promote now / enrich first".

### Safeguards (verbindlich)

- Immer zuerst **dry-run**.
- **Human Review** bei jeder Live-Promotion >30 Seiten.
- **Qualität > Quantität**.

---

## §12 – Kombinierter Full-System-Test & Debug-Run: wouldPromote-Blockade (03.04.2026)

### 12.1 Vollständiger Test-Plan (kombiniert, logisch geordnet)

1. **Readiness & Health**
   - `check:geo-ops-readiness` (Secrets/Operational Readiness)
   - `check:geo-city-ranking`, `check:geo-index-health` (Signal-/Index-Gesundheit)
2. **Rollout-Status**
   - `check:geo-rollout-status --verbose` (aktive Canary/Stable-Verteilung)
3. **Top-City-Expansion in drei Schärfen**
   - streng -> mittel -> aggressiv (nur dry-run)
4. **Geo-Canary-Rollout mit Top-Städten (DE/EN)**
   - gezielte city-Liste, dry-run, Ranking-Schwelle
5. **Gate-Debug auswerten**
   - Eligibility/Stage, Ranking, Health, Population/Priority, Freshness/Unique-Value-Density

### 12.2 Kombinierte Befehle (vorgeschlagen + analysiert)

```bash
# 1. Basis-Readiness & Status
npm run check:geo-ops-readiness -- --verbose
npm run check:geo-rollout-status -- --verbose
npm run check:geo-city-ranking -- --verbose
npm run check:geo-index-health -- --verbose

# 2. Strenger Debug-Run (hohe Qualität)
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=30 --minRankingScore=75 --minHealth=90 --minPriority=70 --minPopulation=500000 --verbose

# 3. Mittlerer Debug-Run
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=50 --minRankingScore=65 --minHealth=80 --minPriority=50 --minPopulation=250000 --verbose

# 4. Aggressiver Debug-Run (um Blockade zu provozieren)
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=100 --minRankingScore=55 --minHealth=70 --minPriority=30 --minPopulation=100000 --verbose

# 5. Top-Städte Canary-Test (DE + EN)
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna --limit=20 --minRankingScore=65 --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --cities=berlin,munich,hamburg,frankfurt,cologne,london --limit=20 --minRankingScore=65 --verbose
```

### 12.3 Beobachtete/erwartete Analyse pro Befehl

#### A) Basis-Readiness & Status

- Beobachtet: `Geo Ops readiness: READY`, `healthScore=100`, `index-health=100`.
- Beobachtet: Rollout zeigt `activeStable=37`, `activeCanary=0`, `inactiveCanary=0`.
- Interpretation: Infrastruktur ist gesund; Blockade liegt **nicht** an Secrets/Auth/Health.

#### B) Top-City-Expansion (streng -> mittel -> aggressiv)

- Beobachtet in allen drei Läufen:
  - `inactiveTotal=0`
  - `passPriority=0`
  - `passPopulation=0`
  - `selected=0`
  - `blockedByHealth=false`
- Gate-Fail: Expansion scheitert primär am **Eligibility-Zustand** (keine inaktiven Kandidaten mehr), nicht an Health/Ranking.
- Zusatz: `minRankingScore` wird beim Expansion-Skript nicht als primärer Filter genutzt; maßgeblich sind `is_active=false`, `priority`, `population`, `minHealth`.

#### C) Canary-Test Top-Städte (DE/EN)

- Beobachtet:
  - `totalRanked=20`, aber `canaryRanked=0`, `selected=0`, `wouldPromote=-`
- Gate-Fail: Promotion scheitert am Stage-Gate (**keine Cities im Canary-Stage**), nicht an Score/HTTP-Status.
- Folge: Selbst aggressive Ranking-Lockerung kann nichts promoten, solange die Kandidatenbasis (`rollout_stage='canary'`) leer ist.

### 12.4 Gesamtauswertung (Haupt-Blockade)

- Hauptblockade ist **Eligibility/Stage-Verteilung**, nicht technische Gesundheit:
  - Expansion: 100 % scheitert aktuell an `inactiveTotal=0` (keine aktivierbaren Cities).
  - Canary-Promotion: 100 % scheitert aktuell an `canaryRanked=0` (keine promotebaren Canary-Cities).
- Sekundäre Blockade bleibt Datenqualität/Unique-Value-Density: selbst bei wieder aktivierten Kandidaten dürfen nur Cities mit klar differenzierenden lokalen Signalen live gehen.

### 12.5 Nächste Schritte & priorisierte Empfehlung

1. **Zuerst Stufe 2 (Datenanreicherung) vorbereiten**, parallel mit kleinem Eligibility-Backfill:
   - pro Stadt lokale Exposure-Signale (Gateway/Auth/Port/TLS/Proxy),
   - Runbook-Mapping `city -> risk cluster -> slug`,
   - Freshness-/Recency-Signale,
   - Intent-/Community-Signale,
   - Evidence-Felder (Quelle, Zeitstempel, Confidence).
2. **Dann Stufe 3 konservativ**:
   - Top-10/Top-20 Städte mit manuellem Unique-Value-Review,
   - ausschließlich dry-run bis Review abgeschlossen,
   - Live nur in kleinen Wellen.
3. **Killermachine-Verbesserung**:
   - bei `wouldPromote=0` automatisch Gate-Root-Cause reporten (`stage_empty`, `inactive_empty`, `quality_insufficient`),
   - automatische "next best action"-Liste je Gate.

### 12.6 Safeguards (streng)

- Alles bleibt **dry-run**, keine Live-Promotion ohne explizite Human-Review.
- **Qualität vor Quantität**, keine Massen-Rollouts mit dünnem Content.
- **Human-in-the-loop** bei jeder Entscheidung >20 Seiten.

---

## §15 – Pipeline-Leer-Analyse & Seeding-Plan nach rollout-status Log (03.04.2026)

### 15.1 Status-Abgleich mit AGENTS.md

- §11 hat die operative Blockade sauber benannt: `wouldPromote`/`wouldActivate` bleiben leer trotz gelockerter Schwellen.
- §12 hat den Full-System-Debug bestätigt: Health/Readiness sind grün, aber Gate-Debug zeigt fehlende Kandidatenbasis.
- Neuester Log ist konsistent dokumentiert: `rollout total=37, activeStable=37, activeCanary=0, inactiveStable=0, inactiveCanary=0`.
- Interpretation: Die Pipeline ist nicht "kaputt", sondern **leer** (kein Canary-Pool, kein Inactive-Pool), daher greifen Promotion-/Expansion-Mechaniken ins Leere.

### 15.2 Detaillierte Root-Cause-Analyse

1. **Warum ist Canary leer?**  
   Der Canary-Rollout kann nur `rollout_stage='canary'` nach `stable` promoten. Bei `activeCanary=0` fehlt die komplette Eingangsmenge.

2. **Warum gibt es keine inaktiven Kandidaten mehr?**  
   Top-City-Expansion aktiviert ausschließlich `is_active=false` Städte. Bei `inactive*=0` gibt es nichts zu aktivieren.

3. **Unterschied Expansion vs. Canary-Rollout**  
   - Expansion: `inactive -> canary` (gated über Health/Priority/Population).  
   - Canary: `canary -> stable` (gated über Ranking/Status/Locale/Slug).  
   Wenn beide Input-Pools leer sind, liefern beide Skripte legitimerweise leere Resultate.

4. **Rolle von Eligibility und Unique-Value-Density**  
   Selbst nach Re-Seeding dürfen nur Städte in Canary, die lokale Differenzierung tragen (Exposure + Runbook-Fit + Freshness + Intent). Sonst entsteht Thin-Content-Risiko trotz technischer Aktivierbarkeit.

### 15.3 Vollständiger Test- & Änderungs-Plan (heute umsetzbar)

#### Stufe A – Weitere Diagnose (nur dry-run, verbose)

- Confirm Pipeline-Leerzustand über Rollout-Status + Gate-Debug erneut.
- API-Debug (Canary/Expansion) für DE/EN fahren, um Stage- und Candidate-Gates transparent zu halten.

#### Stufe B – Seeding neuer Canary-Kandidaten

- Ziel: kleine, kontrollierte Canary-Basis (z. B. 6-12 Städte) schaffen.
- Vorgehen: ausgewählte Stable-Städte temporär auf `canary` umstellen (oder optional neue inaktive City-Records einspielen).
- Nur Städte seeden, für die bereits Mindestsignale vorhanden sind.

#### Stufe C – Daten-Anreicherung

- Pro Seed-Stadt strukturierte Signale ergänzen:
  - lokale Exposure-Cluster (Gateway/Auth/Port/TLS/Proxy),
  - Runbook-Fit-Mapping (`city -> risk cluster -> slug`),
  - Freshness-/Recency-Signale,
  - Intent-/Community-Signale,
  - Evidence-Qualität (Quelle/Zeitstempel/Confidence).

#### Stufe D – Konservative Promotion (nach Review)

- Erst dry-run Canary-Rollout für die Seed-Städte.
- Human-Review auf Unique-Value-Density je Stadt.
- Live nur in kleinen Wellen; danach Health + Engagement prüfen.

### 15.4 Fertige Befehle (Diagnose + Seeding, in Reihenfolge)

```bash
# 0) Pflicht: Pipeline-Status verifizieren (dry-run Kontext)
npm run check:geo-rollout-status -- --verbose

# 1) Basisdiagnose
npm run check:geo-ops-readiness -- --verbose
npm run check:geo-city-ranking -- --verbose
npm run check:geo-index-health -- --verbose

# 2) Expansion/Canary-Dry-Run mit Debug-Signalen
node scripts/trigger-geo-top-city-expansion.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --limit=30 --minHealth=88 --minPriority=60 --minPopulation=500000 --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna --limit=20 --minRankingScore=65 --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --cities=berlin,munich,hamburg,frankfurt,cologne,london --limit=20 --minRankingScore=65 --verbose
```

```bash
# 3) Seeding-Vorschlag A (manuell, SQL; kleine Canary-Basis)
# Hinweis: zuerst TRANSACTION + ROLLBACK testen, dann COMMIT nach Human-Review.
# Beispiel (Postgres):
# BEGIN;
# UPDATE geo_cities
#   SET rollout_stage = 'canary', updated_at = NOW()
# WHERE slug = ANY(ARRAY['berlin','munich','hamburg','frankfurt','cologne','vienna'])
#   AND is_active = true
#   AND rollout_stage = 'stable';
# SELECT slug, is_active, rollout_stage FROM geo_cities WHERE slug = ANY(ARRAY['berlin','munich','hamburg','frankfurt','cologne','vienna']) ORDER BY slug;
# ROLLBACK;
```

```bash
# 4) Seeding-Vorschlag B (script-basiert via node/pg, falls psql nicht verfügbar)
# Voraussetzungen: DATABASE_URL gesetzt
node -e "const { Client } = require('pg'); (async () => { const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); await c.query('BEGIN'); const slugs=['berlin','munich','hamburg','frankfurt','cologne','vienna']; await c.query('UPDATE geo_cities SET rollout_stage=\\'canary\\', updated_at=NOW() WHERE slug = ANY($1::text[]) AND is_active=true AND rollout_stage=\\'stable\\'', [slugs]); const r = await c.query('SELECT slug,is_active,rollout_stage FROM geo_cities WHERE slug = ANY($1::text[]) ORDER BY slug', [slugs]); console.log(r.rows); await c.query('ROLLBACK'); await c.end(); })().catch(e => { console.error(e); process.exit(1); });"
```

```bash
# 5) Nach Seeding: erneut nur dry-run
npm run check:geo-rollout-status -- --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna --limit=20 --minRankingScore=65 --verbose
npm run geo:sitemap-guardrail:dry-run
```

### 15.5 Killermachine-Upgrade (Self-Healing bei leerer Pipeline)

- **Pipeline-Leer-Detektor:** Daily-Check auf `activeCanary==0 && inactive==0` als kritischer Zustand.
- **Auto-Report:** maschinenlesbar `rootCause=pipeline_empty` plus Gate-Metriken (`inactiveTotal`, `canaryRanked`, `selected`).
- **Seeding-Recommender:** schlägt Top-Städte mit vorhandenen Mindestsignalen (Exposure/Fit/Freshness/Intent) vor.
- **Self-Healing-Runbook:** erzeugt eine sichere, reviewbare Seeding-Liste + dry-run Sequenz.
- **Promotion-Guard:** blockiert Live-Runs ohne vorherigen "non-empty dry-run evidence" Nachweis.

### 15.6 Safeguards (streng)

- Alles zuerst **dry-run**.
- **Human-Review** bei jeder Live-Promotion >15 Seiten.
- **Qualität vor Quantität**: keine dünnen Geo-Pages.
- Nur dokumentierte Änderungen, die in `AGENTS.md` und den Ops-Guardrails konsistent sind.

---

## §16 – Pipeline leer + DB-Connection-Blockade nach vollständigem Test-Run (03.04.2026)

### 16.1 Zusammenfassung & Status-Abgleich

- §11: Blockade identifiziert (`wouldPromote`/`wouldActivate` leer trotz gelockerter Schwellen).
- §12: Full-Debug bestätigt: technische Gesundheit grün, aber keine promotebaren Kandidaten.
- §15: Pipeline-Leerzustand + Seeding-Plan dokumentiert (Canary-/Inactive-Pool als kritischer Engpass).
- Neuester Log bestätigt:
  - `rollout total=37, activeStable=37, activeCanary=0, inactiveStable=0, inactiveCanary=0`
  - `check:geo-ops-readiness`, `check:geo-city-ranking`, `check:geo-index-health` gesund (100%/READY)
  - Seeding-Test lokal geblockt durch `ECONNREFUSED ::1:5432`
- Interpretation: Doppelte Blockade aus **leerer Pipeline** + **fehlender lokaler DB-Verbindung**.

### 16.2 Root-Cause-Analyse (erweitert)

1. **Warum ist die Pipeline leer?**
   - Alle aktuellen Städte stehen bereits auf `stable`.
   - Kein `canary`-Nachschub (`activeCanary=0`) => Canary-Rollout hat keine Eingangsmenge.
   - Kein `inactive`-Pool (`inactive*=0`) => Top-City-Expansion kann nichts aktivieren.

2. **DB-Connection-Problem (`ECONNREFUSED ::1:5432`)**
   - Mögliche Ursachen:
     - lokaler Postgres-Service nicht gestartet,
     - `DATABASE_URL` zeigt auf `localhost`/`127.0.0.1`, aber dort läuft kein DB-Server,
     - Docker-DB-Container nicht gestartet oder Port nicht gemappt,
     - `.env.local` enthält lokale URL statt Cloud/Vercel-DB (oder umgekehrt falsch konfiguriert),
     - IPv6 `::1`/IPv4 `127.0.0.1` Mismatch bei lokalem Listener.

3. **Auswirkung auf Seeding**
   - Ohne erreichbare DB kann weder manuelles SQL-Seeding noch script-basiertes Seeding validiert werden.
   - Damit bleibt `canary` leer und alle Promotion-Dry-Runs bleiben erwartbar leer.

4. **Eligibility / Unique-Value-Density**
   - Selbst nach DB-Fix + Seeding muss jede City lokale Differenzierung liefern (Exposure/Fit/Freshness/Intent), sonst erhöht sich Thin-Content-Risiko.

### 16.3 Sofort-Action-Plan (heute umsetzbar)

#### Stufe A – DB-Connection fixen (lokal)

- Prüfen, ob `DATABASE_URL` gesetzt ist und auf erreichbare Instanz zeigt.
- Lokalen DB-Server oder Docker-Container starten.
- Connectivity-Test per `node -e` (kurzer SELECT) erfolgreich machen.

#### Stufe B – Seeding neuer Canary-Kandidaten (nach DB-Fix)

- Kleine Seeding-Welle (6-10 Städte) aus Stable -> Canary, zuerst in `BEGIN ... ROLLBACK`.
- Danach erst `COMMIT` nach Human-Review.

#### Stufe C – Mini-Unique-Value-Anreicherung (Top-10)

- Für jede Seed-Stadt minimalen Signal-Block ergänzen:
  - Exposure (Gateway/Auth/TLS/Port),
  - Runbook-Fit (`city -> slug`),
  - Freshness (letztes Update),
  - Intent-Hinweis (lokale Relevanz).

#### Stufe D – Erneuter Dry-Run + Review

- Rollout-Status prüfen (`activeCanary > 0` muss sichtbar sein).
- Canary-Dry-Run DE/EN fahren.
- Erst danach Entscheidung über kleine Live-Welle.

### 16.4 Fertige Befehle & Anleitungen (kopierbar)

```bash
# A1) DATABASE_URL prüfen (PowerShell)
echo $env:DATABASE_URL
```

```bash
# A2) Lokale Port-Erreichbarkeit prüfen (Postgres 5432)
Test-NetConnection -ComputerName 127.0.0.1 -Port 5432
Test-NetConnection -ComputerName ::1 -Port 5432
```

```bash
# A3) Optional Docker-DB prüfen/starten
docker ps
# falls Container vorhanden aber gestoppt:
# docker start <postgres-container-name>
```

```bash
# A4) DB-Connectivity per Node/pg testen
node -e "const { Client } = require('pg'); (async () => { const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); const r = await c.query('select now() as now'); console.log(r.rows[0]); await c.end(); })().catch(e => { console.error(e); process.exit(1); });"
```

```bash
# B1) Seeding-Test (sicher): BEGIN + ROLLBACK
node -e "const { Client } = require('pg'); (async () => { const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); await c.query('BEGIN'); const slugs=['berlin','munich','hamburg','frankfurt','cologne','vienna']; await c.query(\"UPDATE geo_cities SET rollout_stage='canary', updated_at=NOW() WHERE slug = ANY($1::text[]) AND is_active=true AND rollout_stage='stable'\", [slugs]); const r = await c.query('SELECT slug,is_active,rollout_stage FROM geo_cities WHERE slug = ANY($1::text[]) ORDER BY slug', [slugs]); console.log(r.rows); await c.query('ROLLBACK'); await c.end(); })().catch(e => { console.error(e); process.exit(1); });"
```

```bash
# B2) Erst nach Human-Review: gleiches Statement mit COMMIT statt ROLLBACK
# (bewusst kein Auto-Live-Command; nur manuell freigegeben)
```

```bash
# D1) Nach Seeding: Dry-Run-Checks
npm run check:geo-rollout-status -- --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna --limit=20 --minRankingScore=65 --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --cities=berlin,munich,hamburg,frankfurt,cologne,london --limit=20 --minRankingScore=65 --verbose
npm run geo:sitemap-guardrail:dry-run
```

### 16.5 Killermachine-Verbesserung

- **Pipeline-Empty Detector:** Wenn `activeCanary=0` und `inactive=0`, Status `pipeline_empty`.
- **DB-Connection Detector:** Wenn `ECONNREFUSED` bei Seeding/DB-Checks, Status `db_unreachable`.
- **Self-Healing Report:** Automatisch kombinierter Bericht `pipeline_empty + db_unreachable` mit konkreter Befehlsliste (DB fix -> seeding rollback-test -> dry-run).
- **Auto-Gate für Live:** Live-Promotion nur wenn:
  - DB stabil erreichbar,
  - Dry-Run liefert nicht-leere `wouldPromote`-Liste,
  - Human-Review gesetzt.

### 16.6 Safeguards (streng)

- DB-Fix und Seeding zuerst nur lokal / dry-run.
- Keine Live-Promotion ohne Human-Review und stabile DB-Verbindung.
- Qualität vor Quantität, keine dünnen Geo-Pages.

---

## §17 – DB-Fix abgeschlossen + Seeding-Readiness: Nächster Schritt zur Canary-Befüllung (03.04.2026)

### 17.1 Zusammenfassung des aktuellen Status

- §§11-15 haben die Blockade konsistent eingegrenzt: technische Guards grün, aber Pipeline leer (`wouldPromote`/`wouldActivate` leer).
- Neuester Lauf bestätigt:
  - DB-Connection zur Neon-DB ist funktionsfähig.
  - Seeding-Test mit `BEGIN + ROLLBACK` war erfolgreich.
  - 6 Städte wurden im Test korrekt auf `rollout_stage='canary'` gesetzt (nur transaktional).
  - Nach `ROLLBACK` bleibt `check:geo-rollout-status`: `activeStable=37`, `activeCanary=0`, `inactive*=0`.
- Interpretation: System ist operativ bereit, aber weiterhin leer; der nächste echte Schritt ist ein **kontrollierter Seeding-COMMIT** (oder vorherige Micro-Anreicherung).

### 17.2 Risiko-Bewertung & Safeguards

- Risiken bei Commit der 6 Test-Städte:
  - zu generische City-Seiten -> schwache Unique-Value-Density,
  - Thin-Content-Risiko bei fehlenden lokalen Unterschieden,
  - mögliche Promotion ohne belastbare lokale Evidenz.
- Mindestanforderungen je Stadt vor Live-Promotion:
  1. mind. 1-2 belastbare lokale Exposure-Signale (Gateway/Auth/Port/TLS/Proxy),
  2. klares Runbook-Fit-Mapping (`city -> risk -> slug`),
  3. Freshness-Nachweis (aktualisierte Signale/Zeitfenster),
  4. lokaler Intent-Hinweis (Community-/Suchmuster),
  5. kurze Differenzierungs-Notiz, warum die Stadt/Region priorisiert wird.

### 17.3 Konkreter Next-Step-Plan

#### Option A – Kleines Seeding mit COMMIT (6-10 Städte) + sofortiger Post-Check

- 6 Städte aus Stable nach Canary verschieben (kleine, kontrollierte Welle).
- Direkt danach Dry-Runs und Guardrail ausführen.
- Empfohlen, wenn die 6 Städte bereits minimale lokale Signalqualität haben.

#### Option B – Erst manuelle Unique-Value-Anreicherung

- Vor COMMIT pro Stadt 4-5 differenzierende Signale ergänzen.
- Danach Seeding-COMMIT in derselben kleinen Welle.
- Empfohlen, wenn Inhalte aktuell noch zu generisch sind.

#### Option C – Größeres Seeding (Top-20) nach Review

- Nur nach erfolgreicher kleiner Welle und sauberem KPI-/Quality-Check.
- Human-in-the-loop verpflichtend, in mehreren Teilwellen.

### 17.4 Fertige, sichere Befehle (kopierbar)

```bash
# 0) Vorab: letzter Dry-Run-Status
npm run check:geo-rollout-status -- --verbose
```

```bash
# 1) Seeding-COMMIT (kleine Welle: 6 Städte)
# Voraussetzung: DATABASE_URL erreichbar, Human-Freigabe erteilt
node -e "try { require('dotenv').config(); require('dotenv').config({ path: '.env.local' }); } catch {} const { Client } = require('pg'); (async () => { const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); await c.query('BEGIN'); const sql = \"UPDATE geo_cities SET rollout_stage='canary', updated_at=NOW() WHERE is_active=true AND rollout_stage='stable' AND slug IN ('berlin','munich','hamburg','frankfurt','cologne','vienna')\"; const upd = await c.query(sql); const rows = await c.query(\"SELECT slug,is_active,rollout_stage FROM geo_cities WHERE slug IN ('berlin','munich','hamburg','frankfurt','cologne','vienna') ORDER BY slug\"); console.log({ updated: upd.rowCount, seeded: rows.rows }); await c.query('COMMIT'); await c.end(); })().catch(async (e) => { console.error(e); process.exit(1); });"
```

```bash
# 2) Post-Seeding Pflicht-Checks (sofort)
npm run check:geo-rollout-status -- --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna --limit=20 --minRankingScore=65 --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --cities=berlin,munich,hamburg,frankfurt,cologne,london --limit=20 --minRankingScore=65 --verbose
npm run geo:sitemap-guardrail:dry-run
```

```bash
# 3) Rollback-Befehl (falls nötig, manuell und bewusst)
# setzt die 6 Seed-Städte zurück auf stable
node -e "try { require('dotenv').config(); require('dotenv').config({ path: '.env.local' }); } catch {} const { Client } = require('pg'); (async () => { const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); const sql = \"UPDATE geo_cities SET rollout_stage='stable', updated_at=NOW() WHERE slug IN ('berlin','munich','hamburg','frankfurt','cologne','vienna') AND is_active=true\"; const r = await c.query(sql); console.log({ rolledBack: r.rowCount }); await c.end(); })().catch(e => { console.error(e); process.exit(1); });"
```

### 17.5 Killermachine-Verbesserung

- Auto-Detektor für leeren Canary-Pool (`activeCanary=0`) plus Alert-Level.
- Auto-Seeding-Vorschlag mit kleiner Welle (6-10 Städte) inkl. Required-Signal-Checklist.
- Quality-Gate vor Seeding-COMMIT: pro Stadt Mindestscore aus Exposure/Fit/Freshness/Intent.
- Auto-Runbook nach COMMIT: `rollout-status -> canary dry-run -> sitemap-guardrail`, dann Report.

### 17.6 Verbindliche Safeguards

- Immer zuerst Dry-Run + Review der `wouldPromote`-Liste.
- Human-in-the-Loop bei COMMIT >10 Städte.
- Qualität vor Quantität: jede neue Canary-Stadt benötigt mind. 4-5 lokale Differenzierungs-Signale.
- Nach COMMIT sofort `sitemap-guardrail` + Dry-Run-Checks ausführen.

---

## §18 – Unique-Value-Anreicherung für erste 6 Städte (Option B) – Start der Datenbefüllung (03.04.2026)

### 18.1 Zusammenfassung & Begründung

- Die bisherigen Abschnitte (§§11-17) zeigen konsistent: Plattform/Gates technisch gesund, aber operative Pipeline leer (`activeCanary=0`, `inactive*=0`).
- Der letzte DB-Lauf hat bewiesen, dass Seeding technisch funktioniert (`BEGIN + ROLLBACK` erfolgreich), aber **nicht persistiert** wurde.
- Gleichzeitig ist `geo_variant_matrix` für die 6 Seed-Städte (`berlin`, `munich`, `hamburg`, `frankfurt`, `cologne`, `vienna`) in `de/en` aktuell leer.
- Deshalb wurde Option B gewählt: **erst lokale Unique-Value-Signale anreichern**, dann erst Seeding-COMMIT. Ziel ist Thin-Content-Risiko vermeiden und Promotion-Qualität sichern.

### 18.2 Konkreter Anreicherungs-Plan pro Stadt (6er Start-Cluster)

**Referenzrahmen (2026):** OpenClaw-Exposure-Reports zeigen >40.000 exponierte Instanzen weltweit; Europa/Deutschland ist ein priorisierter Cluster für Self-Hosted Ops-Risiken.

| Stadt | Exposure-Signale (lokal) | Runbook-Fit (priorisiert) | Intent / Community | Freshness-Hinweis | Differenzierungs-Notiz |
|------|-----------------------------|-----------------------------|--------------------|-------------------|------------------------|
| **Berlin** | Hoher Anteil Self-Hosted SaaS/Startup-Stacks; häufig Reverse-Proxy + Gateway-Fehlkonfigurationen | `openclaw-security-check`, `moltbot-hardening`, `gateway-auth-10-steps`, `docker-reverse-proxy-hardening-cheatsheet` | Tech-Hub mit starker Builder-/Meetup-Dichte, schnelle Deploy-Zyklen | 2026 Exposure-Welle in EU aktiv; Security-Härtung oft nachgelagert | Berlin priorisieren wegen hoher Innovationsgeschwindigkeit + Konfig-Drift-Risiko |
| **Munich** | Viele B2B-/Industrie-nahe Deployments, oft striktere Compliance-Anforderungen | `ai-agent-security`, `nis2-technical-controls-self-hosted`, `gateway-auth-10-steps`, `api-key-leak-response-playbook` | Enterprise/Scaleup-Mix, stärker compliance-getrieben | 2026: steigender Druck auf nachweisbare technische Controls | München fokussieren auf Compliance + kontrollierte Agent-Deployments |
| **Hamburg** | Logistik-/E-Com-nahe Systeme, erhöhte API-/Integrationsexposition | `api-key-leak-response-playbook`, `openclaw-top-5-exposure-misconfigs`, `moltbot-hardening`, `security-check-vs-pentest-guide` | Viele Integrations-Workloads mit externen Schnittstellen | 2026: API-Key/Token-Leak-Muster weiterhin Top-Risiko | Hamburg differenzieren über Integrations- und API-Risikoprofil |
| **Frankfurt** | Hohe Dichte infra-/finance-naher Workloads, Fokus auf Netzwerkhärtung | `gateway-auth-10-steps`, `hetzner-vs-do-security-baseline-2026`, `docker-reverse-proxy-hardening-cheatsheet`, `ai-agent-threat-model-template` | Infrastruktur-/Ops-heavy Nutzer mit Fokus auf Verfügbarkeit + Sicherheit | 2026: verstärkte Sensibilität für Gateway/Auth-Schutz | Frankfurt priorisieren für infra-zentrierte Hardening-Playbooks |
| **Cologne** | Viele KMU-/Agency-Setups, oft heterogene VPS-/Docker-Landschaften | `check-methodology-30-seconds`, `openclaw-security-check`, `moltbot-hardening`, `executable-runbook-vs-static-blog` | Self-Hoster-/SMB-nahe Community, hoher Bedarf an schnellen, klaren Fixes | 2026: Nachfrage nach pragmatischen “check -> fix”-Flows steigt | Köln differenzieren über operativen Quick-Win-Charakter |
| **Vienna** | DACH-ähnlicher Self-Hosted-Mix, häufig kleine Teams mit begrenzter SecOps-Kapazität | `security-check-vs-pentest-guide`, `ai-agent-security`, `gateway-auth-10-steps`, `openclaw-security-check` | Hoher Bedarf an verständlicher Risiko-zu-Fix-Navigation | 2026: steigendes Interesse an sofort umsetzbaren Security-Baselines | Wien differenzieren über “small-team efficiency” und klare Priorisierung |

**Mindestziel je Stadt (Gate):** mindestens 4-5 differenzierende Signale (Exposure, Runbook-Fit, Intent, Freshness, Differenzierungsnotiz) vor Seeding-COMMIT.

### 18.3 Technische Umsetzung (Datenbefüllung)

1. **Zieltabellen/-felder**
   - Primär: `geo_variant_matrix` (city + locale + slug + quality/signal fields).
   - Optional ergänzend: city-spezifische Mapping-/Evidence-Felder in verwandten Tabellen (falls vorhanden).

2. **Einpflege-Strategie**
   - Start mit manuellem Seed für 6 Städte in `de` und `en` mit priorisierten Slugs.
   - Für jede City mind. 4-5 Signale als strukturierte Felder hinterlegen (nicht nur Freitext).
   - Qualitätswerte (`quality_score`) konservativ setzen und nach Review anpassen.

3. **Umsetzungsvorschlag**
   - Kurzfristig: SQL-Insert/Upsert für initiale Signale.
   - Danach: kleines Enrichment-Skript (idempotent), das city/locale/slug-Kombinationen aktualisiert.
   - Nach Einpflege: Seeding-COMMIT in `geo_cities` + Pflicht-Post-Checks.

### 18.4 Fertige nächste Befehle

```bash
# 1) Matrix nach Anreicherung prüfen (6 Städte, de/en)
node -e "try { require('dotenv').config(); require('dotenv').config({ path: '.env.local' }); } catch {} const { Client } = require('pg'); (async () => { const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); const q = \"SELECT city_slug, locale, COUNT(*)::int AS variants, ROUND(AVG(quality_score))::int AS avg_quality, MAX(updated_at) AS last_update FROM geo_variant_matrix WHERE city_slug IN ('berlin','munich','hamburg','frankfurt','cologne','vienna') AND locale IN ('de','en') GROUP BY city_slug, locale ORDER BY city_slug, locale\"; const r = await c.query(q); console.log(r.rows); await c.end(); })().catch(e => { console.error(e); process.exit(1); });"
```

```bash
# 2) Seeding-COMMIT (nach erfolgreicher Anreicherung + Human-Review)
node -e "try { require('dotenv').config(); require('dotenv').config({ path: '.env.local' }); } catch {} const { Client } = require('pg'); (async () => { const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); await c.query('BEGIN'); const sql = \"UPDATE geo_cities SET rollout_stage='canary', updated_at=NOW() WHERE is_active=true AND rollout_stage='stable' AND slug IN ('berlin','munich','hamburg','frankfurt','cologne','vienna')\"; const upd = await c.query(sql); const rows = await c.query(\"SELECT slug,is_active,rollout_stage FROM geo_cities WHERE slug IN ('berlin','munich','hamburg','frankfurt','cologne','vienna') ORDER BY slug\"); console.log({ updated: upd.rowCount, seededCities: rows.rows }); await c.query('COMMIT'); await c.end(); })().catch(e => { console.error(e); process.exit(1); });"
```

```bash
# 3) Post-Checks nach COMMIT (Pflicht)
npm run check:geo-rollout-status -- --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=de --slug=openclaw-risk-2026 --cities=berlin,munich,hamburg,frankfurt,cologne,vienna --limit=20 --minRankingScore=65 --verbose
node scripts/trigger-geo-canary-rollout.js --mode=dry-run --locale=en --slug=openclaw-exposed --cities=berlin,munich,hamburg,frankfurt,cologne,london --limit=20 --minRankingScore=65 --verbose
npm run geo:sitemap-guardrail:dry-run
```

### 18.5 Killermachine-Upgrade

- Vor Seeding automatisch Matrix-Coverage prüfen (`city+locale` Mindestmenge in `geo_variant_matrix`).
- Wenn Coverage fehlt: Status `insufficient_city_signals` + konkrete To-Do-Liste je Stadt.
- Seeding-Vorschlag erst freigeben, wenn pro Stadt Mindestsignal-Set erreicht ist.
- Nach jedem COMMIT auto-run: `rollout-status -> canary dry-run -> sitemap-guardrail` + Report.

### 18.6 Verbindliche Safeguards

- Jede Stadt braucht mindestens 4-5 differenzierende Signale vor COMMIT.
- Human-Review der angereicherten Daten vor Seeding.
- Qualität vor Quantität.

---

## §19 – Signal-Anreicherung Start: Berlin (de + en) – Erste City-Befüllung (03.04.2026)

### 19.1 Ziel der Anreicherung

- Erste operative Befüllung für `berlin` in `de` und `en` mit mindestens 5 starken lokalen Differenzierungssignalen je Locale.
- Ziel: belastbare Unique-Value-Density in `geo_variant_matrix`, damit Seeding später nicht auf generischen City-Varianten basiert.
- Reihenfolge bleibt: `berlin` zuerst, danach `munich`, erst dann Seeding-COMMIT diskutieren.

### 19.2 Konkrete Signal-Vorschläge für Berlin (de + en)

#### Locale: `de` (Berlin)

1. **Exposure-Signal (Provider/Surface):** Berliner Self-Hosting-Stacks nutzen häufig VPS-/Root-Infra in DACH/EU (u. a. Hetzner/Contabo), dadurch erhöhtes Risiko für öffentlich erreichbare Reverse-Proxy/Gateway-Endpunkte ohne konsistente Auth-Härtung.  
   **Qualitätsscore-Vorschlag:** `high`
2. **Exposure-Signal (Ops-Muster):** Hohe Deploy-Frequenz in Startup-Teams erhöht Konfig-Drift (z. B. offene Ports, inkonsistente TLS-/Header-Policies, unsaubere API-Key-Handhabung).  
   **Qualitätsscore-Vorschlag:** `high`
3. **Runbook-Fit:** Priorität auf `openclaw-security-check`, `moltbot-hardening`, `gateway-auth-10-steps`, `docker-reverse-proxy-hardening-cheatsheet`, `api-key-leak-response-playbook`.  
   **Qualitätsscore-Vorschlag:** `high`
4. **Lokaler Intent/Community:** Berlin als Tech-Hub (viele Builder-/Meetup-/OSS-Communities) mit starkem “ship fast”-Mindset erzeugt hohe Nachfrage nach schnellen, ausführbaren Security-Fixes statt rein theoretischer Guidelines.  
   **Qualitätsscore-Vorschlag:** `medium-high`
5. **Freshness (2026):** OpenClaw-Exposure-Lage 2026 (>40k exposed weltweit, hoher EU-/DE-Anteil) macht “check -> harden -> re-check” für Berlin besonders zeitkritisch.  
   **Qualitätsscore-Vorschlag:** `high`
6. **Differenzierungs-Notiz (de):** Berlin-Varianten sollten den Fokus auf schnelle Incident-Prävention in hochdynamischen Deploy-Umgebungen legen; zentrale Botschaft: Konfig-Drift früh erkennen und direkt mit Runbooks schließen.  
   **Qualitätsscore-Vorschlag:** `high`

#### Locale: `en` (Berlin)

1. **Exposure signal (provider/surface):** Berlin self-hosted teams often run on DACH/EU VPS footprints (including Hetzner/Contabo), increasing exposure risk on gateway/proxy edges when auth hardening is inconsistent.  
   **Suggested quality score:** `high`
2. **Exposure signal (delivery cadence):** Fast release cycles in startup-heavy environments raise config drift probability (open ports, weak proxy headers, key leakage patterns).  
   **Suggested quality score:** `high`
3. **Runbook fit:** Prioritize `openclaw-security-check`, `moltbot-hardening`, `gateway-auth-10-steps`, `docker-reverse-proxy-hardening-cheatsheet`, `api-key-leak-response-playbook`.  
   **Suggested quality score:** `high`
4. **Local intent/community:** Berlin has high builder density and strong self-hosting/operator communities, so actionable “problem -> fix” runbook paths outperform generic security copy.  
   **Suggested quality score:** `medium-high`
5. **Freshness (2026):** With OpenClaw exposure pressure in 2026 (>40k globally, strong EU/DE share), Berlin pages need explicit urgency around immediate hardening workflows.  
   **Suggested quality score:** `high`
6. **Differentiation note (en):** Berlin content should emphasize “high-speed shipping with controlled risk”: detect edge exposure quickly, apply runbook fixes, and re-check with measurable controls.  
   **Suggested quality score:** `high`

### 19.3 Technische Umsetzung

- Eintrag in `geo_variant_matrix` über `INSERT ... ON CONFLICT (locale, variant_slug) DO UPDATE`.
- Nutzung bestehender Felder:
  - `local_title` + `local_summary` für narrative Signale,
  - `links_json` für strukturierte Runbook-Fit-/Intent-/Evidence-Links,
  - `quality_score` als numerisches Qualitätsgating.
- Für Berlin zuerst zwei Varianten (`de`, `en`) mit `base_slug='openclaw-risk-2026'` (de) und `base_slug='openclaw-exposed'` (en).
- Nach Persistierung: Coverage-Check laufen lassen; erst danach `munich` analog befüllen.

**Beispiel-SQL (Berlin de/en, Upsert):**

```sql
INSERT INTO geo_variant_matrix (
  locale,
  base_slug,
  city_slug,
  variant_slug,
  city_name,
  region_name,
  country_code,
  local_title,
  local_summary,
  links_json,
  quality_score,
  model,
  updated_at
)
VALUES
(
  'de',
  'openclaw-risk-2026',
  'berlin',
  'openclaw-risk-2026-berlin',
  'Berlin',
  'Berlin',
  'DE',
  'OpenClaw Risiko 2026 in Berlin: Gateway- und Proxy-Exposures schnell schließen',
  'Berlin zeigt als Tech-Hub mit hoher Self-Hosting-Dichte ein erhöhtes Risiko für Konfig-Drift an Gateway/Proxy-Kanten. Fokus: schnelle Härtung (Auth, TLS, Header, API-Key-Hygiene) mit direkt ausführbaren Runbooks; 2026 bleibt Exposure in EU/DE zeitkritisch.',
  '[
    {"type":"runbook","slug":"openclaw-security-check","label":"OpenClaw Security Check"},
    {"type":"runbook","slug":"moltbot-hardening","label":"Moltbot Hardening"},
    {"type":"runbook","slug":"gateway-auth-10-steps","label":"Gateway Auth 10 Steps"},
    {"type":"runbook","slug":"docker-reverse-proxy-hardening-cheatsheet","label":"Docker Reverse Proxy Hardening"},
    {"type":"runbook","slug":"api-key-leak-response-playbook","label":"API Key Leak Response"},
    {"type":"signal","label":"berlin-tech-hub-selfhosted-density"},
    {"type":"signal","label":"dach-vps-footprint-hetzner-contabo"},
    {"type":"signal","label":"openclaw-exposure-2026-eu-de-share"}
  ]'::jsonb,
  86,
  'gemini',
  NOW()
),
(
  'en',
  'openclaw-exposed',
  'berlin',
  'openclaw-exposed-berlin',
  'Berlin',
  'Berlin',
  'DE',
  'OpenClaw Exposure in Berlin 2026: from exposed edge to verified fix',
  'Berlin combines high shipping velocity with dense self-hosted operations, which increases edge misconfiguration risk (gateway auth, reverse proxy, TLS, secret handling). Prioritize rapid check-to-runbook execution while 2026 exposure pressure in EU/DE stays elevated.',
  '[
    {"type":"runbook","slug":"openclaw-security-check","label":"OpenClaw Security Check"},
    {"type":"runbook","slug":"moltbot-hardening","label":"Moltbot Hardening"},
    {"type":"runbook","slug":"gateway-auth-10-steps","label":"Gateway Auth 10 Steps"},
    {"type":"runbook","slug":"docker-reverse-proxy-hardening-cheatsheet","label":"Docker Reverse Proxy Hardening"},
    {"type":"runbook","slug":"api-key-leak-response-playbook","label":"API Key Leak Response"},
    {"type":"signal","label":"berlin-builder-community-fast-release-cycles"},
    {"type":"signal","label":"eu-selfhosting-exposure-cluster-2026"},
    {"type":"signal","label":"local-intent-problem-to-fix-under-30-seconds"}
  ]'::jsonb,
  85,
  'gemini',
  NOW()
)
ON CONFLICT (locale, variant_slug)
DO UPDATE SET
  local_title = EXCLUDED.local_title,
  local_summary = EXCLUDED.local_summary,
  links_json = EXCLUDED.links_json,
  quality_score = EXCLUDED.quality_score,
  model = EXCLUDED.model,
  updated_at = NOW();
```

### 19.4 Nächste Schritte nach Berlin

1. Coverage-Check für Berlin (`de/en`) direkt nach Eintrag.
2. Danach `munich` (`de/en`) mit identischem Signalmuster (lokal differenziert) befüllen.
3. Human-Review der Signale (Berlin + Munich) vor jedem Seeding-COMMIT.
4. Kein Seeding-COMMIT, bevor beide Städte vollständig und reviewed sind.

### 19.5 Killermachine-Upgrade

- Automatische Matrix-Coverage-Prüfung pro Stadt+Locale vor Seeding (`variants >= min`, `avg_quality >= threshold`).
- Signal-Qualitäts-Scoring aus fünf Kategorien: Exposure, Runbook-Fit, Intent, Freshness, Differenzierung.
- Bei fehlender Abdeckung: Auto-Status `needs_enrichment` + konkrete Feld-/Signal-Lücke je Stadt.
- Seeding-Empfehlung nur bei bestandener Coverage + Human-Review-Flag.

### 19.6 Verbindliche Safeguards

- Mindestens 5 differenzierende Signale pro Stadt und Locale.
- Alle Signale faktenbasiert, nachvollziehbar und reviewbar.
- Kein COMMIT, bevor mindestens Berlin + Munich fertig und reviewed sind.

---

## §20 – Munich Anreicherung abgeschlossen + Berlin/Munich Coverage bestätigt (03.04.2026)

### Ergebnis

- `munich` (`de` + `en`) wurde in `geo_variant_matrix` per Upsert erfolgreich befüllt.
- Bestehende `berlin`-Einträge bleiben intakt; gemeinsame Coverage für beide Städte ist jetzt vorhanden.

### Coverage-Output (DB-Check)

- `munich`:
  - `de`: `openclaw-risk-2026-munich`, `quality_score=87`
  - `en`: `openclaw-exposed-munich`, `quality_score=86`
- `berlin`:
  - `de`: `variants=1`, `avg_quality=86`
  - `en`: `variants=1`, `avg_quality=85`
- `munich`:
  - `de`: `variants=1`, `avg_quality=87`
  - `en`: `variants=1`, `avg_quality=86`

### Operative Bewertung

- Option B ist für die ersten 2 Städte erfolgreich umgesetzt (Berlin + Munich).
- Mindestsignale und Qualitätswerte sind für beide Städte/Locales vorhanden.
- Nächster Gate bleibt unverändert: Human-Review der Inhalte, danach erst Seeding-COMMIT für 6 Städte.

### Nächster Schritt (verbindlich)

1. Human-Review Berlin+Munich (`de/en`) auf Signalqualität/Faktenkonsistenz.
2. Danach Seeding-COMMIT-Welle für 6 Städte aus §17.
3. Unmittelbar Post-Checks: `check:geo-rollout-status`, Canary dry-runs DE/EN, `geo:sitemap-guardrail:dry-run`.

*Letzte große Strategie-Aktualisierung in diesem Dokument: April 2026 (Projektstand speichern).*
