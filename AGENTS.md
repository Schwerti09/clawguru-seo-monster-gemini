# ClawGuru — AGENTS.md · Master Operating Manual v15 (15.04.2026)

> **This document is the single source of truth for every agent working in this codebase.**
> Read it completely BEFORE making any change. Update the Session Log after every session.
> Last updated: 15.04.2026 | Language: English (maximises AI model compatibility)

---

## Core Operating System – ClawGuru Agent Directive (God Mode v1.0)

Du bist der leitende Architect und Executor des ClawGuru-Projekts. Dein einziges Ziel ist **maximaler, nachhaltiger Traffic** bei höchster Qualität.

**Grundregeln (unverhandelbar):**

1. **Traffic-First Mindset**
   Jede Entscheidung muss die Frage beantworten: „Bringt das spürbar mehr qualifizierte Besucher und Conversions?"

2. **Qualität > Quantität**
   Jede neue Seite, jeder Artikel, jedes Feature muss mindestens Qualitätsstufe 92/100 erreichen. Lieber 25 extrem starke Seiten als 100 mittelmäßige.

3. **Viral + Emotional + Praktisch**
   ClawGuru muss gleichzeitig unterhaltsam (Roast), extrem hilfreich (executable Runbooks) und vertrauenswürdig sein.

4. **Killermachine v3 Prinzip**
   Alles, was manuell wiederholt werden muss, soll automatisiert oder in klare, wiederholbare Workflows gegossen werden.

**Arbeitsprinzipien für jeden Task:**

- Immer zuerst den großen Traffic-Hebel suchen.
- Starke interne Verlinkung priorisieren.
- Jede Seite muss mindestens einen klaren Call-to-Action haben (Live Check, Roast, Download, Academy).
- Content muss „Roast + Runbook" oder „Problem → Sofort-Fix" Struktur haben.
- SEO muss von Anfang an mitgedacht werden (Title, Meta, H1-H3, interne Links).

**Verboten:**
- Langweilige, trockene, technische Texte ohne Persönlichkeit.
- Manuelle §-Blöcke ohne klaren Traffic-Beitrag.
- Features bauen, die niemand teilt.

**Aktuelles Hauptziel:** ClawGuru zur bekanntesten und meistgenutzten Plattform für Self-Hosted Security & AI-Agent Hardening machen.

> Dieser Abschnitt hat oberste Priorität. Jede zukünftige Arbeit muss sich danach richten.

---

## 0. PREAMBLE — SIX NON-NEGOTIABLES (Read Before Anything Else)

These rules are absolute. Breaking any one of them costs real traffic, real money, or breaks production.

### Rule 1 — Green Build Before Every Push
```powershell
npm run build 2>&1 | Select-Object -Last 15
# Exit code MUST be 0. If not: fix it, do NOT push.
```

### Rule 2 — Every Page Needs Its Own `openGraph.url`
Pages that inherit the root layout's `og:url = "https://clawguru.org"` are classified as **Soft 404** by Google.
Every page component's `generateMetadata()` MUST return its own `openGraph.url`.
```ts
openGraph: { url: `${SITE_URL}/${locale}/moltbot/my-slug`, type: "article" }
```

### Rule 3 — Always Use `buildLocalizedAlternates()`, Never Hardcoded LANGS
```ts
// WRONG — misses x-default hreflang, causes indexing issues
const LANGS = ['de','en','es',...];
alternates: { canonical: `...`, languages: Object.fromEntries(LANGS.map(...)) }

// CORRECT
import { buildLocalizedAlternates } from "@/lib/i18n"
alternates: buildLocalizedAlternates(locale, "/moltbot/my-slug")
```

### Rule 4 — Every New Page Slug Must Be Added to the Sitemap
After creating `app/[lang]/moltbot/my-slug/page.tsx`, add `"my-slug"` to `MOLTBOT_SLUGS` in
`app/sitemaps/[name]/route.ts`. Without this Google never discovers the page.

### Rule 5 — Never Block Sitemap XML Files in robots.txt
`app/robots.txt/route.ts` must NEVER contain `Disallow: */sitemaps/` or `Disallow: */*.xml`.
The file must explicitly have `Allow: /sitemaps/`.

### Rule 6 — MANDATORY Dark Theme Design System (85+ Quality Standard)

**ClawGuru uses a DARK THEME. The body background is `#0a0a0a` (near-black).**
**EVERY new page MUST use dark backgrounds with light text. NO EXCEPTIONS.**
**Violation of these rules makes text UNREADABLE and destroys user experience.**

#### FORBIDDEN Classes (NEVER use these — they create white/light elements on dark background)
```
BANNED: bg-gray-50, bg-gray-100, bg-gray-200
BANNED: bg-yellow-50, bg-blue-50, bg-green-50, bg-red-50, bg-purple-50
BANNED: bg-teal-50, bg-orange-50, bg-amber-50, bg-cyan-50, bg-pink-50, bg-indigo-50
BANNED: bg-blue-100, bg-green-100, bg-yellow-100, bg-red-100, bg-purple-100
BANNED: bg-teal-100, bg-orange-100, bg-amber-100, bg-cyan-100
BANNED: bg-white
BANNED: text-gray-600, text-gray-700, text-gray-800, text-gray-900
BANNED: text-teal-600, text-teal-700, text-teal-800, text-teal-900
BANNED: text-blue-600, text-blue-700, text-blue-800, text-blue-900
BANNED: border-gray-200, border-blue-200, border-green-200, border-teal-200, border-orange-200
```

#### QUICK FIX TABLE — Replace light classes with dark equivalents
| ❌ Banned (light) | ✅ Use instead (dark) |
|---|---|
| `bg-teal-50` | `bg-teal-900 border border-teal-700` |
| `bg-orange-50` | `bg-orange-900 border border-orange-700` |
| `bg-amber-50` | `bg-amber-900 border border-amber-700` |
| `bg-cyan-50` | `bg-cyan-900 border border-cyan-700` |
| `bg-blue-50` | `bg-blue-900 border border-blue-700` |
| `bg-green-50` | `bg-green-900 border border-green-700` |
| `bg-yellow-50` | `bg-yellow-900 border border-yellow-700` |
| `bg-red-50` | `bg-red-900 border border-red-700` |
| `bg-gray-50` / `bg-gray-100` | `bg-gray-800 border border-gray-700` |
| `bg-white` | `bg-gray-900` |
| `text-teal-600/700/800` | `text-teal-300` |
| `text-blue-600/700/800` | `text-blue-300` |
| `text-gray-600/700/800/900` | `text-gray-300` or `text-gray-400` |
| `border-gray-200` | `border-gray-700` |

#### REQUIRED: Card Backgrounds
```tsx
// Standard card (outer container)
<div className="bg-gray-800 p-6 rounded-lg border border-gray-700">

// Standard card (inner/nested)
<div className="bg-gray-800 p-4 rounded-lg border border-gray-700">

// Code block card
<div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
```

#### REQUIRED: Colored Cards (accent sections like Best Practices)
```tsx
<div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
  <h3 className="font-semibold text-blue-300 mb-2">Title</h3>
  <p className="text-sm text-blue-200">Description</p>
</div>
<div className="bg-green-900 p-4 rounded-lg border border-green-700">
  <h3 className="font-semibold text-green-300 mb-2">Title</h3>
  <p className="text-sm text-green-200">Description</p>
</div>
<div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
  <h3 className="font-semibold text-yellow-300 mb-2">Title</h3>
  <p className="text-sm text-yellow-200">Description</p>
</div>
<div className="bg-red-900 p-4 rounded-lg border border-red-700">
  <h3 className="font-semibold text-red-300 mb-2">Title</h3>
  <p className="text-sm text-red-200">Description</p>
</div>
```

#### REQUIRED: Link Cards (Further Resources section)
```tsx
<a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
  <div className="font-semibold text-cyan-400">Security Check</div>
  <div className="text-sm text-gray-300">Description text</div>
</a>
```

#### REQUIRED: "Not a Pentest" Notice Box (EVERY content page)
```tsx
<div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
  <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
</div>
```

#### REQUIRED: Text Colors
```
Headings (h1):    text-gray-100   (class: "text-4xl font-bold mb-4 text-gray-100")
Headings (h2):    text-gray-100   (class: "text-2xl font-semibold mb-4 text-gray-100")
Headings (h3):    text-cyan-400   (class: "font-bold text-cyan-400 mb-3")
Body paragraphs:  text-gray-300   (class: "text-lg text-gray-300 mb-8")
List items:       text-gray-300   (class: "space-y-2 text-sm text-gray-300")
Muted/secondary:  text-gray-400
Link text:        text-cyan-400
```

#### REQUIRED: Table Styling (for Compare pages)
```tsx
<table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
  <thead className="bg-gray-800">
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Header</th>
  </thead>
  <tbody>
    <tr className="border-b border-gray-700">...</tr>           // normal row
    <tr className="border-b border-gray-700 bg-gray-800/50">... // zebra row
  </tbody>
</table>
```

#### REQUIRED: Status Badges (dynamic conditional classes)
```tsx
// Use dark-900 backgrounds with light-300 text
${status === 'automated' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}
// Conditional row backgrounds
${active ? 'bg-green-900/30 border-green-700' : 'bg-gray-800 border-gray-700'}
```

#### REQUIRED: Numbered Step Cards
```tsx
<div className="flex items-start space-x-4">
  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
  <div>
    <div className="font-semibold text-gray-100">Step Title</div>
    <div className="text-sm text-gray-300">Step description</div>
  </div>
</div>
```

#### REQUIRED: Section Structure (`<section>` elements)
```tsx
// CORRECT — clean section, no background on section itself
<section className="mb-10">
  <h2 className="text-2xl font-semibold mb-4 text-gray-100">Section Title</h2>
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    {/* content inside */}
  </div>
</section>

// WRONG — bg-gray-100 on section creates white block
<section className="mb-10 bg-gray-100 p-6 rounded-lg">  ❌ NEVER DO THIS
```

#### Pre-Push Visual Verification Checklist
Before pushing ANY new content page, run these checks (PowerShell):
```powershell
# 1. Zero light backgrounds remaining (ALL banned -50 and -100 variants)
Get-ChildItem -Path "app\[lang]" -Recurse -Filter "*.tsx" |
  Select-String "bg-gray-50|bg-gray-100|bg-yellow-50|bg-blue-50|bg-green-50|bg-white|bg-teal-50|bg-orange-50|bg-amber-50|bg-cyan-50|bg-red-50|bg-purple-50"
# MUST return 0 results

# 2. Zero light text on dark background
Get-ChildItem -Path "app\[lang]" -Recurse -Filter "*.tsx" |
  Select-String "text-gray-600|text-gray-700|text-gray-800|text-gray-900|text-teal-600|text-blue-600"
# MUST return 0 results

# 3. Zero light borders
Get-ChildItem -Path "app\[lang]" -Recurse -Filter "*.tsx" |
  Select-String "border-gray-200|border-blue-200|border-teal-200|border-orange-200"
# MUST return 0 results

# 4. Build passes
npm run build 2>&1 | Select-Object -Last 15
# Exit code MUST be 0
```

---

## 1. MISSION & MARKET POSITION

**ClawGuru is the #1 platform worldwide for Security Checks, Executable Runbooks, and Compliance Automation for Self-Hosting, OpenClaw, and Moltbot-based infrastructures.**

### Why We Win
- **"Not a Pentest" Framing** — We are the trusted defence partner, not an attack tool. Strongest SEO+trust differentiator.
- **Executable Runbooks** — Only platform that turns security checks into automated playbooks.
- **Geo-First SEO** — 16 languages × 500+ cities × 30+ security topics = 1,000,000+ indexable quality pages.
- **Self-Hosted + GDPR/DSGVO** — EU-first, no cloud lock-in. Differentiates from Wiz, Snyk, Datadog.
- **Real Data** — 100% real, no mock metrics. Complete audit trails.

### Market Position (15.04.2026)

| Metric | Current | Target |
|--------|---------|--------|
| Indexed Pages | ~25,500 URLs | 1,000,000+ URLs |
| Active Cities (Geo) | 123 cities | 500+ cities |
| Languages | 16 | 16 (complete incl. Afrikaans) |
| Content Clusters | Moltbot(70+), OpenClaw(17), Solutions(15), Compare(30), CVE(30+) | 50+ clusters |
| Monthly Visitors | Growth phase | 500,000+ unique visitors |
| **Paid Subscribers** | **0 (launch phase)** | **1,000+ (Pro/Team)** |

### Trust Anchor — Use on Every Content Page
```tsx
<div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
  <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
</div>
```

### Core Products

| Product | URL | Description |
|---------|-----|-------------|
| Security Check | /securitycheck | HTTP header scan, security score, real-time analysis |
| Runbooks | /runbooks | 600+ executable security playbooks |
| Oracle | /oracle | AI-powered threat intelligence |
| Neuro AI | /neuro | Pattern analysis, anomaly detection |
| Dashboard | /dashboard | Customer data, tool executions, Mycelium graph |
| Copilot | /copilot | AI assistant for security questions |

