# ClawGuru — AGENTS.md · Master Operating Manual v8 (12.04.2026)

> **This document is the single source of truth for every agent working in this codebase.**
> Read it completely BEFORE making any change. Update the Session Log after every session.
> Last updated: 12.04.2026 | Language: English (maximises AI model compatibility)

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
BANNED: bg-blue-100, bg-green-100, bg-yellow-100, bg-red-100, bg-purple-100
BANNED: bg-white
BANNED: text-gray-600, text-gray-700, text-gray-800, text-gray-900
BANNED: border-gray-200, border-blue-200, border-green-200
```

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
Before pushing ANY new content page, run these checks:
```powershell
# 1. Zero light backgrounds remaining
rg "bg-gray-50|bg-gray-100|bg-yellow-50|bg-blue-50|bg-green-50|bg-white" app/[lang]/ --type tsx
# MUST return 0 results

# 2. Zero light text on dark background
rg "text-gray-600|text-gray-800" app/[lang]/ --type tsx
# MUST return 0 results

# 3. Zero light borders
rg "border-gray-200|border-blue-200" app/[lang]/ --type tsx
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
- **Geo-First SEO** — 15 languages × 500+ cities × 30+ security topics = 1,000,000+ indexable quality pages.
- **Self-Hosted + GDPR/DSGVO** — EU-first, no cloud lock-in. Differentiates from Wiz, Snyk, Datadog.
- **Real Data** — 100% real, no mock metrics. Complete audit trails.

### Market Position (April 2026)

| Metric | Current | Target |
|--------|---------|--------|
| Indexed Pages | ~24,500 URLs | 1,000,000+ URLs |
| Active Cities (Geo) | 123 cities | 500+ cities |
| Languages | 15 | 15 (complete) |
| Content Clusters | Moltbot(37), OpenClaw(15), Solutions(8), Compare(17) | 50+ clusters |
| Monthly Visitors | Growth phase | 500,000+ unique visitors |

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

## 2. CURRENT STATE (Stand 09.04.2026)

### Live Pages — Full Inventory

**Moltbot Pages (`app/[lang]/moltbot/`) — 37 pages, all live**

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

**Solutions Pages (`app/[lang]/solutions/`) — 8 pages, all live**

`soc2-compliance-automation`, `kubernetes-security-hardening`, `aws-security-architecture`,
`startup-security-foundation`, `enterprise-siem-integration`,
`iso27001-certification-roadmap`, `pci-dss-compliance`, `hipaa-security-controls`

**Compare Pages — 17 pages, all live**

`openclaw-vs-snyk`, `openclaw-vs-semgrep`, `clawguru-vs-wiz`, `openclaw-vs-sonarqube`,
`moltbot-vs-opsgenie`, `moltbot-vs-clawbot`,
`clawguru-vs-crowdstrike`, `clawguru-vs-datadog`, `openclaw-vs-falco`,
`clawguru-vs-lacework`, `moltbot-vs-pagerduty`,
`clawguru-vs-trivy`, `clawguru-vs-checkov`, `openclaw-vs-wazuh`,
`clawguru-vs-snyk`, `moltbot-vs-victorops`, `openclaw-vs-ossec`

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

| Sitemap | URLs/locale | × 15 locales | Total |
|---------|-------------|--------------|-------|
| `main-{locale}.xml` — Hub pages | 26 | × 15 | 390 |
| `main-{locale}.xml` — Moltbot sub-pages | 29 | × 15 | 435 |
| `main-{locale}.xml` — OpenClaw sub-pages | 10 | × 15 | 150 |
| `main-{locale}.xml` — Security pages | 31 | × 15 | 465 |
| `main-{locale}.xml` — Compare + Guide pages | 20 | × 15 | 300 |
| `runbooks-{locale}-{bucket}.xml` | ~500/bucket × 3 | × 15 | ~22,500 |
| `tags-{locale}-{bucket}.xml` | 5 | × 15 | 225 |
| **TOTAL** | | | **~24,465** |

### Critical Open Tasks (Do These First)

**1. Vercel Environment Variables — Set in Vercel Dashboard**
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
- **Deployment**: Vercel (auto-deploy on push to `main`)
- **Domain**: clawguru.org

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

