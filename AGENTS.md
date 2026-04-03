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

*Letzte große Strategie-Aktualisierung in diesem Dokument: April 2026 (Projektstand speichern).*