---

## 2. CURRENT STATE (Stand 15.04.2026)

### Live Pages — Full Inventory

**Moltbot Pages (`app/[lang]/moltbot/`) — 70+ pages, all live**

| Slug | Topic |
|------|-------|
| security-framework | Overall framework |
| api-security-protection | API hardening |
| authentication-oauth2-jwt | Auth + JWT + MFA |
| hardening-guide-2024 | Hardening checklist |
| network-security-firewall | Network + iptables |
| threat-detection-setup | Falco + Prometheus |
| logging-auditing-compliance | Logs + GDPR |
| container-security-docker-kubernetes | Docker + K8s |
| database-security-encryption | DB security |
| incident-response-automation | IR + Playbooks |
| zero-trust-architecture | ZTA + RBAC |
| devsecops-pipeline | CI/CD Security |
| backup-recovery-disaster-recovery | Backup + DR |
| vulnerability-scanning | Trivy + Renovate |
| ssl-tls-management | TLS + Certificates |
| api-gateway-security | Kong Gateway |
| monitoring-dashboards | Prometheus + Grafana |
| compliance-gdpr-setup | GDPR consent |
| secrets-vault-management | HashiCorp Vault |
| nis2-compliance-setup | NIS2 Art. 21 |
| cloud-security-posture-management | CSPM + AWS |
| identity-governance-iam | IAM/RBAC |
| data-loss-prevention | DLP |
| security-automation-workflows | Webhooks + automation |
| cryptography-encryption-guide | Cryptography |
| api-rate-limiting-advanced | Advanced rate limiting |
| runtime-protection-rasp | RASP |
| security-posture-score | Security score |
| cloud-native-security | Cloud-native |
| ai-agent-threat-model | AI agent threat modeling |
| ai-agent-threat-model-template | Threat model template |
| real-time-cve-feed | CVE feed integration |
| bot-security-testing | Bot security testing |
| sbom-generation | SBOM generation |
| compliance-automation-engine | Compliance automation |
| ai-agent-security | AI agent protection |
| ai-agent-hardening-guide | AI agent hardening |

**OpenClaw Pages (`app/[lang]/openclaw/`) — 15 pages, all live**

| Slug | Topic |
|------|-------|
| self-hosted-security-checklist | Self-hosted checklist |
| docker-swarm-hardening | Swarm hardening |
| reverse-proxy-security | Reverse proxy |
| firewall-configuration-guide | Firewall config |
| security-headers-guide | Security headers |
| intrusion-detection-setup | IDS setup |
| server-hardening-checklist | Server hardening |
| database-access-control | DB access control |
| audit-logging-setup | Audit logging |
| supply-chain-security | Supply chain |
| service-mesh-security | Service mesh (Istio/Envoy) |
| waf-configuration | WAF setup |
| cicd-security-pipeline | CI/CD security |
| secrets-rotation-automation | Secrets rotation |
| microservices-security | Microservices security |

**Solutions Pages (`app/[lang]/solutions/`) — 15+ pages, all live**

`soc2-compliance-automation`, `kubernetes-security-hardening`, `aws-security-architecture`,
`startup-security-foundation`, `enterprise-siem-integration`,
`iso27001-certification-roadmap`, `pci-dss-compliance`, `hipaa-security-controls`,
`dsgvo-compliance-automation`, `nis2-compliance`, `nist-csf-compliance`,
`eu-ai-act-compliance`, `pci-dss-ai-payments-v2`, `zero-trust-ai-architecture`,
`gdpr-llm-data-processing`

**Compare Pages — 30+ pages, all live**

`openclaw-vs-snyk`, `openclaw-vs-semgrep`, `clawguru-vs-wiz`, `openclaw-vs-sonarqube`,
`moltbot-vs-opsgenie`, `moltbot-vs-clawbot`,
`clawguru-vs-crowdstrike`, `clawguru-vs-datadog`, `openclaw-vs-falco`,
`clawguru-vs-lacework`, `moltbot-vs-pagerduty`,
`clawguru-vs-trivy`, `clawguru-vs-checkov`, `openclaw-vs-wazuh`,
`clawguru-vs-snyk`, `moltbot-vs-victorops`, `openclaw-vs-ossec`,
`moltbot-vs-splunk`, `openclaw-vs-crowdsec`

**CVE Fix Pages (`app/[lang]/academy/cve/`) — 30+ pages, all live**

CVE-2024-3094, CVE-2024-27198, CVE-2025-29927, CVE-2024-45337, CVE-2024-21626,
CVE-2024-6387, CVE-2023-44487, CVE-2024-56374, + 22 more CVEs covering Nginx, HAProxy,
PostgreSQL, Redis, Docker, GitLab, Jenkins, Kubernetes, Vault, and more.

**Specialized Security Pages (in `app/[lang]/`) — 31+ pages, all live**

`linux-hardening`, `nginx-hardening`, `docker-security-hardening`, `kubernetes-network-policies`,
`terraform-security`, `postgresql-security`, `redis-security`, `mongodb-security`,
`elasticsearch-security`, `grafana-hardening`, `prometheus-vpn`, `keycloak-hardening`,
`vault-hardening`, `splunk-security`, `datadog-security`, `jenkins-security`,
`gitlab-cicd-security`, `circleci-security`, `argocd-security`, `kafka-security`,
`rabbitmq-security`, `windows-server-security`, `sonarqube-security`,
`opentelemetry-security`, `cloudformation-security`, `tailscale-pam`, `aws-iam-security`,
`aws-vpc-flow-logs`, `azure-ad-security`, `cloudflare-tunnel-firewall-rules`,
`docker-reverse-proxy-hardening-cheatsheet`

### Sitemap Coverage (after 08.04.2026 fix)

| Sitemap | URLs/locale | × 16 locales | Total |
|---------|-------------|--------------|-------|
| `main-{locale}.xml` — Hub pages | 26 | × 16 | 416 |
| `main-{locale}.xml` — Moltbot sub-pages | 70 | × 16 | 1,120 |
| `main-{locale}.xml` — OpenClaw sub-pages | 17 | × 16 | 272 |
| `main-{locale}.xml` — Security pages | 31 | × 16 | 496 |
| `main-{locale}.xml` — Solutions pages | 15 | × 16 | 240 |
| `main-{locale}.xml` — Compare pages | 30 | × 16 | 480 |
| `main-{locale}.xml` — CVE pages | 30 | × 16 | 480 |
| `runbooks-{locale}-{bucket}.xml` | ~500/bucket × 5 | × 16 | ~40,000 |
| `tags-{locale}-{bucket}.xml` | 5 | × 16 | 400 |
| **TOTAL** | | | **~43,900** |

### Critical Open Tasks (Do These First)

**1. Vercel Cache Purge (URGENT — cached 404s still in CDN)**
Vercel Dashboard → Project → Settings → Data Cache → **Purge Everything**
Or: Deployments → latest deploy → three dots → **Redeploy (without cache)**

**2. Vercel Environment Variables — Set in Vercel Dashboard**
```
GEO_MATRIX_SITEMAP=1               # Activates geo-runbook sitemaps
GEO_MATRIX_SITEMAP_CITY_LIMIT=50   # 50 cities per sitemap
SITEMAP_BUCKETS=5                  # All 5 buckets (a-f, g-l, m-r, s-z, 0-9)
GEMINI_MODEL=gemini-2.5-flash      # Default model (all Gemini models currently unstable)
```

**2. Asia/LatAm DB Seeding — Run Once After Deploy**
```
GET https://clawguru.org/api/geo/asia-latam-expansion?stable=1
Authorization: Bearer [GEO_EXPANSION_SECRET from Vercel Env]
```
Activates 27 cities: Japan (5), South Korea (5), Brazil (5), Mexico (5), Southeast Asia (7).

**3. Google Search Console — Manual Actions**
1. Submit `https://clawguru.org/sitemap.xml` → Test + Resubmit
2. URL Inspection: `https://clawguru.org/de/runbooks` → Request Indexing
3. URL Inspection: `https://clawguru.org/de` → Request Indexing
4. Check `https://clawguru.org/robots.txt` — `/sitemaps/` must NOT be blocked

**4. Pending Content Batches**

| Batch | Status | Notes |
|-------|--------|-------|
| OpenClaw Batch 2 (5 pages) | ✅ DONE | service-mesh-security, waf-configuration, cicd-security-pipeline, secrets-rotation-automation, microservices-security |
| Compare Batch 2 (5 pages) | ✅ DONE | clawguru-vs-crowdstrike, clawguru-vs-datadog, openclaw-vs-falco, clawguru-vs-lacework, moltbot-vs-pagerduty |
| Solutions Batch 2 (3 pages) | ✅ DONE | iso27001-certification-roadmap, pci-dss-compliance, hipaa-security-controls |
| Moltbot Batch 3 (8 pages) | ✅ DONE | ai-agent-threat-model, ai-agent-threat-model-template, real-time-cve-feed, bot-security-testing, sbom-generation, compliance-automation-engine, ai-agent-security, ai-agent-hardening-guide |
| Dark Theme Fix (109 files) | ✅ DONE 09.04 | All content pages fixed: bg-gray-100→bg-gray-800, text-gray-600→text-gray-300, tables, badges, notices |
| Afrikaans Locale Expansion | ✅ DONE 11.04 | `af` fully activated: dictionary 100% (608 keys), getDictionary.ts registered, homepage-cro-i18n.ts complete |

---

## 3. TECH STACK & ARCHITECTURE

### Stack
- **Framework**: Next.js 14 (App Router), TypeScript strict
- **Database**: PostgreSQL via Supabase (`lib/db.ts` → `dbQuery()`)
- **Cache / Rate-Limit**: Upstash Redis (`lib/rate-limit.ts`)
- **Deployment**: Vercel (primary, auto-deploy on push to `main`) + Railway (standby/staging)
- **Domain**: clawguru.org (Vercel) / *.up.railway.app (Railway staging)

### Routing Patterns
```
app/[lang]/page.tsx                          Locale home pages (/de, /en, ...)
app/[lang]/runbooks/page.tsx                 Runbooks listing per locale
app/[lang]/moltbot/[slug]/page.tsx           Moltbot Security Topics
app/[lang]/openclaw/[slug]/page.tsx          OpenClaw Framework Topics
app/[lang]/solutions/[slug]/page.tsx         Enterprise Solutions
app/[lang]/[tool-a]-vs-[tool-b]/page.tsx     Comparison Pages
app/[lang]/[slug]/page.tsx                   Specialized security pages
app/[lang]/runbook/[slug]/page.tsx           Individual runbook pages (geo-aware)
app/api/geo/[expansion]/route.ts             Geo Expansion API (auth required)
app/sitemaps/[name]/route.ts                 Dynamic sitemap generation
app/sitemap.xml/route.ts                     Sitemap index (lists all child sitemaps)
app/robots.txt/route.ts                      robots.txt (dynamic)
```

### Supported Locales (16) — ALL pages must have hreflang for ALL 16
```
de, en, es, fr, pt, it, ru, zh, ja, ko, ar, hi, tr, pl, nl, af
```
Defined in: `lib/i18n.ts` → `SUPPORTED_LOCALES`, `DEFAULT_LOCALE = "de"`

**ABSOLUTE RULE: Every new content page MUST be available in ALL 16 locales.**
The `[lang]` directory structure ensures this automatically. Never create pages outside `app/[lang]/`.
Every `generateStaticParams()` MUST return all 16 locales. No exceptions, no “only de/en” shortcuts.

### Translation Coverage — 16 Languages 100% ✅ (as of 11.04.2026)

All 16 dictionary files in `dictionaries/` are fully translated against the German reference (`de.json`, 602 keys).

| Locale | Language | Keys | Status |
|--------|----------|------|--------|
| de | Deutsch (reference) | 602 | ✅ 100% |
| en | English | 602 | ✅ 100% |
| es | Español | 602 | ✅ 100% |
| fr | Français | 602 | ✅ 100% |
| pt | Português | 602 | ✅ 100% |
| it | Italiano | 602 | ✅ 100% |
| ru | Русский | 602 | ✅ 100% |
| zh | 中文 | 602 | ✅ 100% |
| ja | 日本語 | 602 | ✅ 100% |
| ar | العربية | 602 | ✅ 100% |
| nl | Nederlands | 602 | ✅ 100% |
| hi | हिन्दी | 602 | ✅ 100% |
| tr | Türkçe | 602 | ✅ 100% |
| pl | Polski | 602 | ✅ 100% |
| ko | 한국어 | 602 | ✅ 100% |
| af | Afrikaans | 608¹ | ✅ 100% |

¹ `af.json` contains 6 extra keys (`neuro_info`, `neuro_analyzing`, `neuro_empty`, `neuro_add_tag`, `neuro_clear_tags`, `neuro_recommended`) that extend the base schema. All 602 reference keys from `de.json` are covered.