### Supported Locales (16) — ALL pages must have hreflang for all 16
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
- All 15 locales must be listed — `buildLocalizedAlternates()` handles this automatically
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
        </div>
        <h1 className="text-4xl font-bold mb-4">Primary Keyword: Secondary Phrase</h1>
        <p className="text-lg text-gray-600 mb-8">Intro paragraph with primary keyword and clear value proposition.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Section 1 — with code or table</h2>
          {/* Content */}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Section 2 — with code or table</h2>
          {/* Content */}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Security Check</div>
              <div className="text-sm text-gray-600">Scan your system now</div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Runbooks</div>
              <div className="text-sm text-gray-600">600+ security playbooks</div>
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
  → ... (× 15 locales)
  → /sitemaps/runbooks-de-a-f.xml (runbooks starting a-f, German)
  → ... (× 5 buckets × 15 locales)
  → /sitemaps/tags-de-a-f.xml     (tags, German)
  → ... (× 5 buckets × 15 locales)
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
| `SITEMAP_100K_LOCALES` | all 15 locales | Comma-separated locales in sitemap index |
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

### Traffic KPIs

| Metric | Current | 3-Month Target | 12-Month Target |
|--------|---------|----------------|-----------------|
| Indexed pages | ~24,500 | 50,000+ | 500,000+ |
| Organic clicks/month | Building | 10,000+ | 200,000+ |
| GSC impressions/month | Building | 500,000+ | 10,000,000+ |
| Avg. position top keywords | n/a | Top 10 | Top 3 |

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

# Step 3 — Push (Vercel deploys automatically)
git push
```

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
| 12.04.2026 | 9 | SEO: hreflang xhtml:link removed from sitemap XML. Duplicate /check URL removed. Traffic growth sprint: /de/check CTA + proof bullets + score methodology. /de/roast-my-stack FAQ + examples. Compare Batch 3 (trivy/checkov/wazuh). /kubernetes-security pillar page. Compare Batch 4 (snyk/victorops/ossec). FAQPage + WebPage JSON-LD added to all 37 Moltbot pages via batch script. AGENTS.md v8. |

### Open Tasks by Priority

**CRITICAL — Do Before Next Content Work**
- [ ] Set Vercel env vars: `GEO_MATRIX_SITEMAP=1`, `SITEMAP_BUCKETS=5`, `GEO_MATRIX_SITEMAP_CITY_LIMIT=50`
- [ ] Run Asia/LatAm DB seeding: `GET /api/geo/asia-latam-expansion?stable=1`
- [ ] Google Search Console: resubmit `sitemap.xml`, request indexing for `/de/runbooks` and `/de`

**HIGH — Next Session (Traffic Growth Sprint)**
- [x] `/de/kubernetes-security` Pillar-Page erstellt ✅
- [x] FAQPage + WebPage JSON-LD auf alle 37 Moltbot-Pages ✅
- [x] Compare Batch 4: clawguru-vs-snyk, moltbot-vs-victorops, openclaw-vs-ossec ✅
- [ ] Migrate all 37 Moltbot pages from hardcoded LANGS to `buildLocalizedAlternates()` — adds `x-default` hreflang
- [ ] FAQPage + HowTo schema auf alle 15 OpenClaw-Pages
- [ ] Compare Batch 5: `clawguru-vs-lacework` follow-up, `moltbot-vs-splunk`, `openclaw-vs-crowdsec`

**MEDIUM — Sprint 2**
- [ ] Solutions Batch 2: ISO27001, PCI-DSS, HIPAA pages (still pending)
- [ ] Africa expansion route: `/api/geo/africa-expansion`
- [ ] MEA expansion route: `/api/geo/mea-expansion`
- [ ] Moltbot Batch 4: 5 AI-agent focused pages
- [ ] Academy/Blog section with weekly CVE analysis pages (`/de/academy/cve-YYYY-XXXXX`) — fresh content signal

**LOW — Ongoing**
- [ ] 250 Moltbot/AI-Agent pages (Mycelium Content Architect v3)
- [ ] Oceania expansion (Sydney, Melbourne, Auckland)
- [ ] LatAm+ expansion (Buenos Aires, Bogota, Lima)
- [ ] Next.js 15 upgrade (unlocks eslint 9, removes all npm warnings)

### Next 5 Immediate Actions (in Order)
1. Set Vercel env vars (manual, Vercel dashboard)
2. Run Asia/LatAm DB seeding (HTTP call with secret)
3. Resubmit sitemap in Google Search Console after new compare pages deploy
4. Build `/de/kubernetes-security` Pillar Page
5. Add FAQPage + WebPage schema JSON-LD to all Moltbot pages (batch edit)

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

> **Every Agent Must Remember**: Read this document fully before the first action.
> Update Session Log + Open Tasks after every session.
> Never build with errors. Never push red code.
> Goal: ClawGuru = #1 Security Check Platform for Self-Hosted Infrastructure worldwide.

