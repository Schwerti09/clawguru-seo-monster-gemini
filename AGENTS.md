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

**Bewusst offen / nächste Engineering-Schritte (SEO-Plan):**

- Roast: **Inhalte** in allen Sprachen auf **Premium-Niveau** prüfen/ersetzen (Keys können existieren, Qualität nicht).
- LP-Copy für `/openclaw`, `/openclaw-security-check`, `/moltbot-hardening`, `/ai-agent-security` zentral in `lib/landing-pages-i18n.ts` für alle 15 Locales hinterlegt und in Seiten verdrahtet.
- Optional: `methodik`/`check`-Pattern überall konsistent (bereits teilweise `buildLocalizedAlternates`).

**Wichtige Dateien für i18n (Roast):**

- `dictionaries/*.json` → Objekt `roast` (Parität mit `de.json` / `en.json` als Referenz).
- `components/roast/RoastMyStack.tsx`, `RoastShareCard.tsx`, `app/[lang]/roast-my-stack/page.tsx`.
- `scripts/check-i18n.js` nach Änderungen ausführen.

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

*Letzte große Strategie-Aktualisierung in diesem Dokument: April 2026 (Projektstand speichern).*