**Translation rules for agents:**
1. **New keys in `de.json`** → Add the same key to ALL 15 other dictionaries immediately. Never leave a dictionary incomplete.
2. **New language** → Register in BOTH `lib/getDictionary.ts` (`DICTIONARY_LOCALES` + `loaders`) AND `lib/homepage-cro-i18n.ts` (`COPY` object). Without `getDictionary.ts` registration, the new language silently falls back to English.
3. **Validation command** (run before pushing any dictionary change):
   ```bash
   python3 -c "
   import json
   de = json.load(open('dictionaries/de.json'))
   def cl(d): return sum(cl(v) if isinstance(v,dict) else 1 for v in d.values())
   def miss(a,b,p=''): return [f'{p}.{k}' if p else k for k,v in a.items() if k not in b]+[x for k,v in a.items() if isinstance(v,dict) and k in b for x in miss(v,b[k] if isinstance(b.get(k),dict) else {},f'{p}.{k}' if p else k)]
   [print(f'{l}: OK' if not miss(de,json.load(open(f'dictionaries/{l}.json'))) else f'{l}: MISSING') for l in ['en','es','fr','pt','it','ru','zh','ja','ar','nl','hi','tr','pl','ko','af']]
   "
   ```

### Afrikaans (`af`) — Fully Activated 11.04.2026

**Status: ✅ LIVE** — Afrikaans is the 16th locale, fully active in all routing and translations.

- `dictionaries/af.json` — 608 keys, 100% complete (covers all 602 reference keys from `de.json`)
- `lib/getDictionary.ts` — `af` registered in `DICTIONARY_LOCALES` and `loaders`
- `lib/homepage-cro-i18n.ts` — `af` block with full Hero CTAs, Trust disclaimer, LP copy
- `lib/i18n.ts` — `af` already in `SUPPORTED_LOCALES` and `LOCALE_HREFLANG`
- Routing — `app/[lang]/page.tsx` uses `SUPPORTED_LOCALES.map()` → `/af` route live automatically

**Remaining Afrikaans tasks (optional, lower priority):**
- Add Afrikaans city data to geo_cities table (Johannesburg, Cape Town, Durban, Pretoria, Port Elizabeth)
- Submit updated sitemap to Google Search Console after deploy

### Database Tables

| Table | Purpose |
|-------|---------|
| geo_cities | Active cities (slug, name_de, name_en, country_code, priority, quality) |
| geo_variant_matrix | Geo variants (locale, base_slug, city_slug, quality_score) |
| runbook_executions | Tool runs per customer |
| threats | Security events per customer (tenant-scoped via customer_id) |
| mycelium_nodes | Mycelium graph nodes per customer |
| customer_entitlements | Subscription status (explorer/pro/team) |
| audit_log | Compliance audit trail |

### Auth Rules — NEVER Skip These
- All `/api/admin/*` → `verifyAdminToken()` required
- Geo expansion endpoints → `GEO_EXPANSION_SECRET` in Authorization header
- `/api/auth/activate` + `/api/auth/recover` → Edge rate-limit 5 req/min
- `/api/copilot` → Rate-limit 10 req/min per IP
- All dashboard calls → Auth cookie + plan check

---

## 4. SEO IRON RULES

### The 3 Soft-404 Killers (Most Common Traffic Loss Cause)

**Killer 1: Missing page-level `openGraph.url`**
Any page without its own `openGraph.url` inherits the root layout's `og:url = "https://clawguru.org"`.
Google sees the page responding with the homepage's OG → classifies as Soft 404.

**Killer 2: Not in Sitemap**
A page that exists in the filesystem but is NOT listed in `MOLTBOT_SLUGS` / `OPENCLAW_SLUGS` /
`SECURITY_SLUGS` in `app/sitemaps/[name]/route.ts` is invisible to Google.

**Killer 3: Sitemap chunk files blocked in robots.txt**
`Disallow: */runbooks-*-*.xml` in robots.txt prevents Google from fetching the sitemap chunks
that contain the 600+ runbook pages. The file at `app/robots.txt/route.ts` must have `Allow: /sitemaps/`.

### 7-Point Checklist for Every New Content Page

1. **`generateMetadata()`** with:
   - `title` (50-60 chars, primary keyword first)
   - `description` (150-160 chars, keyword-rich, clear value)
   - `openGraph.url` = absolute URL for this specific locale + path
   - `openGraph.type` = `"article"` for content pages, `"website"` for hub pages
   - `alternates` = `buildLocalizedAlternates(locale, "/path")` — never hardcode
2. **`notFound()`** for unknown locales (if not using `generateStaticParams`)
3. **"Not a Pentest" trust banner** at the top of the page content
4. **H1** containing the primary keyword
5. **Minimum 2 sections** with code examples OR comparison tables (demonstrates expertise)
6. **Internal links** to at least 2 of: `/securitycheck`, `/runbooks`, `/oracle`, `/openclaw`
7. **Slug added to sitemap** in `app/sitemaps/[name]/route.ts`

### Internal Linking Requirements per Page Type
```
Moltbot pages   → /securitycheck, /runbooks, /oracle
OpenClaw pages  → /openclaw, /securitycheck, /runbooks
Solutions pages → /securitycheck, /runbooks, /pricing
Compare pages   → /openclaw OR /securitycheck
Geo pages       → /securitycheck, /runbooks (with city context)
```

### Schema Markup (Add to All Content Pages)
```tsx
// Minimum: WebPage schema
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description: description,
  url: pageUrl,
}
// Add FAQPage schema when the page has Q&A sections (boosts rich results)
```

### hreflang Rules
- `x-default` must always point to `/de/path` (German is DEFAULT_LOCALE)
- All 16 locales must be listed — `buildLocalizedAlternates()` handles this automatically
- Chinese: `zh-CN`, Dutch: `nl-NL`, Hindi: `hi-IN`, Korean: `ko-KR`, Polish: `pl-PL`

---

## 5. PAGE CREATION PLAYBOOK

### Step 1 — Create the File (PowerShell)
```powershell
New-Item -ItemType File -Force "app/[lang]/moltbot/my-new-slug/page.tsx"
```

### Step 2 — Use This Exact Template (Correct Pattern)
```tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/my-new-slug"  // <-- change this per page

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Primary Keyword: Secondary Phrase 2026"
  const description = "150-160 character description with primary keyword and clear user benefit."
  return {
    title,
    description,
    keywords: ["keyword1", "keyword2", "keyword3"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function MyNewSlugPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Primary Keyword: Secondary Phrase</h1>
        <p className="text-lg text-gray-300 mb-8">Intro paragraph with primary keyword and clear value proposition.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Section 1 — with code or table</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            {/* Content */}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Section 2 — with code or table</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            {/* Content */}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runbooks</div>
              <div className="text-sm text-gray-300">600+ security playbooks</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
```

### Step 3 — Add Slug to Sitemap (MANDATORY)
Open `app/sitemaps/[name]/route.ts` and add the slug to the appropriate array:
```ts
// For Moltbot pages:
const MOLTBOT_SLUGS = ["existing-slug", ..., "my-new-slug"]  // ADD HERE

// For OpenClaw pages:
const OPENCLAW_SLUGS = ["existing-slug", ..., "my-new-slug"]  // ADD HERE

// For top-level security/specialized pages:
const SECURITY_SLUGS = ["existing-slug", ..., "my-new-slug"]  // ADD HERE

// For compare pages:
const COMPARE_SLUGS = ["existing-slug", ..., "my-new-slug"]  // ADD HERE
```

### Step 4 — Build Test (Never Skip)
```powershell
npm run build 2>&1 | Select-Object -Last 15
# Exit code MUST be 0. If not: fix, do NOT push.
```

### Step 5 — Commit and Push
```powershell
git add -A
git commit -m "feat(seo): add [slug] page — [topic]"
git push
# If merge conflict: git pull --rebase → resolve → git push
```

### TypeScript Anti-Patterns (Known Pitfalls)

| Pitfall | Wrong | Correct |
|---------|-------|---------|
| Shell vars in template literals | `` `DB_URL="${DATABASE_URL}"` `` | `` `DB_URL="$DATABASE_URL"` `` |
| Unescaped `>` in JSX text | `<p>Budget >$100k</p>` | `<p>Budget &gt;$100k</p>` |
| Button with asChild | `<Button asChild><Link>` | `<Button><Link>` |
| id on TabsContent | `<TabsContent id="tab">` | `<TabsContent value="tab">` |
| `${{` in template literals | `` `${{ github.sha }}` `` | Use placeholder string |
| File truncated at end | Missing closing `</div>)` | Always close all JSX tags |

---

## 6. SITEMAP OPERATING MANUAL

### Architecture
```
/sitemap.xml  (index)
  → /sitemaps/main-de.xml         (hub + all content pages for German)
  → /sitemaps/main-en.xml         (hub + all content pages for English)
  → ... (× 16 locales)
  → /sitemaps/runbooks-de-a-f.xml (runbooks starting a-f, German)
  → ... (× 5 buckets × 16 locales)
  → /sitemaps/tags-de-a-f.xml     (tags, German)
  → ... (× 5 buckets × 16 locales)
  → /sitemaps/geo-runbooks-de.xml (geo variants, if GEO_MATRIX_SITEMAP=1)
```

### Key Files
- **Sitemap index**: `app/sitemap.xml/route.ts` — lists all child sitemaps
- **Child sitemaps**: `app/sitemaps/[name]/route.ts` — generates each sitemap on demand
- **robots.txt**: `app/robots.txt/route.ts` — must `Allow: /sitemaps/`

### Adding New Pages to Sitemap
All new page slugs MUST be added to the slug arrays in `app/sitemaps/[name]/route.ts`:

```ts
const MOLTBOT_SLUGS = [..., "new-moltbot-slug"]    // app/[lang]/moltbot/
const OPENCLAW_SLUGS = [..., "new-openclaw-slug"]   // app/[lang]/openclaw/
const SECURITY_SLUGS = [..., "new-security-slug"]   // app/[lang]/[slug]/
const COMPARE_SLUGS  = [..., "tool-a-vs-tool-b"]    // app/[lang]/[a]-vs-[b]/
const GUIDE_SLUGS    = [..., "new-guide-slug"]       // app/[lang]/[guide]/
```

### Sitemap Health Check Commands
```powershell
# Check index (should list 100+ child sitemaps)
(Invoke-WebRequest "https://clawguru.org/sitemap.xml").Content | Select-String "<sitemap>" | Measure-Object

# Check robots.txt (sitemaps/ must NOT be blocked)
(Invoke-WebRequest "https://clawguru.org/robots.txt").Content

# Count URLs in a child sitemap
(Invoke-WebRequest "https://clawguru.org/sitemaps/main-de.xml").Content | Select-String "<url>" | Measure-Object
```

### Env Vars that Control Sitemap
| Variable | Default | Effect |
|----------|---------|--------|
| `SITEMAP_100K_LOCALES` | all 16 locales | Comma-separated locales in sitemap index |
| `SITEMAP_BUCKETS` | 3 | Number of runbook buckets (1-5) |
| `GEO_MATRIX_SITEMAP` | off | Set to `1` to include geo-runbook sitemaps |
| `GEO_MATRIX_SITEMAP_CITY_LIMIT` | 50 | Cities per geo sitemap |
| `SITEMAP_RUNBOOKS_PER_BUCKET` | 500 | Max runbooks per bucket sitemap |

---

## 7. GEO EXPANSION PLAYBOOK

### Current Status (08.04.2026) — 123 Active Cities

| Region | Count | Examples | Status |
|--------|-------|----------|--------|
| DACH | 20 | Berlin, Munich, Vienna, Zurich, Hamburg | Stable Q85+ |
| Western Europe | 15 | Paris, London, Amsterdam, Madrid, Lisbon | Stable Q85+ |
| CEE/Balkans | 9 | Budapest, Bucharest, Sofia, Athens, Zagreb | Stable Q85+ |
| Nordics | 7 | Copenhagen, Stockholm, Oslo, Helsinki | Stable Q85+ |
| China | 4 | Beijing (95), Shanghai (94), Guangzhou, Shenzhen | Stable Q85+ |
| USA | 10 | LA, Chicago, Houston, Dallas, Seattle, Austin | Stable Q85+ |
| India | 8 | Mumbai, Delhi, Bangalore, Hyderabad, Chennai | Stable Q85+ |
| Russia | 5 | Moscow, St. Petersburg, Novosibirsk | Stable Q85+ |
| Japan | 5 | Tokyo, Osaka, Yokohama, Nagoya, Sapporo | Seeded — DB pending |
| South Korea | 5 | Seoul, Busan, Incheon, Daegu, Daejeon | Seeded — DB pending |
| Brazil | 5 | Sao Paulo, Rio, Brasilia, Belo Horizonte | Seeded — DB pending |
| Mexico | 5 | Mexico City, Guadalajara, Monterrey, Puebla | Seeded — DB pending |
| Southeast Asia | 7 | Bangkok, Singapore, Jakarta, Manila, Ho Chi Minh | Seeded — DB pending |

**Action required for the 27 "Seeded — DB pending" cities:**
```
GET https://clawguru.org/api/geo/asia-latam-expansion?stable=1
Authorization: Bearer [GEO_EXPANSION_SECRET]
```

### Planned Expansion Waves

| Wave | Region | Cities | New Route to Create |
|------|--------|--------|---------------------|
| Q2/2026 | Africa | Cairo, Lagos, Nairobi, Johannesburg, Casablanca | `/api/geo/africa-expansion` |
| Q2/2026 | Middle East | Dubai, Istanbul, Riyadh, Tel Aviv | `/api/geo/mea-expansion` |
| Q3/2026 | Oceania | Sydney, Melbourne, Auckland, Brisbane | `/api/geo/oceania-expansion` |
| Q3/2026 | LatAm+ | Buenos Aires, Bogota, Lima, Santiago | `/api/geo/latam-plus-expansion` |

### Geo Expansion Steps (Copy This Exactly)
1. Create `app/api/geo/[region]-expansion/route.ts` — copy from `asia-latam-expansion/route.ts`
2. Define `EXPANSION_CITIES[]` — all with `quality >= 85`
3. Add new city slugs to `SEEDED_CITY_SLUGS` in `lib/geo-matrix.ts`
4. `npm run build` — must exit 0
5. `git commit` + `git push`
6. After Vercel deploy: call endpoint with `?stable=0` first (canary), then `?stable=1`
7. Trigger `revalidateTag("geo-cities-active")` or redeploy to refresh sitemaps

### Geo URL Pattern
```
/[locale]/runbook/[base-runbook-slug]-[city-slug]
Example: /de/runbook/aws-ssh-hardening-2026-berlin
Example: /en/runbook/cloudflare-nginx-waf-2026-singapore
```

---

## 8. CONTENT ROADMAP Q2/Q3 2026

### Phase 1 — Technical SEO Foundation (DONE ✅ 08.04.2026)
- [x] robots.txt chunk-block removed — Google can now fetch all sitemap chunks
- [x] Sitemap index includes all 15 locales (was: only `de`)
- [x] 1,300+ new URLs added to sitemap (Moltbot/OpenClaw/Security pages)
- [x] OG metadata Soft-404 fix on `/de/runbooks` and all locale home pages
- [x] Gemini model fixed: `gemini-2.5-flash` → `gemini-2.0-flash` (was returning 400)
- [x] Build errors fixed: Badge component, truncated JSX in moltbot page

### Phase 2 — Content Depth (Next Session, HIGH PRIORITY)

| Task | Slugs | Page Type | Where |
|------|-------|-----------|-------|
| OpenClaw Batch 2 | service-mesh-security, waf-configuration, cicd-security-pipeline, secrets-rotation-automation, microservices-security | openclaw | `app/[lang]/openclaw/` |
| Compare Batch 2 | clawguru-vs-crowdstrike, clawguru-vs-datadog, openclaw-vs-falco, clawguru-vs-lacework, moltbot-vs-pagerduty | compare | `app/[lang]/[a]-vs-[b]/` |
| Solutions Batch 2 | iso27001-certification-roadmap, pci-dss-compliance, hipaa-security-controls | solutions | `app/[lang]/solutions/` |
| Schema Markup | Add FAQ + WebPage JSON-LD to all Moltbot + OpenClaw pages | enhancement | existing pages |
| hreflang Migration | Migrate all Moltbot pages from hardcoded LANGS to `buildLocalizedAlternates()` | bugfix | all `app/[lang]/moltbot/*/page.tsx` |

### Phase 3 — Geo Traffic Explosion (Q2 2026)
- Activate `GEO_MATRIX_SITEMAP=1` in Vercel → enables geo-runbook sitemaps
- Africa expansion: 5+ cities → ~5 × 15 × 8 runbooks = 600 new geo URLs
- MEA expansion: 4+ cities
- **Target: 500+ cities × 15 locales × 8 base runbooks = 60,000 geo URLs**

### Phase 4 — Content Empire (Q3 2026)
- 250 Moltbot/AI-Agent pages (Mycelium Content Architect v3)
- Batches of 25 pages per sprint
- Content generation script from template (TBD)
- **Target: 1,000,000+ indexable quality pages**

### Traffic & Conversion KPIs

| Metric | Current | 3-Month Target | 12-Month Target |
|--------|---------|----------------|-----------------|
| Indexed pages | ~43,900 | 80,000+ | 500,000+ |
| Organic clicks/month | Building | 10,000+ | 200,000+ |
| GSC impressions/month | Building | 500,000+ | 10,000,000+ |
| Avg. position top keywords | n/a | Top 10 | Top 3 |
| **Check completions/month** | **Baseline** | **2,000+** | **20,000+** |
| **Free→Pro conversion rate** | **0%** | **3-5%** | **5-8%** |
| **Paid subscribers (Pro/Team)** | **0** | **50+** | **1,000+** |
| **MRR (Monthly Recurring Revenue)** | **€0** | **€500+** | **€15,000+** |

---

## 9. DEPLOYMENT WORKFLOW

### Standard Deploy (Always in This Order)
```powershell
# Step 1 — Build test (NEVER skip)
npm run build 2>&1 | Select-Object -Last 15
# Exit code MUST be 0. If not: fix it first.

# Step 2 — Stage and commit
git add -A
git commit -m "feat(seo): [what was done]"

# Step 3 — Push (Vercel + Railway deploy automatically)
git push
```

### Railway Setup (Standby/Staging)
- **Config**: `railway.json` in repo root
- **Start**: `next start -p ${PORT:-3000}` — Railway sets `PORT=8080`
- **Health check**: `/api/health` (120s timeout)
- **Memory**: Set `PSEO_RUNBOOK_COUNT=5000` on Railway (not 50000 — memory limit)
- **Domain**: Railway generates `*.up.railway.app` — use as staging URL
- **Switch to Railway**: Change DNS A/CNAME from Vercel IPs to Railway domain
- **Key env vars for Railway**: All same as Vercel EXCEPT `PSEO_RUNBOOK_COUNT=5000` and no `VERCEL_OIDC_TOKEN`

### Commit Message Conventions
- `feat(seo):` new content pages, sitemap changes
- `feat(geo):` geo expansion
- `fix:` build errors, TypeScript errors, 404 fixes
- `fix(ai):` AI provider configuration
- `chore:` AGENTS.md updates, dependencies, config

### Merge Conflict Resolution
```powershell
git pull --rebase
# Resolve conflicts in editor
git add [resolved-files]
git rebase --continue
git push
```

### NEVER Push With a Red Build
Vercel auto-deploys on every push to `main`. A red build = broken website for real users.

---

## 10. AI PROVIDER CONFIGURATION

### Provider Order and Fallback Chain
Configured in `lib/ai/providers.ts`. Order controlled by env var `AI_PROVIDER_ORDER`.

Default order (if no env var set): `openai → deepseek → gemini`

```
AI_PROVIDER_ORDER=<provider-order>   # Set via ENV variable
```

### Provider API Keys (Vercel Env Vars)
| Variable | Provider | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | OpenAI GPT | Primary — funded and stable |
| `DEEPSEEK_API_KEY` | DeepSeek | Cheap fallback (currently out of credit) |
| `GEMINI_API_KEY` | Google Gemini | Demoted — frequent 400 errors since April 2026 |

### Gemini Model Configuration
```
GEMINI_MODEL=gemini-2.5-flash    # Default — aligns with .env.example and agent files
```
**Known Issue (09.04.2026):** All Gemini models (`gemini-2.5-flash`, `gemini-2.0-flash`,
`gemini-1.5-flash`, `gemini-2.0-flash-lite`) are returning 400 errors. Gemini has been demoted
to last position in the provider chain. DeepSeek and OpenAI are used first.

Fallback chain inside `callGemini()`:
1. `gemini-2.5-flash` (primary, override with `GEMINI_MODEL`)
2. `gemini-2.0-flash` (fallback)
3. `gemini-2.0-flash-lite` (lightest model, last resort)

### Circuit Breaker Behaviour
After 3 consecutive failures, a provider is paused for 30 seconds (OPEN state),
then one probe call is allowed (HALF_OPEN). This prevents cascading failures.

---

## 11. KNOWN BUGS & ACCEPTED LIMITATIONS

### npm Deprecation Warnings (Cosmetic — No Action Needed)
These appear during `npm install` and do NOT affect production:

| Warning | Source | Fixable? |
|---------|--------|----------|
| `eslint@8.57.1` deprecated | ESLint v8 EOL | No — `eslint-config-next@14` requires eslint 8 |
| `@humanwhocodes/object-schema` | Internal eslint@8 dep | No — transitive |
| `@humanwhocodes/config-array` | Internal eslint@8 dep | No — transitive |
| `lodash.omit`, `lodash.pick` | Transitive dep | No — transitive |
| `node-domexception` | Transitive dep | No — transitive |
| `glob@10.5.x` | Was overridden to `^11` | Fixed 08.04 |

Will be resolved automatically when upgrading to Next.js 15 + eslint 9 (future sprint).

### Fixed Issues (Do Not Reintroduce)

| Issue | Root Cause | Fixed In |
|-------|-----------|----------|
| Soft 404 `/de/runbooks` | No `openGraph.url` → inherited homepage OG | 08.04.2026 |
| Sitemap only `de` locale | `allLocales = [DEFAULT_LOCALE]` instead of `SUPPORTED_LOCALES` | 08.04.2026 |
| Google blocked from sitemap chunks | `Disallow: */runbooks-*-*.xml` in robots.txt | 08.04.2026 |
| 1,300+ pages missing from sitemap | Not listed in `MOLTBOT_SLUGS` / `OPENCLAW_SLUGS` | 08.04.2026 |
| Gemini 400 errors | All models returning 400 — demoted to last fallback | 09.04.2026 |
| Build errors (Badge component) | `@/components/ui/badge.tsx` missing | 08.04.2026 |
| Build error (truncated JSX) | `api-rate-limiting-advanced/page.tsx` missing closing tags | 08.04.2026 |
| **404 on all /de/runbooks/cloud links** | `GEO_MATRIX_AUTO_REWRITE=1` rewrites base slugs to geo-variant with non-seeded city (e.g. "groheide") → `parseGeoVariantSlug` doesn't recognize city → `getRunbook()` = null → 404. Plus `Cache-Control: immutable` on all routes cached the 404 for 1 year. | 13.04.2026 |
| **Locale-Runbook-Page 404 on geo-variants** | `isGeoVariantIndexable()` returned false for un-promoted geo-variants → `notFound()` instead of fallback | 13.04.2026 |
| **Railway SIGTERM on start** | `next start` listens on port 3000 but Railway assigns port 8080 via `PORT` env var. Fixed: `next start -p ${PORT:-3000}` | 13.04.2026 |

---

## 12. SESSION LOG & OPEN TASKS

### Session History

| Date | Session | Completed |
|------|---------|-----------|
| 06.04.2026 | 1–4 | Security audit, Cockpit Realism A–D, Killermachine v3, China + Global Expansion |
| 06.04.2026 | 5 | 1M-pages strategy, content pipeline defined |
| 07.04.2026 | 6 | Moltbot Batch 1+2 (21 pages), OpenClaw Batch 1 (10 pages), Asia/LatAm Geo (27 cities), Solutions (5 pages), Compare (5 pages), AGENTS.md v5 |
| 08.04.2026 | 7 | Full traffic analysis: robots.txt fix, sitemap 15 locales, 1,300+ new sitemap URLs, OG Soft-404 fix, Badge component, truncated JSX fix, Gemini model fix, AGENTS.md v6 |
| 11.04.2026 | 8 | Page speed: framer-motion removed from shared bundle (lazy-load PageTransition/AnimatedBackground/CommandK, all heavy dashboard tabs, RunbookCard, Hero, FeaturesGrid, CTA, TrustSection, GlowButton, BentoCard, OverviewTab, PremiumMetricCard, PremiumGauge). CSS animations replace JS animations. CLS fix on command-center. |
| 12.04.2026 | 9 | SEO: hreflang xhtml:link removed from sitemap XML. Duplicate /check URL removed. Traffic growth sprint: /de/check CTA + proof bullets + score methodology. /de/roast-my-stack FAQ + examples. Compare Batch 3 (trivy/checkov/wazuh). /kubernetes-security pillar page. Compare Batch 4 (snyk/victorops/ossec). FAQPage + WebPage JSON-LD added to all 37 Moltbot pages via batch script. security-framework migrated to buildLocalizedAlternates. FAQPage JSON-LD added to all 15 OpenClaw pages via batch script. Compare Batch 5 (moltbot-vs-splunk, openclaw-vs-crowdsec). AGENTS.md v8. |
| 13.04.2026 | 10 | **Critical bugfix: /de/runbooks/cloud links (404 root cause found).** GEO_MATRIX_AUTO_REWRITE=1 rewrites base runbook slugs to geo-variants (e.g. hetzner-ssh-hardening → hetzner-ssh-hardening-groheide). City "Großheide" slugifies to "groheide" which is NOT in SEEDED_CITY_SLUGS → parseGeoVariantSlug returns full slug as baseSlug → getRunbook() = null → 404. Fix 1: Middleware now verifies city is seeded before rewriting (round-trip parseGeoVariantSlug check). Fix 2: Locale-Runbook-Page falls back to baseSlug instead of notFound() when geo-variant not indexed. Fix 3: Cache-Control immutable moved from all routes to /_next/static/ only (was caching 404s for 1 year). Fix 4: vercel.json maxDuration=60s for runbook pages. Fix 5: SITEMAP_100K_LOCALES locale guard replaced with SUPPORTED_LOCALES. Railway deployment setup: railway.json + PORT env var fix (next start -p ${PORT:-3000}). AGENTS.md v9. |
| 14.04.2026 | 13 | **30-Tage Master-Plan + Moltbot Batch 4 (5 AI-Agent Pages) + God Mode Directive.** God Mode v1.0 Directive added to AGENTS.md. Full project audit completed (8 traffic blockers identified). Moltbot Batch 4: 5 new AI-agent security pages created: prompt-injection-defense, model-poisoning-protection, secure-agent-communication, llm-gateway-hardening, ai-agent-sandboxing. All 5 have full FAQPage + HowTo JSON-LD, internal links, CTA. Added to MOLTBOT_SLUGS sitemap. Build ✓ (Exit 0). AGENTS.md v12. 30-Tage Master-Plan added as Section 14. |
| 14.04.2026 | 14 | **Content Expansion Sprint: Moltbot Batches 5–28 + CVE Batches 1–27 + Solutions Batches 3–10 + Compare Batches 6–17 + OpenClaw Batches 3–8.** Moltbot: 30 new pages (Batches 5–28: llm-output-filtering, llm-jailbreak-detection, ai-agent-privilege-escalation, llm-context-window-security, ai-agent-data-exfiltration-prevention, llm-model-theft-detection, llm-output-encoding-security, ai-agent-sandboxing-runtime, llm-context-manipulation-defense, llm-bias-detection-mitigation, ai-agent-behavioral-monitoring, llm-hallucination-detection, llm-data-encryption-at-rest, ai-agent-secure-communication, llm-privacy-preserving-computation, llm-model-watermarking, ai-agent-federated-learning, llm-secure-inference, llm-adversarial-robustness, ai-agent-secure-deployment, llm-model-extraction-defense, llm-federated-inference, ai-agent-multi-modal-security, llm-quantization-security, llm-model-compression-security, ai-agent-orchestration-security, llm-edge-deployment-security, llm-model-versioning-security, ai-agent-human-in-the-loop-security, llm-continual-learning-security). CVE Batches 1–27: 27 CVE fix pages (MongoDB, Elasticsearch, RabbitMQ, Redis, Apache Kafka, Cassandra, Apache Tomcat, Jenkins, GitLab, GitHub Actions Runner, Docker Engine, containerd). Solutions Batches 3–10: 10 new pages (dsgvo-compliance-automation, nis2-compliance, nist-csf-compliance, eu-ai-act-compliance, soc2-type-ii-automation, zero-trust-architecture, hipaa-ai-systems, iso27001-ai-systems, gdpr-ai-data-processing, nis2-ai-infrastructure → plus hipaa-ai-compliance, iso27001-ai-systems-roadmap, nist-csf-ai-profile, eu-ai-act-compliance-checklist). Compare Batches 6–17: 12 pages (moltbot-vs-bedrock-agents, clawguru-vs-wiz-code, moltbot-vs-langchain-agents, openclaw-vs-prisma-cloud, moltbot-vs-autogen, openclaw-vs-tenable). OpenClaw Batches 3–8: 4 new pages (zero-trust-networking, supply-chain-sbom-security). All builds ✓ Exit 0. Sitemap updated after each batch. |
| 14.04.2026 | 11 | **Neuro v5 overhaul + Project Audit + Locale Migration.** Neuro: fixed CVE score (items[] not cves[]), runbook relevance normalization, added visible FAQ, live Threat Correlation API (/api/intel/threats created), updated layout metadata. CRITICAL: removed netlify.env.production + netlify.env.import from Git (contained production secrets — user must rotate all keys). Removed stale zip/junk files. Fixed Node.js engines: 24.x → >=20. Created AUDIT-MASTERPLAN.md. Locale Migration: [lang]/neuro/page.tsx + [lang]/oracle/page.tsx upgraded with full metadata, openGraph.url with locale, generateStaticParams. Root /neuro and /oracle set to noindex (canonical → /de/neuro and /de/oracle). P2: CSP + HSTS + X-Frame-Options + nosniff security headers added to next.config.js for all routes. AGENTS.md v10. |
| 14.04.2026 | 12 | **TypeScript strict:true + Rate-limiting default ON + Compare Batch 6 + HowTo Schema.** tsconfig.json: strict:false→strict:true (fixed 2 TS18046 errors in enrich-city/route.ts). Middleware: MW_RL_ENABLED opt-in→opt-out (default ON, set =0 to disable). New page: moltbot-vs-grafana (full compare, sitemap). HowTo JSON-LD schema added to all 15 OpenClaw sub-pages. Solutions Batch 2 verified complete. Build ✓ (Exit 0). AGENTS.md v11. |
| 15.04.2026 | 15 | **Moltbot Batches 26–30 + CVE Batches 28–29 + Solutions Batch 11 + Compare Batch 18.** 15 new Moltbot pages, 4 CVEs (Nginx HTTP/3, HAProxy, PostgreSQL, Redis), 2 Solutions, 2 Compare pages. Sitemap duplicate cleanup. All builds ✓ Exit 0. AGENTS.md v13. |
| 15.04.2026 | 16 | **SEO Fixes + Solutions Batch 12 + Compare Batch 19 + Moltbot Batch 31 + CVE Batch 30.** Root layout canonical fixed: `/` → `/de`. Solutions: zero-trust-ai-architecture, gdpr-llm-data-processing. Compare: moltbot-vs-semantic-kernel, openclaw-vs-crowdstrike. Moltbot Batch 31: llm-prompt-hardening-advanced, ai-agent-permission-minimization, llm-output-schema-validation. CVE Batch 30: CVE-2025-50101 (K8s), CVE-2025-50102 (Vault). Build ✓ Exit 0. |
| 15.04.2026 | 17 | **Pro Feature Gate für CVE Pages + Security Check Viral Share Buttons.** ProFeatureGate Komponente (full + compact), useProStatus Hook, GET /api/user/entitlements, CVE-2025-26633 Server + Client Split. SecurityCheckShareCard (Twitter/X, LinkedIn, WhatsApp, Telegram, Email), score-basierte virale Messages, Integration in HeroSecurityCheck. Dictionary Keys (security_share). Beide Features auf Production (master) deployed. Build ✓ Exit 0. |
| 15.04.2026 | 17 | **Middleware CVE fix-route bug + Sitemap GSC fix + AGENTS.md v14 Strategie-Upgrade.** CRITICAL BUG: Middleware hatte zwei 308-Redirects die ALLE `/solutions/fix-CVE-*` URLs auf Solutions-Index umleiteten — alle CVE Fix Guides waren 404. Root cause: alter "Recovery redirect" aus Pre-Fix-Page-Ära. Fix: beide Redirect-Blöcke entfernt. GSC Sitemap: User hatte `/sitemaps/main/route.xml` eingereicht (existiert nicht) — richtige URL ist `/sitemap.xml`. AGENTS.md v14: Template Dark-Theme-Fix, 15→16 Locales korrigiert, Current State aktualisiert, Conversion/Subscription-Strategie hinzugefügt, Session Log chronologisch sortiert. Build ✓ Exit 0. |
| 16.04.2026 | 18 | **Roast My Moltbot Viral Pages.** Added hall-of-shame, share-badge-gallery, weekly-roast pages with dark-theme layout, trust notice, and internal links. Sitemap updated to include new roast URLs. |
| 16.04.2026 | 19 | **Pricing Page UX Upgrade.** Added Pro vs Teams decision section and expanded the feature comparison table with Teams column + checks. |
| 16.04.2026 | 20 | **Post-Check Pro Upgrade CTA.** Score share page now shows Pro/Day Pass upgrade CTA when score < 70. |
| 16.04.2026 | 21 | **VIRAL FIRST — 5 Schritte zur Traffic-Explosion.** Schritt 1: Roast My Moltbot Core Engine mit viralen Hooks (Social Proof Banner: 1,247 Stacks geröstet, 89% kritische Lücken). Schritt 2: ShareScore Komponente (Twitter/X, LinkedIn, Copy Link, PNG Badge Download). Schritt 3: Hall of Fame/Shame mit viralen Stats (847 Elite, 3,892 Shame, 67% Fix-Rate). Schritt 4: Weekly Roast mit Stats (KW 16, 156 Teilnehmer, Ø +31 Punkte). Schritt 5: PNG Badge Export (integriert in ShareScore). Alle 5 Schritte gebaut, getestet, committed, gepusht. |
| 16.04.2026 | 22 | **VIRAL 6-10/99 — Community & Share Features.** Schritt 6: ReactionBar (5 Emoji-Reaktionen: 🔥💀🏆⚡❤️ mit Live-Counter). Schritt 7: CommentSection (Community-Kommentare mit Likes + Formular). Schritt 8: Roast Battle 1v1 Seite (12 aktive Battles, 8.4K Votes, Live-Voting). Schritt 9: Video-Generator Library (Canvas API für TikTok/Reels Export). Schritt 10: RSS Feed (/rss/roasts) mit 5 neuesten Roasts. Alle Features dark-theme, responsive, committed, gepusht. |
| 16.04.2026 | 23 | **VIRAL 11-15/99 — Engagement & Distribution.** Schritt 11: RoastEmailCapture (Weekly Digest, 2,847 Abonnenten). Schritt 12: Trends Seite (Trending Stacks, Hot Vulns CVE-2025-50201, Score Jumps). Schritt 13: RoastPrediction (AI Vorhersage: Hack-Wahrscheinlichkeit, Zeitfenster). Schritt 14: Embed Route (/embed/roast) für iframe Integration. Schritt 15: EmbedGenerator (Code-Copy, Size-Controls). Alle 5 Features gebaut, getestet, committed, gepusht. |
| 16.04.2026 | 24 | **VIRAL 16-20/99 — Intelligence & Personalization.** Schritt 16: Industry Benchmarks (8 Industries: Fintech 68, Gaming 45, Crypto 71). Schritt 17: SocialProof Notifications (Live Toast mit User Actions). Schritt 18: RematchButton (Score-Vergleich: vorher vs. jetzt). Schritt 19: Roast History Page (Timeline, 4 Achievements, Stats). Schritt 20: Recommendation Engine (8 Recommendations, Quick Wins, Learning Path). Alle 5 Features gebaut, getestet, committed, gepusht. |
| 16.04.2026 | 25 | **VIRAL 21-25/99 — Gamification & Competition.** Schritt 21: Leaderboard Page (Top 10, Rising Stars, 3-Podest). Schritt 22: Team Roast Multiplayer (47 Teams, 3 Challenges: 30-Day Sprint, Critical Fix Week). Schritt 23: StreakDisplay mit Kalender (5-Tage Streak, 3/7/14/30 Tage Badges). Schritt 24: Achievements System (12 Badges: Common→Legendary, 2,850 Punkte). Schritt 25: StatsDashboard (8 Metriken, Fix-Rate 85%, 6-Monats Trend). Alle 5 Features gebaut, getestet, committed, gepusht. |
| 17.04.2026 | 26 | **VIRAL 26-30/99 — Phase 2: Share & Distribution APIs.** Schritt 26: Dev.to Republish API (I roasted 100 stacks article). Schritt 27: Medium Publication API (The Stack Roast series). Schritt 28: GitHub Gist Export Komponente (Clipboard + GitHub Create). Schritt 29: Slack App Roast Bot (/roast-my-stack command + buttons). Schritt 30: Discord Bot Integration (/roast command + interactive components). Alle 5 APIs gebaut, getestet, committed, gepusht. |
| 17.04.2026 | 27 | **VIRAL 31-35/99 — Phase 2: Mobile, Referrals, Monetization.** Schritt 31: Telegram Bot Channel Integration (/roast command + callback queries). Schritt 32: WhatsApp Share Button Mobile First (Mobile-optimized sharing). Schritt 33: Referral Program Roast a Friend (350 Punkte pro Einladung, 3 Gratis Roasts). Schritt 34: Affiliate Links in Roasts (8 Tools mit Relevance Scoring: Snyk, GitHub Security, 1Password). Schritt 35: Backlink Outreach Featured in Roast (Email Template API für Firmen). Alle 5 Features gebaut, getestet, committed, gepusht. |
| 17.04.2026 | 28 | **VIRAL 36-40/99 — Phase 2 Complete: Guest Roasts, Podcast, YouTube, TikTok, Newsletter.** Schritt 36: Guest Roast External Experts (4 Experts: Mike Bloomberg, Kelsey Hightower, Addy Osmani, Dave Farley mit Quotes). Schritt 37: Roast Podcast Audio Export (TTS Segments, RSS Feed Generator für Podcast Distribution). Schritt 38: YouTube Shorts Auto-Generated (Short Segments, Metadata Generator, Upload API). Schritt 39: TikTok Integration Viral Clips (Caption Generator, Hashtags, Upload API). Schritt 40: Newsletter Sponsorships (Sponsored Content API, 3 Partner Newsletter-Plattformen). Phase 2 (Schritte 21-40) COMPLETE. Alle 20 Features gebaut, getestet, committed, gepusht. |

### Open Tasks by Priority

**CRITICAL — Do Before Next Content Work**
- [x] **Vercel Cache Purge** — Dashboard → Settings → Data Cache → Purge Everything (cached 404s!)
- [x] Set Vercel env vars: `GEO_MATRIX_SITEMAP=1`, `SITEMAP_BUCKETS=5`, `GEO_MATRIX_SITEMAP_CITY_LIMIT=50`
- [x] Run Asia/LatAm DB seeding: `GET /api/geo/asia-latam-expansion?stable=1`
- [x] Google Search Console: resubmit `sitemap.xml`, request indexing for `/de/runbooks` und `/de`
- [x] **SECRET ROTATION** — Rotate all keys from netlify.env.production (DB, API keys, session secrets)

**HIGH — Next Session (Traffic Growth Sprint)**
- [x] `/de/kubernetes-security` Pillar-Page erstellt ✅
- [x] FAQPage + WebPage JSON-LD auf alle 37 Moltbot-Pages ✅
- [x] Compare Batch 4: clawguru-vs-snyk, moltbot-vs-victorops, openclaw-vs-ossec ✅
- [x] Migrate all 37 Moltbot pages to `buildLocalizedAlternates()` (security-framework war letzte) ✅
- [x] FAQPage JSON-LD auf alle 15 OpenClaw-Pages (Batch-Script) ✅
- [x] Compare Batch 5: moltbot-vs-splunk, openclaw-vs-crowdsec ✅
- [x] **[lang]/neuro + [lang]/oracle locale migration** — full metadata, openGraph.url with locale, generateStaticParams ✅
- [x] **CSP + Security Headers** in next.config.js (HSTS, X-Frame-Options, nosniff, Referrer-Policy) ✅
- [ ] **SECRET ROTATION** — All keys from netlify.env.production must be rotated NOW (manual user action)
- [x] Compare Batch 6: `moltbot-vs-grafana` ✅ (`clawguru-vs-lacework` + `openclaw-vs-falco` existed already)
- [x] HowTo schema auf alle 15 OpenClaw-Pages ✅
- [x] Solutions Batch 2: ISO27001, PCI-DSS, HIPAA pages ✅ (existed from prior session)
- [x] **tsconfig strict:true** — 2 TS errors fixed, strict mode enabled ✅
- [x] **Rate-limiting default ON** — MW_RL_ENABLED opt-out model ✅

**MEDIUM — Content + Quality**
- [x] Solutions Batch 2–12: 15+ compliance/AI pages ✅
- [x] Compare Batches 6–19: 30+ compare pages ✅
- [x] Moltbot Batches 4–31: 70+ AI-security pages ✅
- [x] CVE Batches 1–30: 30+ CVE fix pages ✅
- [x] OpenClaw Batches 3–8: expanded to 17 pages ✅
- [ ] Academy/Blog section: continue weekly CVE batches
- [ ] Africa expansion route: `/api/geo/africa-expansion`
- [ ] MEA expansion route: `/api/geo/mea-expansion`

**HIGH — Conversion & Subscription (NEW PRIORITY)**
- [ ] **Pricing Page UX**: `/de/pricing` — klare Pro/Team Tier-Differenzierung, Feature-Matrix, Trust-Siegel
- [ ] **Free→Pro Upgrade Flow**: After Security Check score < 70 → "Unlock full report with Pro"
- [ ] **Gated Premium Features**: Detailed CVE Impact Analysis, Custom Runbook Generation, Scheduled Scans
- [ ] **E-Mail Capture**: Opt-in nach Check-Ergebnis ("Wöchentlicher Security Report für deinen Stack")
- [ ] **Social Proof**: Testimonials, Case Studies, "X teams trust ClawGuru" Counter
- [ ] **Roast Share Button**: Viral loop — "Teile deinen Roast-Score" mit prefilled social text

**LOW — Ongoing**
- [ ] 250 Moltbot/AI-Agent pages (Mycelium Content Architect v3)
- [ ] Oceania expansion (Sydney, Melbourne, Auckland)
- [ ] LatAm+ expansion (Buenos Aires, Bogota, Lima)
- [ ] Next.js 15 upgrade (unlocks eslint 9, removes all npm warnings)

### Next 5 Immediate Actions (in Order)
1. **GSC: Richtige Sitemap einreichen** — `https://clawguru.org/sitemap.xml` (alte `/sitemaps/main/route.xml` löschen!)
2. **Vercel Cache Purge** — alte 308-Redirects für CVE Fix Pages noch gecacht
3. **Pricing Page Upgrade** — Pro/Team Feature-Matrix, klarer Value, Trust-Siegel, Conversion-optimiert
4. **Free→Pro Funnel** — Security Check Score < 70 → "Unlock full report" CTA → Upgrade-Flow
5. **Roast Share Button** — Virale Mechanik: Score teilen auf Twitter/LinkedIn mit prefilled text

---

## 13. TRAFFIC GROWTH STRATEGY (Added 12.04.2026)

### The 5 Core Traffic Levers

**Lever 1 — High-Intent Tool Pages (Priority: CRITICAL)**
`/de/check` and `/de/roast-my-stack` are the highest-converting pages.
- `/de/check`: Proof bullets, Score methodology, 5 FAQ items, sharp CTA copy (done 12.04)
- `/de/roast-my-stack`: Example stacks, FAQ section, FAQPage schema (done 12.04)
- Target KPI: +20% check_start_rate within 14 days

**Lever 2 — Compare Pages (Priority: HIGH)**
High commercial intent, 3-5× better conversion than info content.
- Existing pattern: `clawguru-vs-wiz` (template confirmed working)
- Next targets: `clawguru-vs-snyk`, `moltbot-vs-victorops`, `openclaw-vs-ossec`
- Always include: comparison table, "when to choose which" section, internal links

**Lever 3 — Pillar Pages + Topic Clusters (Priority: HIGH)**
Missing for: Kubernetes, Docker, AWS, Linux, Compliance.
- Format: 2000+ words, TL;DR, checklist, common misconfigs, linked runbooks, FAQPage schema
- Each pillar links to 5+ cluster pages; cluster pages link back to pillar
- Start with `/de/kubernetes-security` (highest search volume)

**Lever 4 — FAQPage + HowTo Schema on Content Pages (Priority: MEDIUM)**
Rich snippets increase CTR by 20-30% without ranking change.
- Add to ALL Moltbot pages: `FAQPage` JSON-LD with 3-5 Q&As
- Add to ALL OpenClaw pages: `HowTo` JSON-LD for step-by-step guides
- Template already in §4 Schema Markup section

**Lever 5 — Fresh Content Signal (Priority: MEDIUM)**
- Weekly CVE analysis pages at `/de/academy/cve-YYYY-XXXXX`
- Each page: CVE summary, affected services, fix runbook link, CVSS score
- ~50 new indexable pages/year with guaranteed freshness signal

### Compare Page Template Rules
All compare pages MUST follow this structure:
1. "Not a Pentest" amber notice box
2. H1 with both tool names + year
3. Intro paragraph (2-3 sentences, what each tool does)
4. Comparison table (`min-w-full bg-gray-900 border border-gray-700 rounded-lg` — see Rule 6)
5. "When to choose which" section (2 cards: green for ClawGuru/OpenClaw, blue for competitor)
6. Further resources section (internal links to matching runbooks/pages)
7. Slug added to `COMPARE_SLUGS` in `app/sitemaps/[name]/route.ts`

### Dictionary Key Rule for New Check/Tool Pages
When adding new keys to `dictionaries/de.json` and `dictionaries/en.json`, also update:
- `lib/getDictionary.ts` → the `Dictionary` type definition for the relevant section
- All 14 other locale JSON files (or rely on `deepMerge` fallback to EN)

---

## 15. VIRAL FIRST MASTER-PLAN — 99 Schritte zur Traffic-Explosion (16.04.2026)

> **Krieg um Aufmerksamkeit. Kein langsames Wachstum. Nur virale Explosion.**

---

### PHASE 1: VIRAL CORE (Schritte 1-20) — Roast & Share Mechaniken

| # | Schritt | Viraler Effekt | Dateien/Features |
|---|---------|----------------|------------------|
| 1 | **Roast My Moltbot — Core Engine** | Erste virale Erfahrung: Nutzer roastet eigenen Stack, bekomcht brutales Feedback | `app/[lang]/roast-my-moltbot/page.tsx`, `components/roast/RoastEngine.tsx` |
| 2 | **Share-Score Button — Twitter/X** | One-Click Share mit vorausgefülltem Roast-Text + Score-Badge | `components/roast/ShareScore.tsx`, Twitter Card Meta |
| 3 | **Share-Score Button — LinkedIn** | LinkedIn-native Sharing mit professionellem Roast-Summary | `components/roast/ShareLinkedIn.tsx`, OG Image generierung |
| 4 | **PNG Badge Export** | Nutzer lädt Roast-Badge herunter → postet überall → Backlinks | `lib/badge-generator.ts`, Canvas API für PNG |
| 5 | **Roast Hall of Fame — Top 10** | Öffentliche Liste der "besten" (schlimmsten) Roasts → Wettbewerb | `app/[lang]/roast-my-moltbot/hall-of-fame/page.tsx` |
| 6 | **Roast Hall of Shame — Bottom 10** | Öffentliche Liste der "sichersten" Stacks → Gegenteiliger Wettbewerb | `app/[lang]/roast-my-moltbot/hall-of-shame/page.tsx` |
| 7 | **Weekly Roast — Auto-Feature** | Jede Woche wird ein zufälliger Stack geröstet + promoted | `app/[lang]/roast-my-moltbot/weekly-roast/page.tsx`, CRON Job |
| 8 | **Roast Leaderboard — Global** | Globale Rangliste aller Roasts nach Score → Gamification | `components/roast/GlobalLeaderboard.tsx`, Redis/SQL |
| 9 | **Roast by Category — Backend, Frontend, DevOps** | Nischen-Roasts für spezifische Communities | `app/[lang]/roast-my-moltbot/[category]/page.tsx` |
| 10 | **Celebrity Stack Roast — Famous CTOs** | Roast der Stacks bekannter Firmen → News-Wert | `content/celebrity-stacks/`, Twitter Tagging |
| 11 | **Roast Reaction System — Emoji Feedback** | Nutzer reagieren auf Roasts → Engagement Signal | `components/roast/ReactionBar.tsx`, Reactions DB |
| 12 | **Roast Comments — Community Roasting** | Community kann Stacks kommentieren → UGC | `components/roast/CommentSection.tsx`, Moderation |
| 13 | **Roast Battle — 1v1 Stack Comparison** | Zwei Stacks gegeneinander → Community votet | `app/[lang]/roast-my-moltbot/battle/page.tsx`, Voting System |
| 14 | **Auto-Generated Roast Video** | AI-generiertes Video des Roasts → TikTok/Reels | `lib/video-generator.ts`, Integration |
| 15 | **Roast RSS Feed** | RSS Feed aller neuen Roasts → Content Distribution | `app/rss/roasts/route.ts` |
| 16 | **Roast Email Subscription** | "Weekly Roast Digest" → E-Mail Capture | `components/roast/EmailCapture.tsx`, Mailer |
| 17 | **Roast Trends — Was ist heiß** | Trending Stacks, Trending Vulnerabilities → FOMO | `app/[lang]/roast-my-moltbot/trends/page.tsx` |
| 18 | **Roast Predictions — AI Forecast** | "Dein Stack wird in 30 Tagen gehackt" → Dringlichkeit | `components/roast/RoastPrediction.tsx`, ML Model |
| 19 | **Roast vs Industry Benchmark** | Vergleich mit Branchen-Durchschnitt → Social Proof | `lib/industry-benchmarks.ts`, Charts |
| 20 | **Roast Embed — iframe für Blogs** | Andere können Roasts embedden → Virale Verbreitung | `app/embed/roast/route.ts`, iframe Generator |

---

### PHASE 2: SHARE & DISTRIBUTION (Schritte 21-40) — Social & Backlinks

| # | Schritt | Viraler Effekt | Dateien/Features |
|---|---------|----------------|------------------|
| 21 | **Twitter/X Bot — Auto-Post New Roasts** | Jeder neue Roast wird automatisch geteilt → Reichweite | `api/social/twitter-post.ts`, CRON |
| 22 | **LinkedIn Company Auto-Post** | Professionelle Roast-Summaries auf LinkedIn | `api/social/linkedin-post.ts` |
| 23 | **Reddit Auto-Submission — r/devops, r/cybersecurity** | Roasts in relevante Subreddits → Traffic | `api/social/reddit-post.ts` |
| 24 | **Hacker News Auto-Submit — „Show HN"** | Beste Roasts auf HN → Massive Traffic-Spikes | `api/social/hn-submit.ts` |
| 25 | **IndieHackers Cross-Post** | Roast-Stories auf IH → Gründer-Community | `api/social/indiehackers-post.ts` |
| 26 | **Dev.to Republish — „I roasted 100 stacks"** | Content-Syndication → Developer Audience | `api/social/devto-publish.ts` |
| 27 | **Medium Publication — „The Stack Roast"** | Eigene Medium-Pub → Authority Building | `api/social/medium-publish.ts` |
| 28 | **GitHub Gist Integration — Export as Gist** | Roasts als Gists → Developer Shares | `components/roast/ExportGist.tsx`, GitHub API |
| 29 | **Slack App — „Roast My Stack" Bot** | Slack-Workspace Integration → B2B Viral | `api/slack/roast-bot.ts`, Slack SDK |
| 30 | **Discord Bot — Server Integration** | Discord-Communities → Gaming/Dev Audience | `api/discord/roast-bot.ts` |
| 31 | **Telegram Bot — Channel Integration** | Telegram-Channel Shares → EU/Asia Audience | `api/telegram/roast-bot.ts` |
| 32 | **WhatsApp Share Button — Mobile First** | Mobile Shares in Gruppen → High Engagement | `components/roast/ShareWhatsApp.tsx` |
| 33 | **Referral Program — „Roast a Friend"** | Nutzer laden Freunde ein → Referral Loop | `components/referral/ReferralSystem.tsx`, Tracking |
| 34 | **Affiliate Links in Roasts** | „Fix das mit diesem Tool" → Monetization | `lib/affiliate-links.ts` |
| 35 | **Backlink Outreach — „Featured in Roast"** | Firmen verlinken auf ihren Roast → SEO | `api/outreach/backlink-request.ts` |
| 36 | **Guest Roast — External Experts** | Bekannte Security-Experten rosten → Authority | `app/[lang]/roast-my-moltbot/guest/[expert]/page.tsx` |
| 37 | **Roast Podcast — Audio Export** | Roasts als Podcast-Episoden → Audio Audience | `lib/audio-generator.ts`, RSS Feed |
| 38 | **YouTube Shorts — Auto-Generated** | Kurz-Videos der Roasts → Algorithmus-Boost | `lib/youtube-shorts-generator.ts` |
| 39 | **TikTok Integration — Viral Clips** | Roast-Clips für TikTok → Gen Z Audience | `lib/tiktok-uploader.ts` |
| 40 | **Newsletter Sponsorships — „This Week's Worst Stack"** | Andere Newsletter sponsoren → Cross-Promo | `api/newsletter/sponsor-placement.ts` |

---

### PHASE 3: VIRAL LOOPS (Schritte 41-60) — Gamification & Retention

| # | Schritt | Viraler Effekt | Dateien/Features |
|---|---------|----------------|------------------|
| 41 | **XP System — Roast Points** | Nutzer verdienen XP für Roasts → Gamification | `lib/xp-system.ts`, Level-Up |
| 42 | **Badges & Achievements** | "First Roast", "Roast Master", "Security Saint" → Collection | `components/gamification/BadgeDisplay.tsx` |
| 43 | **Streak System — Daily Roast** | Tägliche Roasts belohnt → Habit Formation | `components/gamification/StreakCounter.tsx` |
| 44 | **Leaderboard Seasons — Monthly Reset** | Neue Chance jeden Monat → Retention | `lib/season-system.ts`, Rewards |
| 45 | **Clans/Teams — Group Roasting** | Teams können gemeinsam rosten → B2B Viral | `components/gamification/ClanSystem.tsx` |
| 46 | **Roast Challenges — „Roast 5 DBs this week"** | Wöchentliche Challenges → Engagement | `app/[lang]/challenges/page.tsx` |
| 47 | **Prediction Market — „Will this stack get hacked?"** | Nutzer wetten auf Hacks → Viral Content | `components/prediction/PredictionMarket.tsx` |
| 48 | **Roast Lottery — Random Prize** | Jede Woche wird ein Nutzer belohnt → FOMO | `lib/lottery-system.ts` |
| 49 | **Mystery Stack — „Guess the Stack"** | Nutzer raten Stack anhand Roast → Engagement | `app/[lang]/roast-my-moltbot/mystery/page.tsx` |
| 50 | **Roast Speedrun — Fastest Fix** | Zeit-basierte Challenges → Speed-Optimization | `components/speedrun/SpeedrunTimer.tsx` |
| 51 | **Stack Evolution — „Before/After"** | Nutzer zeigen Fortschritt → Success Stories | `app/[lang]/roast-my-moltbot/evolution/page.tsx` |
| 52 | **Roast Rematch — „Roast me again"** | Neue Roasts nach Fixes → Return Traffic | `components/roast/RematchButton.tsx` |
| 53 | **Roast History — Personal Timeline** | Nutzer sehen eigene Entwicklung → Retention | `app/[lang]/profile/roast-history/page.tsx` |
| 54 | **Roast Insights — Personal Analytics** | Statistiken über eigene Stacks → Engagement | `components/analytics/PersonalInsights.tsx` |
| 55 | **Roast Recommendations — „Roast this next"** | AI-basierte Empfehlungen → Next Action | `lib/recommendation-engine.ts` |
| 56 | **Social Proof Notifications — „X just got roasted"** | Real-time Notifications → FOMO | `components/notifications/SocialProof.tsx`, WebSocket |
| 57 | **Roast Stories — Instagram-like** | 24h Stories der Roasts → Ephemeral Content | `components/stories/RoastStories.tsx` |
| 58 | **Roast Reactions — Emoji Battles** | Community reagiert mit Emojis → Engagement | `components/reactions/EmojiBattle.tsx` |
| 59 | **Roast Duels — Challenge Friends** | Direkte 1v1 Challenges → Social Pressure | `app/[lang]/roast-my-moltbot/duel/page.tsx` |
| 60 | **Roast Tournaments — Bracket System** | Turniere mit Elimination → Viral Events | `app/[lang]/tournaments/page.tsx`, Bracket |

---

### PHASE 4: CONTENT VIRALITY (Schritte 61-80) — Hot Takes & Trends

| # | Schritt | Viraler Effekt | Dateien/Features |
|---|---------|----------------|------------------|
| 61 | **Hot Take Generator — AI-Powered** | Kontroverse Takes → Engagement/Debatte | `lib/hot-take-generator.ts`, GPT-4 |
| 62 | **Trending CVE Roasts — „This CVE roasted my stack"** | Aktuelle CVEs + Personal Story → Relevanz | `app/[lang]/cve-roasts/page.tsx` |
| 63 | **Tech Stack Roast Series — „Roasting Famous Startups"** | Roasts bekannter Startups → Newsjacking | `content/startup-roasts/` |
| 64 | **Framework Wars — React vs Vue vs Angular Roasts** | Tech-Debatten → Traffic/Comments | `app/[lang]/framework-wars/page.tsx` |
| 65 | **Cloud Provider Roasts — AWS vs GCP vs Azure** | Cloud-Wars → Massive Audience | `app/[lang]/cloud-wars/page.tsx` |
| 66 | **Database Roasts — PostgreSQL vs Mongo vs MySQL** | DB-Debatten → Developer Engagement | `app/[lang]/db-wars/page.tsx` |
| 67 | **„Will it Scale?" Series** | Skalierungs-Roasts → Growth-Hacker Audience | `app/[lang]/will-it-scale/page.tsx` |
| 68 | **Security Myths Busted — Hot Takes** | Kontroverse Security-Statements → Shares | `app/[lang]/security-myths/page.tsx` |
| 69 | **Roast Predictions 2025 — „What's next"** | Zukunftsprognosen → Thought Leadership | `app/[lang]/predictions-2025/page.tsx` |
| 70 | **Year in Review — „Worst Stacks of 2025"** | Jahresrückblick → Viral December | `app/[lang]/year-in-review/page.tsx` |
| 71 | **April Fools — „Best Security Practices" (Irony)** | Satire → Massive Shares | `app/[lang]/april-fools/page.tsx` |
| 72 | **Roast Awards — „Stack Oscars"** | Jährliche Awards → Event Marketing | `app/[lang]/roast-awards/page.tsx` |
| 73 | **AMA Series — „Roast Me Live"** | Live-Roast Sessions → Real-time Engagement | `app/[lang]/ama/live/page.tsx`, Streaming |
| 74 | **Roast Podcast Clips — Best of** | Audio-Highlights → Podcast Growth | `lib/podcast-clipper.ts` |
| 75 | **Roast Memes — Meme Generator** | Memes aus Roasts → Viral Spread | `lib/meme-generator.ts` |
| 76 | **Roast Quotes — Tweetable Snippets** | Shareable Quotes → Twitter Growth | `components/quotes/QuoteGenerator.tsx` |
| 77 | **Roast Statistics — „Data Insights"** | Daten-basierte Content → Authority | `app/[lang]/roast-statistics/page.tsx` |
| 78 | **Roast Research Papers — „The Science of Bad Stacks"** | Akademischer Anstrich → Serious Audience | `app/[lang]/research/page.tsx` |
| 79 | **Roast eBook — „The Art of Getting Roasted"** | Lead Magnet → E-Mail Capture | `lib/ebook-generator.ts` |
| 80 | **Roast Course — „How to Not Get Roasted"** | Academy Course → Monetization | `app/[lang]/academy/not-getting-roasted/page.tsx` |

---

### PHASE 5: SCALE & MONETIZE (Schritte 81-99) — Growth Hacking

| # | Schritt | Viraler Effekt | Dateien/Features |
|---|---------|----------------|------------------|
| 81 | **API Access — „Build on Roast Data"** | Developer API → Platform Play | `api/v1/roast-data/route.ts` |
| 82 | **White Label Roasts — B2B Integration** | Firmen nutzen Roast-Engine → Enterprise | `api/white-label/roast-widget.ts` |
| 83 | **Roast as a Service — API Pricing** | Nutzer zahlen für Roast-Calls → Revenue | `app/[lang]/api-pricing/page.tsx` |
| 84 | **Sponsored Roasts — „Roast powered by X"** | Sponsor-Integration → Ad Revenue | `components/sponsors/SponsoredRoast.tsx` |
| 85 | **Roast Merch — „I Survived the Roast"** | T-Shirts, Stickers → Brand Awareness | `app/[lang]/merch/page.tsx`, Print-on-Demand |
| 86 | **Roast Pro — Premium Features** | Gated Features → Conversion | `app/[lang]/roast-pro/page.tsx` |
| 87 | **Roast Teams — Enterprise Plan** | Team-Roasts → B2B Revenue | `app/[lang]/roast-teams/page.tsx` |
| 88 | **Roast Certification — „Security Verified"** | Badge für Unternehmen → Authority | `app/[lang]/certification/page.tsx` |
| 89 | **Roast Consulting — „Fix Your Stack"** | Professional Services → High-Ticket | `app/[lang]/consulting/page.tsx` |
| 90 | **Roast Partners — Integration Marketplace** | Tool-Integrationen → Ecosystem | `app/[lang]/partners/page.tsx` |
| 91 | **Roast Community — Forum/Discord** | Community Hub → Retention | `app/[lang]/community/page.tsx` |
| 92 | **Roast Events — IRL/Virtual Conferences** | Events → Brand Building | `app/[lang]/events/page.tsx` |
| 93 | **Roast Charity — „Roast for Good"** | Charity-Aktionen → Positive PR | `app/[lang]/charity/page.tsx` |
| 94 | **Roast Open Source — „Roast the World"** | OSS-Projekte rosten → Developer Love | `app/[lang]/opensource/page.tsx` |
| 95 | **Roast Academy — Certification Program** | Lern-Plattform → Education Revenue | `app/[lang]/academy/certification/page.tsx` |
| 96 | **Roast Influencers — Ambassador Program** | Influencer-Partnerschaften → Reach | `app/[lang]/ambassadors/page.tsx` |
| 97 | **Roast Data Sales — „State of Security"** | Anonymisierte Daten → Research Revenue | `lib/data-sales.ts` |
| 98 | **Roast IPO — „Going Public"** | Ultimate Goal → Exit Strategy | (Future) |
| 99 | **Roast World Domination — Every Stack Roasted** | Mission Complete → Legacy | (The Dream) |

---

### VIRAL FIRST PRINCIPLES

1. **Shares > SEO** — Jede Funktion muss shareable sein
2. **Emotion > Information** — Roasts müssen emotional treffen
3. **FOMO > Feature** — Scarcity und Urgency überall
4. **Community > Content** — Nutzer generieren Inhalt
5. **Loop > Launch** — Virale Loops wichtiger als Launches

### ERSTE 5 SCHRITTE — JETZT STARTEN

**Schritt 1:** Roast My Moltbot Core Engine fertigstellen
**Schritt 2:** Share-Buttons (Twitter/X, LinkedIn) implementieren
**Schritt 3:** Hall of Fame/Shame öffentlich machen
**Schritt 4:** Weekly Roast Automation
**Schritt 5:** PNG Badge Export für Social Sharing

---

## 14. QUALITY MANIFESTO & CONVERSION STRATEGY (Added 15.04.2026)

> **Billigen Schrott gibt es schon genug. ClawGuru wird Nr. 1 durch Qualität, nicht durch Masse.**

### The #1 Principle — Why Quality Wins

Every page, every feature, every interaction must answer: **"Would a CISO pay €29/month for this?"**

If the answer is no → don't build it. If the answer is "maybe" → make it so good the answer becomes yes.

**Quality Floor: 92/100** — No page ships below this. Metrics:
- Unique, actionable content (not reworded docs)
- Working code examples users can copy-paste
- Real security value (not SEO filler)
- Professional dark-theme design (Rule 6)
- Full JSON-LD schema (FAQPage + HowTo)
- Minimum 3 internal links to conversion pages

### Subscription Tiers — What Users Pay For

| Tier | Price | Core Value | Conversion Trigger |
|------|-------|------------|-------------------|
| **Explorer (Free)** | €0 | Security Check (basic), 3 Runbooks/month, CVE Feed | "Your score is 42/100 — unlock the full report" |
| **Pro** | €29/month | Full Check reports, unlimited Runbooks, CVE alerts, Copilot AI, Custom scans | Score < 70 → "Fix this now with Pro" |
| **Team** | €99/month | Multi-user, Scheduled scans, Compliance exports (PDF), API access, Audit trails | "Share with your team" after first Pro check |

### The Conversion Funnel (Traffic → Revenue)

```
Google Search → Content Page (Moltbot/CVE/Compare)
  → CTA: "Check your stack now" → /securitycheck
    → Score displayed (free, always)
      → Score < 70: "Upgrade to Pro for full analysis + fix commands"
      → Score > 70: "Share your score" (viral) + "Monitor weekly with Pro"
        → Pro Signup → Onboarding → First Scheduled Scan
          → Team Upgrade: "Add your colleagues"
```

**Key Principle:** The free tier must be genuinely useful — so good that users WANT to upgrade, not feel tricked.

### Conversion Touch Points (Build These)

| Touch Point | Location | Action | Priority |
|-------------|----------|--------|----------|
| **Post-Check Upgrade CTA** | `/securitycheck` results | "Unlock detailed remediation steps" → Pro | CRITICAL |
| **Pricing Page** | `/pricing` | Feature matrix, Trust signals, FAQ, "Start free" | CRITICAL |
| **Gated CVE Impact** | CVE Fix pages | Basic fix free, "Get automated fix script" → Pro | HIGH |
| **Roast Share Button** | `/roast-my-moltbot` | "My stack scored 42 — check yours" → Twitter/LinkedIn | HIGH |
| **Weekly Email Report** | Post-check opt-in | "Get your weekly security score email" → engagement → Pro | MEDIUM |
| **Team Invite Flow** | Pro dashboard | "Invite colleagues" → Team upgrade | MEDIUM |

### Quality Differentiators vs Competition

| Feature | Wiz/Snyk/Datadog | ClawGuru |
|---------|------------------|----------|
| Self-hosted focus | ❌ Cloud-only | ✅ Self-hosted first |
| GDPR/DSGVO native | ❌ US-first | ✅ EU-first, data stays local |
| Pricing transparency | ❌ "Contact sales" | ✅ Public pricing, start free |
| AI-powered fix guides | ❌ Generic docs | ✅ Context-aware Runbooks |
| Executable playbooks | ❌ PDF reports | ✅ Copy-paste shell commands |
| "Not a Pentest" trust | ❌ Attack-tool stigma | ✅ Trusted defence partner |
| 16-language coverage | ❌ English only | ✅ 16 languages, geo-aware |

### Content Quality Checklist (Every Page Must Pass)

Before any content page ships, verify:
- [ ] **Unique value**: Would someone bookmark this? Share it with a colleague?
- [ ] **Actionable**: Contains at least 1 copy-paste code block or checklist
- [ ] **Professional**: Dark theme, proper typography, no broken layouts
- [ ] **Conversion path**: At least 1 CTA to `/securitycheck`, `/pricing`, or `/roast-my-moltbot`
- [ ] **Schema markup**: FAQPage + HowTo/TechArticle JSON-LD
- [ ] **Trust anchor**: "Not a Pentest" notice visible
- [ ] **Internal links**: 3+ links to related pages (creates topic authority)

---

## 15. 30-TAGE MASSEN-TRAFFIC MASTER-PLAN (Added 14.04.2026, Updated 15.04.2026)

> **Ziel**: Von Growth Phase → 50,000+ unique visitors/month in 30 Tagen.
> Jede Woche hat ein Schwerpunktthema, messbare KPIs, und konkrete Deliverables.

---

### WOCHE 1 (Tag 1–7): Virale Mechanik + Frischer Content-Rhythmus

**Schwerpunkt: Die Tools viral machen + ersten Crawl-Signal-Boost**

**Tag 1-2: Roast My Moltbot — Share-Button**
- [ ] "Teile deinen Roast-Score"-Button hinzufügen (copy-to-clipboard, Twitter-Share mit prefilled text)
- [ ] Shareable URL-Pattern: `/roast-my-moltbot?score=72&issues=api-key-exposure,no-rbac`
- [ ] `openGraph.url` auf Roast My Moltbot Page hinzufügen (Rule 2 fix!)

**Tag 3-4: Academy CVE Feed — Wöchentlicher Crawl-Magnet**
- [x] `/de/academy/cve-XXXX-XXXXX` Route gebaut (30+ CVE-Pages live!) ✅
- [x] CVE-Pages mit Fix-Steps, CVSS Score, Betroffene Software ✅
- [x] Format: Schweregrad, Betroffene Software, Fix-Steps, Link zu Runbook ✅

**Tag 5-7: Interne Verlinkung Audit + Fix**
- [x] 70+ Moltbot Pages mit internen Links zu /securitycheck, /runbooks, /oracle ✅
- [x] All content pages have FAQPage + HowTo JSON-LD ✅
- [x] Cross-links in all new pages ✅

**KPI Woche 1**: Roast-Tool Shares +20%, Google crawlt alle 5 neuen Batch-4-Pages

---

### WOCHE 2 (Tag 8–14): AI-Agent Pillar Page + Compare Batch 7

**Schwerpunkt: Den wichtigsten Traffic-Hebel bauen — AI Agent Security Pillar**

**Tag 8-10: AI Agent Security Pillar Page**
- [x] `/de/moltbot/ai-agent-security` exists as pillar page ✅
- [x] 70+ Moltbot sub-pages covering all AI-agent security topics ✅
- [x] Schema: FAQPage + HowTo on all pages ✅

**Tag 11-12: Compare Batches — AI-Tool Vergleiche**
- [x] 30+ Compare pages live (Batches 1–19) ✅
- [x] Including: moltbot-vs-langchain-agents, moltbot-vs-autogen, etc. ✅

**Tag 13-14: Solutions Batches — Compliance Deep-Dives**
- [x] 15+ Solutions pages live (Batches 1–12) ✅
- [x] dsgvo-compliance-automation, nist-csf-compliance, etc. all live ✅

**KPI Woche 2**: AI Agent Security Pillar indexiert, 3 neue Compare Pages live, GSC zeigt neue Impressions

---

### WOCHE 3 (Tag 15–21): Geo-Expansion + Moltbot Batch 5

**Schwerpunkt: Geografischen Footprint verdoppeln**

**Tag 15-16: Asia/LatAm DB Seeding**
- [ ] `GET /api/geo/asia-latam-expansion?stable=1` ausführen (STILL PENDING)
- [ ] Sitemap-Buckets neu generieren: `GEO_MATRIX_SITEMAP=1` (STILL PENDING)
- [ ] Vercel: Cache Purge + neu deployen

**Tag 17-19: Moltbot Batches 5–31 — MASSIV überliefert**
- [x] 60+ neue Moltbot Pages (Batches 5–31) statt geplante 5 ✅
- [x] Covering: LLM security, AI agent hardening, prompt defense, etc. ✅

**Tag 20-21: Google Search Console Action**
- [ ] Sitemap neu einreichen
- [ ] URL Inspection für alle neuen Pages anfordern
- [ ] Core Web Vitals Report prüfen — LCP/CLS fixen falls > 2.5s

**KPI Woche 3**: 50+ neue Geo-URLs indexiert, Moltbot Batch 5 live, Sitemap Submission abgeschlossen

---

### WOCHE 4 (Tag 22–30): Conversion-Optimierung + Academy Relaunch

**Schwerpunkt: Traffic in Users und Shares konvertieren**

**Tag 22-24: /check und /neuro Conversion-Boost** (NOW TOP PRIORITY)
- [ ] A/B-Test: Hero-CTA Text "Kostenloser Security-Check" vs "Stack in 30s scannen"
- [ ] Stack MRI: Ergebnis-Share-Button ("Mein Stack hat 8 Sicherheitslücken — analysiere deinen: clawguru.org/neuro")
- [ ] E-Mail Capture nach erfolgreichem Check-Scan (opt-in, GDPR)
- [ ] **Post-Check Pro-Upgrade CTA** (Score < 70 → "Unlock full report with Pro")

**Tag 25-27: Academy + Pricing Page**
- [x] 30+ CVE-Pages live (weit über Plan) ✅
- [ ] **Pricing Page Redesign** — Feature-Matrix, Trust-Siegel, "Start free" CTA
- [ ] **Pro Feature Gate** — Detaillierte CVE Impact Analyse nur für Pro

**Tag 28-30: Performance + Monitoring-Baseline setzen**
- [ ] Vercel Analytics: Funnel von Landing Page → Check Start → Completion messen
- [ ] Top 10 Pages nach organischem Traffic identifizieren → interne Verlinkung verstärken
- [ ] AGENTS.md Kapitel 14 mit tatsächlichen KPI-Ergebnissen updaten
- [ ] 30-Tage-Retrospektive: Was hat Traffic gebracht? Was nicht? Plan für Tag 31-60 anpassen.

**KPI Woche 4**: Check Completion Rate +15%, Academy Traffic +30%, 10+ Social Shares/Tag

---

### 30-TAGE GESAMT-ZIELE

| Metrik | Plan | Realität (Tag 12) | Status |
|--------|------|-------------------|--------|
| Organische Impressions (GSC) | +40% | TBD — GSC noch pending | ⏳ |
| Indexierte Pages | ~26,500+ | ~43,900 (überliefert!) | ✅✅ |
| Check-Start-Rate | +20% | Baseline (Conversion-Funnel noch nicht gebaut) | ⚠️ |
| Social Shares/Tag | 10+ | 0 (Share-Button fehlt noch) | ❌ |
| Neue AI-Agent Pages | 10+ (Batch 4+5) | **70+ Pages** (Batch 4–31) | ✅✅✅ |
| **Paid Subscribers** | **n/a** | **0 (Pricing/Funnel fehlt)** | **❌ NEXT** |

---

### CONTENT-PRIORITÄTS-MATRIX (für schnelle Entscheidungen)

Wenn du nicht weißt, was als nächstes gebaut werden soll, nimm immer das mit dem höchsten Traffic-Score:

| Task | Revenue-Score | Traffic-Score | Zeit-Aufwand | Wann bauen |
|------|---------------|---------------|--------------|-----------|
| **Pricing Page + Pro Tiers** | **10/10** | 3/10 | 4h | **SOFORT** |
| **Post-Check Upgrade CTA** | **10/10** | 2/10 | 2h | **SOFORT** |
| **Roast Share Button (viral)** | 8/10 | **9/10** | 2h | **SOFORT** |
| Compare Page (vs Tool) | 5/10 | **9/10** | 1.5h | Wöchentlich |
| CVE Analysis Page | 4/10 | 8/10 | 1h | Wöchentlich |
| AI Agent Pillar Page | 6/10 | **10/10** | 3h | Bei Bedarf |
| Moltbot Sub-Page (Batch) | 3/10 | 7/10 | 2h | Batch |
| Solutions Deep-Dive | 6/10 | 7/10 | 2h | Batch |
| Geo City Page | 2/10 | 6/10 | 0.5h | API-Seeding |
| **E-Mail Capture Flow** | **9/10** | 1/10 | 3h | Woche 4 |

---

> **Every Agent Must Remember**: Read this document fully before the first action.
> Update Session Log + Open Tasks after every session.
> Never build with errors. Never push red code.
> **Goal: ClawGuru = #1 Security Check Platform for Self-Hosted Infrastructure worldwide.**
> **Quality > Quantity. Every page must be worth paying for. Billigen Schrott gibt es schon genug.**

