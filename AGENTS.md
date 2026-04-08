# ClawGuru — AGENTS.md · Master Operating Manual v6 (08.04.2026)

> **This document is the single source of truth for every agent working in this codebase.**
> Read it completely BEFORE making any change. Update the Session Log after every session.
> Last updated: 08.04.2026 | Language: English (maximises AI model compatibility)

---

## 0. PREAMBLE — FIVE NON-NEGOTIABLES (Read Before Anything Else)

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
| Content Clusters | Moltbot(29), OpenClaw(10), Solutions(5), Compare(6) | 50+ clusters |
| Monthly Visitors | Growth phase | 500,000+ unique visitors |

### Trust Anchor — Use on Every Content Page
```tsx
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
  <strong>"Not a Pentest" Notice</strong>: This guide is for hardening your own systems. No attack tools.
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

## 2. CURRENT STATE (Stand 08.04.2026)

### Live Pages — Full Inventory

**Moltbot Pages (`app/[lang]/moltbot/`) — 29 pages, all live**

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

**OpenClaw Pages (`app/[lang]/openclaw/`) — 10 pages, all live**

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

**Solutions Pages (`app/[lang]/solutions/`) — 5 pages, all live**

`soc2-compliance-automation`, `kubernetes-security-hardening`, `aws-security-architecture`,
`startup-security-foundation`, `enterprise-siem-integration`

**Compare Pages — 6 pages, all live**

`openclaw-vs-snyk`, `openclaw-vs-semgrep`, `clawguru-vs-wiz`, `openclaw-vs-sonarqube`,
`moltbot-vs-opsgenie`, `moltbot-vs-clawbot`

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
GEMINI_MODEL=gemini-2.0-flash      # Stable model (2.5-flash returns 400)
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

| Batch | Slugs | Priority |
|-------|-------|----------|
| OpenClaw Batch 2 (5 pages) | service-mesh-security, waf-configuration, cicd-security-pipeline, secrets-rotation-automation, microservices-security | HIGH |
| Compare Batch 2 (5 pages) | clawguru-vs-crowdstrike, clawguru-vs-datadog, openclaw-vs-falco, clawguru-vs-lacework, moltbot-vs-pagerduty | HIGH |
| Solutions Batch 2 (5 pages) | iso27001-certification-roadmap, pci-dss-compliance, hipaa-security-controls, azure-security-architecture, gcp-security-architecture | MEDIUM |
| Moltbot Batch 4 (5 pages) | ai-agent-threat-model, real-time-cve-feed, bot-security-testing, sbom-generation, compliance-automation-engine | MEDIUM |

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

### Supported Locales (15) — ALL pages must have hreflang for all 15
```
de, en, es, fr, pt, it, ru, zh, ja, ko, ar, hi, tr, pl, nl
```
Defined in: `lib/i18n.ts` → `SUPPORTED_LOCALES`, `DEFAULT_LOCALE = "de"`

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

Default order (if no env var set): `deepseek → gemini → openai`

```
AI_PROVIDER_ORDER=deepseek,gemini,openai   # DeepSeek cheapest, use first
```

### Provider API Keys (Vercel Env Vars)
| Variable | Provider | Notes |
|----------|----------|-------|
| `DEEPSEEK_API_KEY` | DeepSeek | Cheapest, use as primary |
| `GEMINI_API_KEY` | Google Gemini | Fast, good quality |
| `OPENAI_API_KEY` | OpenAI GPT | Fallback, most expensive |

### Gemini Model Configuration
```
GEMINI_MODEL=gemini-2.0-flash    # Default — stable GA since Feb 2025
```
**Known Issue (fixed 08.04.2026):** `gemini-2.5-flash` and `gemini-2.5-flash-lite` were set as
defaults but return 400 (model not found / not GA). Fixed in `lib/ai/providers.ts`.

Fallback chain inside `callGemini()`:
1. `gemini-2.0-flash` (primary, override with `GEMINI_MODEL`)
2. `gemini-1.5-flash` (stable fallback)
3. `gemini-2.0-flash-lite` (lightest model, last resort)

If you want to use `gemini-2.5-flash` when it becomes GA, set:
```
GEMINI_MODEL=gemini-2.5-flash-preview-04-17   # Use exact preview version name
```

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
| Gemini 400 errors | Model `gemini-2.5-flash` not GA | 08.04.2026 |
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

### Open Tasks by Priority

**CRITICAL — Do Before Next Content Work**
- [ ] Set Vercel env vars: `GEO_MATRIX_SITEMAP=1`, `SITEMAP_BUCKETS=5`, `GEO_MATRIX_SITEMAP_CITY_LIMIT=50`
- [ ] Run Asia/LatAm DB seeding: `GET /api/geo/asia-latam-expansion?stable=1`
- [ ] Google Search Console: resubmit `sitemap.xml`, request indexing for `/de/runbooks` and `/de`

**HIGH — Next Session**
- [ ] Migrate all 29 Moltbot pages from hardcoded `LANGS` array to `buildLocalizedAlternates()` — adds `x-default` hreflang to all pages
- [ ] Add FAQ + WebPage schema JSON-LD to all Moltbot + OpenClaw pages
- [ ] OpenClaw Batch 2: 5 new pages (see Phase 2 above)
- [ ] Compare Batch 2: 5 new pages (vs-crowdstrike, vs-datadog, vs-falco, vs-lacework, vs-pagerduty)

**MEDIUM — Sprint 2**
- [ ] Solutions Batch 2: ISO27001, PCI-DSS, HIPAA pages
- [ ] Africa expansion route: `/api/geo/africa-expansion`
- [ ] MEA expansion route: `/api/geo/mea-expansion`
- [ ] Moltbot Batch 4: 5 AI-agent focused pages

**LOW — Ongoing**
- [ ] 250 Moltbot/AI-Agent pages (Mycelium Content Architect v3)
- [ ] Oceania expansion (Sydney, Melbourne, Auckland)
- [ ] LatAm+ expansion (Buenos Aires, Bogota, Lima)
- [ ] Next.js 15 upgrade (unlocks eslint 9, removes all npm warnings)

### Next 5 Immediate Actions (in Order)
1. Set Vercel env vars (manual, Vercel dashboard)
2. Run Asia/LatAm DB seeding (HTTP call with secret)
3. Resubmit sitemap in Google Search Console
4. Migrate Moltbot pages to `buildLocalizedAlternates()` — write a batch script
5. OpenClaw Batch 2 — create 5 new pages using the template in §5

---

> **Every Agent Must Remember**: Read this document fully before the first action.
> Update Session Log + Open Tasks after every session.
> Never build with errors. Never push red code.
> Goal: ClawGuru = #1 Security Check Platform for Self-Hosted Infrastructure worldwide.

### Marktposition (April 2026)

| Aspekt | Aktuell | Ziel |
|--------|---------|------|
| Indexierte Seiten | ~2.000 URLs | 1.000.000+ URLs |
| Aktive Staedte (Geo) | 123 Staedte | 500+ Staedte |
| Sprachen | 15 | 15 (fertig) |
| Content-Cluster | Moltbot(21), OpenClaw(10), Solutions(5), Compare(5) | 50+ Cluster |
| Monatliche Besucher | Aufbauphase | 500.000+ Unique Visitors |

---

## 1. PRODUKT-UEBERBLICK (Was ist ClawGuru?)

**ClawGuru** ist eine spezialisierte Security-Check- und Compliance-Plattform fuer:
- **Moltbot**: AI-gesteuertes Bot- und Ops-Framework (Self-Hosted)
- **OpenClaw**: Open-Source Security Framework fuer Self-Hosted Infrastrukturen
- **AI Agents**: Security-Checks fuer autonome Agenten und Automatisierungen

### Kernprodukte

| Produkt | URL | Beschreibung |
|---------|-----|--------------|
| Security Check | /securitycheck | HTTP-Header-Scan, Security-Score, Echtzeit-Analyse |
| Runbooks | /runbooks | 600+ executable Security-Playbooks |
| Oracle | /oracle | AI-gestuetzte Threat Intelligence |
| Neuro AI | /neuro | Pattern-Analyse, Anomalie-Erkennung |
| Dashboard | /dashboard | Kundendaten, Tool-Executions, Mycelium |
| Copilot | /copilot | AI-Assistent fuer Security-Fragen |

### Trust-Anker (IMMER auf jeder Content-Page verwenden!)
```
"Not a Pentest" — Dieser Guide/Check dient der Absicherung eigener Systeme. Keine Angriffswerkzeuge.
```
Dieses Framing ist unser staerkster SEO+Trust-Differentiator. JSX-Snippet:
```tsx
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
  <strong>"Not a Pentest" Trust-Anker</strong>: [Kontext-Satz]. Keine Angriffswerkzeuge.
</div>
```

---

## 2. TECHNISCHE ARCHITEKTUR

### Tech Stack
- **Framework**: Next.js 14 (App Router), TypeScript strict
- **Datenbank**: PostgreSQL via Supabase (lib/db.ts -> dbQuery())
- **Cache/Rate-Limit**: Upstash Redis (lib/rate-limit.ts)
- **Deployment**: Vercel (automatisch bei git push zu main)
- **Domain**: clawguru.org

### Routing-Muster
```
app/[lang]/[topic]/page.tsx              Locale-aware Topic Pages
app/[lang]/moltbot/[slug]/page.tsx       Moltbot Security Topics
app/[lang]/openclaw/[slug]/page.tsx      OpenClaw Framework Topics
app/[lang]/solutions/[slug]/page.tsx     Enterprise Solutions
app/[lang]/[tool-a]-vs-[tool-b]/page.tsx Comparison Pages
app/api/geo/[expansion]/route.ts         Geo Expansion API (auth required)
app/sitemaps/[name]/route.ts             Sitemap Generation
```

### Unterstuetzte Sprachen (15) — ALLE Pages muessen hreflang fuer alle 15 haben
```
de, en, es, fr, pt, it, ru, zh, ja, ko, ar, hi, tr, pl, nl
```

### Wichtige Datenbank-Tabellen

| Tabelle | Zweck |
|---------|-------|
| geo_cities | Aktive Staedte (slug, name_de, name_en, country_code, priority, quality) |
| geo_variant_matrix | Geo-Varianten (locale, base_slug, city_slug, quality_score) |
| runbook_executions | Tool-Runs pro Kunde |
| threats | Security-Events pro Kunde (tenant-scoped via customer_id) |
| mycelium_nodes | Mycelium-Graph-Nodes pro Kunde |
| customer_entitlements | Abo-Status (explorer/pro/team) |
| audit_log | Compliance-Audit-Trail |

### Auth-Regeln (NIEMALS vergessen!)
- Alle /api/admin/* -> verifyAdminToken() PFLICHT
- Geo-Expansion-Endpunkte -> GEO_EXPANSION_SECRET im Authorization-Header
- /api/auth/activate + /api/auth/recover -> Edge Rate-Limit 5 req/min
- /api/copilot -> Rate-Limit 10 req/min per IP
- Alle Dashboard-Calls -> Auth Cookie + Plan-Check

---

## 3. SEO-STRATEGIE (Market Leadership)

### Keyword-Cluster (Prioritaet A — monatliches Suchvolumen hoch)

| Cluster | Haupt-Keywords | Ziel-Pages |
|---------|---------------|------------|
| Moltbot Security | "moltbot hardening", "moltbot [topic] 2024" | app/[lang]/moltbot/ |
| OpenClaw Framework | "openclaw security", "openclaw self-hosted" | app/[lang]/openclaw/ |
| Compliance | "nis2 compliance", "soc2 automation", "gdpr setup" | app/[lang]/solutions/ |
| Vergleiche | "openclaw vs snyk", "clawguru vs wiz" | app/[lang]/[a]-vs-[b]/ |
| Geo + Security | "security check [city]", "[city] cybersecurity" | app/[lang]/[city]/ |
| Security Basics | "zero trust", "devsecops", "kubernetes security" | app/[lang]/[slug]/ |

### Content-Qualitaetsstandards (Q85+ fuer Indexierung)

Jede neue Content-Page MUSS haben:
1. generateMetadata() mit title, description (150-160z), keywords, openGraph, alternates (canonical + hreflang 15 Sprachen)
2. notFound() fuer unbekannte Sprachen
3. "Not a Pentest" Trust-Anker-Banner ganz oben
4. H1 mit Haupt-Keyword
5. Mindestens 2 Code-Beispiele ODER Tabellen (zeigt Expertise)
6. Interne Links zu /securitycheck, /runbooks, /oracle
7. Kein TypeScript Build-Fehler (Exit Code 0)

### Interne Verlinkung (JEDE Page)
```
Moltbot-Pages:   -> /securitycheck, /runbooks, /oracle
OpenClaw-Pages:  -> /openclaw, /securitycheck, /runbooks
Solutions-Pages: -> /securitycheck, /runbooks, /pricing
Compare-Pages:   -> /openclaw ODER /securitycheck
Geo-Pages:       -> /securitycheck, /runbooks (city-aware)
```

### Sitemap-Konfiguration
- Sitemap-Pool: 150 Staedte, taegliche Rotation
- Sitemap-Limit: GEO_MATRIX_SITEMAP_CITY_LIMIT=50 (Vercel Env-Var setzen!)
- Sitemap-Route: app/sitemaps/[name]/route.ts
- Nach jeder Geo-Expansion: revalidateTag("geo-cities-active")

---

## 4. GEO-EXPANSION ROADMAP

### Aktueller Stand (07.04.2026) — 123 aktive Staedte

| Region | Anzahl | Staedte (Beispiele) | Status |
|--------|--------|---------------------|--------|
| DACH | 20 | Berlin, Muenchen, Wien, Zuerich, Hamburg... | Stable Q85+ |
| Europa West | 15 | Paris, London, Amsterdam, Madrid, Lissabon... | Stable Q85+ |
| CEE/Balkan (D4) | 9 | Budapest, Bukarest, Sofia, Athen, Zagreb... | Stable Q85+ |
| Nordics | 7 | Kopenhagen, Stockholm, Oslo, Helsinki... | Stable Q85+ |
| China | 4 | Beijing(95), Shanghai(94), Guangzhou(88), Shenzhen(89) | Stable Q85+ |
| USA | 10 | LA, Chicago, Houston, Dallas, Seattle, Austin... | Stable Q85+ |
| Indien | 8 | Mumbai, Delhi, Bangalore, Hyderabad, Chennai... | Stable Q85+ |
| Russland | 5 | Moskau, St. Petersburg, Nowosibirsk... | Stable Q85+ |
| Japan | 5 | Tokyo, Osaka, Yokohama, Nagoya, Sapporo | SEEDED, DB-Seed pending |
| Suedkorea | 5 | Seoul, Busan, Incheon, Daegu, Daejeon | SEEDED, DB-Seed pending |
| Brasilien | 5 | Sao Paulo, Rio, Brasilia, Belo Horizonte, Curitiba | SEEDED, DB-Seed pending |
| Mexiko | 5 | Mexiko-Stadt, Guadalajara, Monterrey, Puebla... | SEEDED, DB-Seed pending |
| Suedostasien | 7 | Bangkok, Singapur, Jakarta, Manila, Ho Chi Minh... | SEEDED, DB-Seed pending |

### AUSSTEHEND: Production DB-Seeding fuer Asia/LatAm
Diese 27 Staedte sind im Code (lib/geo-matrix.ts SEEDED_CITY_SLUGS), aber NICHT in der DB.
Nach Deployment aufrufen:
```
GET https://clawguru.org/api/geo/asia-latam-expansion?stable=1
Authorization: Bearer [GEO_EXPANSION_SECRET aus Vercel Env]
```

### Naechste Geo-Wellen (geplant)

| Welle | Region | Staedte | Neuer Endpoint zu erstellen |
|-------|--------|---------|---------------------------|
| Q2/2026 | Afrika | Kairo, Lagos, Nairobi, Johannesburg, Casablanca (5+) | /api/geo/africa-expansion |
| Q2/2026 | Mittlerer Osten | Dubai, Istanbul, Riad, Tel Aviv (4+) | /api/geo/mea-expansion |
| Q3/2026 | Ozeanien | Sydney, Melbourne, Auckland, Brisbane (4+) | /api/geo/oceania-expansion |
| Q3/2026 | LatAm+ | Buenos Aires, Bogota, Lima, Santiago (4+) | /api/geo/latam-plus-expansion |

### Geo-Expansion API-Muster (so funktioniert es)
1. Datei anlegen: app/api/geo/[region]-expansion/route.ts
2. Muster von asia-latam-expansion/route.ts kopieren
3. EXPANSION_CITIES[] definieren: alle mit quality >= 85
4. SEEDED_CITY_SLUGS in lib/geo-matrix.ts ergaenzen
5. npm run build (Exit 0 pruefen)
6. git commit + push
7. Nach Deployment: erst ?stable=0 (canary), dann ?stable=1

---

## 5. CONTENT-ERSTELLUNGS-PLAYBOOK

### Neue Content-Page anlegen (Step-by-Step)

**Schritt 1: Datei anlegen (PowerShell)**
```powershell
New-Item -ItemType File -Force "app/[lang]/[kategorie]/[slug]/page.tsx"
```

**Schritt 2: Standard-Template**
```tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps { params: { lang: string }; }
const LANGS = ['de','en','es','fr','pt','it','ru','zh','ja','ko','ar','hi','tr','pl','nl'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  return {
    title: '[Haupt-Keyword]: [Beschreibung] 2024',
    description: '[150-160 Zeichen. Keyword-reich. Nutzen klar.]',
    keywords: ['keyword1','keyword2','keyword3'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: { title: '...', description: '...', type: 'article',
      url: `https://clawguru.org/${lang}/[path]` },
    alternates: {
      canonical: `https://clawguru.org/${lang}/[path]`,
      languages: Object.fromEntries(LANGS.map(l => [l, `https://clawguru.org/${l}/[path]`]))
    },
    robots: 'index, follow',
  };
}

export default function [ComponentName]({ params }: PageProps) {
  const { lang } = params;
  if (!LANGS.includes(lang)) notFound();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm">
          <strong>"Not a Pentest" Trust-Anker</strong>: [Kontext]. Keine Angriffswerkzeuge.
        </div>
        <h1 className="text-4xl font-bold mb-4">[H1 mit Haupt-Keyword]</h1>
        <p className="text-lg text-gray-600 mb-8">[Intro-Text mit Haupt-Keyword]</p>
        {/* Min. 2 Sektionen mit Code/Tabelle + interne Links */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">[H2]</h2>
          {/* Content */}
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Weiterfuehrende Ressourcen</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/securitycheck" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
              <div className="font-semibold text-blue-600">Security Check</div>
              <div className="text-sm text-gray-600">[Beschreibung]</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
```

**Schritt 3: Build-Test (PFLICHT vor jedem Commit!)**
```powershell
npm run build 2>&1 | Select-Object -Last 15
# Exit code MUSS 0 sein. Bei Fehler: fixen, NICHT pushen!
```

**Schritt 4: Commit**
```powershell
git add -A
git commit -m "feat: [beschreibung]"
git push
# Bei Push-Fehler (remote ahead):
git pull --rebase
# Conflicts loesen: git checkout --theirs [datei] (bei rebase = eigene commits)
# git add [geloeste-dateien]
# git rebase --continue
# git push
```

---

## 5. SEO KRISIS-RECOVERY PLAN (08.04.2026)

### **PROBLEM: 0 Views/Klicks in Search Console**
**Ursache**: Nur 2 von 15 Sprachen in Sitemap Index!

### **Current Status (08.04.2026 - NACH Fix):**
- **Sitemap Index**: 271 Child-Sitemaps (statt 37!)
- **Aktive Sprachen**: Alle 15 Sprachen aktiviert! 
- **Sitemap Sprachen**: `de,en,es,fr,pt,it,ru,zh,ja,ko,ar,hi,tr,pl,nl` 
- **Main Pages**: 15 × 27 URLs = 405 URLs (statt 64)
- **Total URLs**: ~4.600+ (statt 2.000)
- **Hreflang**: 15 Sprachen in HTML (korrekt)
- **Robots.txt**: Korrekt
- **Africa Expansion**: Completed (stable) - alle Städte seeded

### **Environment Variables Fix:**
```env
# VORHER (nur 2 Sprachen)
SITEMAP_100K_LOCALES = "de,en"

# NACHHER (alle 15 Sprachen)
SITEMAP_100K_LOCALES = "de,en,es,fr,pt,it,ru,zh,ja,ko,ar,hi,tr,pl,nl"
```

### **Erwartete Ergebnisse nach Fix:**
- **+2.600 URLs** in Sitemap Index
- **+78 Runbook Buckets** (13 × 6)
- **+26 Geo-Runbook Sitemaps** (13 × 2)
- **Total URLs**: ~4.600+ (statt 2.000)

### **Recovery Timeline:**
- **Day 0**: Deploy + Sitemap Resubmission
- **Day 1-3**: Google crawlt neue Sitemaps
- **Day 4-7**: Erste Indexierung neuer URLs
- **Day 8-14**: Stabile Impressions/Klicks

### **Monitoring KPIs:**
- **Search Console**: Pages indexed rising from ~2.000 to ~4.600
- **Impressions**: Should rise from 0 to 100+ within 7 days
- **Clicks**: Should rise from 0 to 10+ within 14 days
- **Coverage**: No "Submitted URL not found" errors

### **Rollback Plan:**
If performance issues occur:
```env
# Temporary rollback (top 5 languages only)
SITEMAP_100K_LOCALES = "de,en,es,fr,pt"
```

### **Next Steps nach Recovery:**
1. **Oceania Expansion** (Sydney, Melbourne, Auckland, Brisbane)
2. **Performance Monitoring** (Sitemap load times < 2s)
3. **Quality Assurance** (no duplicate/thin content)
4. **Search Console Optimization** (International Targeting)

---

## 6. TYPESCRIPT ANTI-PATTERNS (Bekannte Fallstricke)

### FALLSTRICK 1: Shell-Variablen in Template-Literals -> Build-Fehler!
```
FALSCH: <pre>{`DB_URL="${DATABASE_URL}"`}</pre>
  -> TypeScript versucht ${DATABASE_URL} als JS-Expression zu parsen -> Fehler

RICHTIG: <pre>{`DB_URL="$DATABASE_URL"`}</pre>
  -> $VAR ohne {} ist valid in Bash UND kein TS-Template-Expression
```

### FALLSTRICK 2: Unescaped > in JSX-Text-Nodes
```
FALSCH: <p>Budget >$100k</p>  -> JSX-Parser-Fehler

RICHTIG: <p>Budget &gt;$100k</p>
ODER in JS-Arrays ist >$100k als String OK (kein JSX-Node)
```

### FALLSTRICK 3: asChild Prop auf Button-Komponente
```
FALSCH: <Button asChild><Link href="...">Text</Link></Button>
  -> Unsere Button-Komponente (components/ui/button.tsx) unterstuetzt kein asChild

RICHTIG: <Button><Link href="...">Text</Link></Button>
```

### FALLSTRICK 4: id-Prop auf TabsContent
```
FALSCH: <TabsContent value="tab" id="tab">  -> TabsContent akzeptiert kein id

RICHTIG: <TabsContent value="tab">
```

### FALLSTRICK 5: ${{ in Template-Literals (GitHub Actions YAML)
```
FALSCH: `run: docker build -t app:${{ github.sha }}`
  -> ${{ wird als Template-Expression-Start geparst

RICHTIG: `run: docker build -t app:COMMIT_SHA`
  -> Platzhalter + Hinweis-Kommentar verwenden
```

### FALLSTRICK 6: > und < in JSX-Array-Strings (safe!)
```
Diese sind SICHER in JS-Array-Strings die via .map() gerendert werden:
{ value: 'Score >85' }  // Kein Problem, ist kein JSX-Node
```

---

## 7. SEITEN-VERZEICHNIS (Stand 07.04.2026)

### Moltbot-Pages (21 Seiten in app/[lang]/moltbot/)

| Slug | Thema | Status |
|------|-------|--------|
| security-framework | Gesamt-Framework | Live |
| api-security-protection | API-Absicherung | Live |
| authentication-oauth2-jwt | Auth + JWT + MFA | Live |
| hardening-guide-2024 | Hardening-Checkliste | Live |
| network-security-firewall | Netzwerk + iptables | Live |
| threat-detection-setup | Falco + Prometheus | Live |
| logging-auditing-compliance | Logs + GDPR | Live |
| container-security-docker-kubernetes | Docker + K8s | Live |
| database-security-encryption | DB-Sicherheit | Live |
| incident-response-automation | IR + Playbooks | Live |
| zero-trust-architecture | ZTA + RBAC | Live |
| devsecops-pipeline | CI/CD Security | Live |
| backup-recovery-disaster-recovery | Backup + DR | Live |
| vulnerability-scanning | Trivy + Renovate | Live |
| ssl-tls-management | TLS + Zertifikate | Live |
| api-gateway-security | Kong Gateway | Live |
| monitoring-dashboards | Prometheus + Grafana | Live |
| compliance-gdpr-setup | GDPR Consent | Live |
| secrets-vault-management | HashiCorp Vault | Live |
| nis2-compliance-setup | NIS2 Art. 21 | Live |
| cloud-security-posture-management | CSPM + AWS | Live |

### Moltbot Batch 3 (8 Seiten — IN PROGRESS)

| Slug | Thema | Status |
|------|-------|--------|
| identity-governance-iam | IAM/RBAC | Pending |
| data-loss-prevention | DLP | Pending |
| security-automation-workflows | Webhooks + Automation | Pending |
| cryptography-encryption-guide | Kryptografie | Pending |
| api-rate-limiting-advanced | Advanced Rate Limiting | Pending |
| runtime-protection-rasp | RASP | Pending |
| security-posture-score | Security Score | Pending |
| cloud-native-security | Cloud-Native | Pending |

### OpenClaw-Pages (10 Seiten in app/[lang]/openclaw/)

| Slug | Status |
|------|--------|
| self-hosted-security-checklist | Live |
| docker-swarm-hardening | Live |
| reverse-proxy-security | Live |
| firewall-configuration-guide | Live |
| security-headers-guide | Live |
| intrusion-detection-setup | Live |
| server-hardening-checklist | Live |
| database-access-control | Live |
| audit-logging-setup | Live |
| supply-chain-security | Live |

### OpenClaw Batch 2 (5 Seiten — PENDING)

| Slug | Thema |
|------|-------|
| service-mesh-security | Istio/Linkerd |
| waf-configuration | Web Application Firewall |
| cicd-security-pipeline | GitLab CI Security |
| secrets-rotation-automation | Automated Rotation |
| microservices-security | Microservice Patterns |

### Solutions-Pages (app/[lang]/solutions/)

| Slug | Status |
|------|--------|
| soc2-compliance-automation | Live |
| kubernetes-security-hardening | Live |
| aws-security-architecture | Live |
| startup-security-foundation | Live |
| enterprise-siem-integration | Live |

### Solutions Batch 2 (PENDING)

| Slug | Thema |
|------|-------|
| iso27001-certification-roadmap | ISO27001 |
| pci-dss-compliance | PCI-DSS |
| hipaa-security-controls | HIPAA |
| azure-security-architecture | Azure |
| gcp-security-architecture | Google Cloud |

### Compare-Pages (app/[lang]/[a]-vs-[b]/)

| Page | Status |
|------|--------|
| openclaw-vs-snyk | Live |
| openclaw-vs-semgrep | Live |
| clawguru-vs-wiz | Live |
| openclaw-vs-sonarqube | Live |
| moltbot-vs-opsgenie | Live |
| moltbot-vs-clawbot/security-comparison | Live |

### Compare Batch 2 (PENDING)

| Page | Keywords |
|------|---------|
| clawguru-vs-crowdstrike | clawguru vs crowdstrike |
| clawguru-vs-datadog | clawguru vs datadog security |
| openclaw-vs-falco | openclaw vs falco runtime |
| clawguru-vs-lacework | clawguru vs lacework |
| moltbot-vs-pagerduty | moltbot vs pagerduty |

---

## 8. CONTENT-ROADMAP (Naechste 90 Tage)

### Sprint 1 — April 2026: Content-Cluster vervollstaendigen

| Task | Ziel | Prioritaet |
|------|------|------------|
| Moltbot Batch 3 (8 Pages) | IAM, DLP, RASP, Automation, Crypto... | HOCH |
| OpenClaw Batch 2 (5 Pages) | Service Mesh, WAF, CI/CD, Secrets Rotation | HOCH |
| Compare Batch 2 (5 Pages) | vs-crowdstrike, vs-datadog, vs-falco... | HOCH |
| Solutions Batch 2 (3 Pages) | ISO27001, PCI-DSS, HIPAA | MITTEL |
| Asia/LatAm DB-Seeding | /api/geo/asia-latam-expansion?stable=1 | KRITISCH |

### Sprint 2 — Mai 2026: Geo-Scale-Up

| Task | Details | Prioritaet |
|------|---------|------------|
| Afrika-Expansion | /api/geo/africa-expansion (5+ Staedte) | HOCH |
| MEA-Expansion | /api/geo/mea-expansion (4+ Staedte) | HOCH |
| Sitemap-Pool erhoehen | GEO_MATRIX_SITEMAP_CITY_POOL=240 | MITTEL |
| Vercel Env-Var setzen | GEO_MATRIX_SITEMAP_CITY_LIMIT=50 | KRITISCH |

### Sprint 3 — Juni 2026: Runbook-Expansion

| Task | Details |
|------|---------|
| 10 neue Base-Runbooks | PCI-DSS, HIPAA, ISO27001, CIS Controls... |
| Locale-Enrichment Top-50 | translateRunbook() fuer DE/EN/ES/FR/PT |
| City-aware Compliance-Hints | country_code basierte Inhalte |
| Performance-Audit | Core Web Vitals fuer alle Varianten |

### Sprint 4 — Juli 2026: 100.000 URLs Target

| Metric | Berechnung | Ziel |
|--------|------------|------|
| Geo-URLs | 200 Staedte x 15 Sprachen x 10 Runbooks | 30.000 |
| Static Pages | Moltbot+OpenClaw+Solutions+Compare+Guides | 500+ |
| Gesamt indexierbar | | 30.500+ URLs |

---

## 9. KILLERMACHINE V3 — AUTOMATED WAVE PROCESSING

**Standard fuer alle zukuenftigen Geo-Wellen:**

### Auto-Seed-Regeln
- Auto-Seed-Commit wenn eligible_count > 0 UND alle Checks gruen
- Quality-Gate: Matrix-Score >= 85 fuer alle Staedte
- URL-Check: Runbook-URLs geben 200 OK (kein 308/Redirect)
- Trust-Anker: "Not a Pentest" konsistent auf allen Pages
- City-Aware: country_code in geo_variant_matrix vorhanden
- Human-Gate: NUR bei Canary -> Stable Promotion

### Geo-Wellen-Workflow
```
1. Route erstellen: app/api/geo/[region]-expansion/route.ts
2. Staedte definieren: EXPANSION_CITIES[] alle quality >= 85
3. SEEDED_CITY_SLUGS updaten: lib/geo-matrix.ts
4. npm run build (Exit 0 pruefen)
5. Commit + Push
6. Nach Deployment: erst ?stable=0 (canary), dann ?stable=1
7. SEEDED_CITY_SLUGS werden fuer korrekte Geo-Varianten in parseGeoVariantSlug() benoetigt
```

---

## 10. COCKPIT REALISM — VOLLSTAENDIG UMGESETZT (06.04.2026)

Alle Phasen A-D abgeschlossen:
- A1-A5: Daten + Isolation (customer_id, Rate-Limit, Dashboard-Identity)
- B1-B5: Cockpit-UX (keine Fake-Tiles, echte Tool-Runs)
- C1-C4: Produkt-Leistung (echte Deliverables, Entitlements, Stripe-Webhooks)
- D1-D2: Qualitaetssicherung (Playwright Tests, Telemetry)

Migration 010 (customer_entitlements) muss in Prod laufen:
```
npm run db:migrate
ODER: psql $DATABASE_URL -f scripts/db/migrations/010_customer_entitlements.sql
```

---

## 11. SECURITY-ARCHITEKTUR (Schutzstatus)

| Component | Schutz | Status |
|-----------|--------|--------|
| /api/admin/* | verifyAdminToken() | Alle geschuetzt |
| /api/geo/* | GEO_EXPANSION_SECRET | Alle geschuetzt |
| /api/auth/activate | Edge Rate-Limit 5/min | Aktiv |
| /api/auth/recover | Edge Rate-Limit 5/min | Aktiv |
| /api/copilot | Rate-Limit 10/min per IP | Aktiv |
| /api/dashboard/tool-execution | Auth Cookie + Plan | Aktiv |
| Token Deny-List | isTokenDenied() in verifyAccessToken | Aktiv |
| Admin-Panel | verifyAdminToken ueberall | Aktiv |

---

## 12. DEPLOYMENT-WORKFLOW (Immer exakt so!)

```powershell
# 1. Build testen (NIE ueberspringen!)
npm run build 2>&1 | Select-Object -Last 15
# Exit code MUSS 0 sein. Sonst NICHT committen!

# 2. Commit
git add -A
git commit -m "feat/fix/chore: [was wurde gemacht]"

# 3. Push (Vercel deployed automatisch)
git push

# Bei Push-Fehler (remote ahead):
git pull --rebase
# Conflicts loesen: git checkout --theirs [datei] (bei rebase = eigene commits)
# git add [geloeste-dateien]
# git rebase --continue
# git push
```

### Commit-Message-Konventionen
- feat: neue Pages/Features
- feat(geo): Geo-Expansion
- feat(seo): Content-Pages
- fix: Build-Fehler, TypeScript-Fehler, 404-Fixes
- chore: AGENTS.md Update, Dependencies, Config

### NIEMALS pushen bei rotem Build!
Vercel deployed automatisch bei jedem Push zu main. Roter Build = kaputte Website fuer echte User.

---

## 13. KPIs UND ERFOLGSMESSUNG

### SEO KPIs

| Metric | Aktuell | 3-Monatsziel | 12-Monatsziel |
|--------|---------|--------------|---------------|
| Indexierte Seiten | ~2.000 | 30.000+ | 500.000+ |
| Organische Klicks/Mo | Aufbau | 10.000+ | 200.000+ |
| GSC-Impressionen/Mo | Aufbau | 500.000+ | 10.000.000+ |
| Avg. Position Top-Keywords | n/a | Top 10 | Top 3 |
| Backlinks | Aufbau | 500+ | 5.000+ |

### Technische KPIs

| Metric | Ziel |
|--------|------|
| Build Success Rate | 100% |
| Page Quality Score (Q85+) | 95%+ aller URLs |
| Core Web Vitals LCP | unter 2.0s |
| Uptime | 99.9%+ |
| Security Headers Score | A+ (securityheaders.com) |
| SSL Labs Score | A+ |

### Business KPIs

| Metric | Ziel |
|--------|------|
| MRR | Jeder Monat hoeher als Vormonat |
| Explorer -> Pro Conversion | ueber 5% |
| Tool-Executions/Tag | ueber 100 |
| Aktive Kunden | Proportional zu Traffic-Wachstum |

---

---

## 15. TRAFFIC-MASTERPLAN v6 (08.04.2026) — VOLLGAS

### ROOT CAUSE ANALYSE: Warum 0 Views/Klicks

| Problem | Ursache | Status |
|---------|---------|--------|
| Soft 404 `/de/runbooks` | OG-Metadata erbt Root-Layout `og:url=https://clawguru.org` | ✅ GEFIXT 08.04 |
| Sitemap nur `de` Locale | `allLocales=[DEFAULT_LOCALE]` statt `SUPPORTED_LOCALES` | ✅ GEFIXT 08.04 |
| robots.txt blockiert Sitemap-Chunks | `Disallow: */runbooks-*-*.xml` → Google konnte 600+ Pages nie sehen | ✅ GEFIXT 08.04 |
| 435 Moltbot-Pages nicht in Sitemap | `main-{locale}.xml` hatte nur Hub-Pages | ✅ GEFIXT 08.04 |
| 150 OpenClaw-SubPages nicht in Sitemap | Fehlten in `main-{locale}.xml` | ✅ GEFIXT 08.04 |
| 750+ Spezial-Pages nicht in Sitemap | linux-hardening, nginx-hardening etc. fehlten | ✅ GEFIXT 08.04 |
| Locale Home `/de` hatte kein OG | Erbt falsches `og:url=https://clawguru.org` | ✅ GEFIXT 08.04 |
| Build-Fehler (Badge, truncated JSX) | community/guides/resources konnten nicht builden | ✅ GEFIXT 08.04 |

### SITEMAP COVERAGE NACH FIX

| Sitemap | URLs pro Locale | × 15 Sprachen | Total |
|---------|----------------|---------------|-------|
| main-{locale}.xml (Hub-Pages) | 26 | × 15 | 390 |
| main-{locale}.xml (Moltbot-SubPages) | 29 | × 15 | 435 |
| main-{locale}.xml (OpenClaw-SubPages) | 10 | × 15 | 150 |
| main-{locale}.xml (Security-Pages) | 31 | × 15 | 465 |
| main-{locale}.xml (Compare+Guide) | 20 | × 15 | 300 |
| runbooks-{locale}-{bucket}.xml | 500/bucket × 3 buckets | × 15 | 22.500 |
| tags-{locale}-{bucket}.xml | 5 | × 15 | 225 |
| **GESAMT** | | | **~24.465** |

### NAECHSTE PFLICHT-ACTIONS (Nach Deploy 08.04.2026)

**SOFORT (Manual, Vercel Dashboard):**
```
Vercel Env-Vars setzen:
  GEO_MATRIX_SITEMAP=1              # Geo-Runbooks Sitemap aktivieren
  GEO_MATRIX_SITEMAP_CITY_LIMIT=50  # 50 Staedte pro Sitemap
  SITEMAP_ALLOW_CHUNK=1             # robots.txt: Chunks erlauben (redundant nach Fix, aber setzen)
  SITEMAP_BUCKETS=5                 # Alle 5 Buckets (a-f,g-l,m-r,s-z,0-9)
```

**SOFORT (Google Search Console):**
1. `https://clawguru.org/sitemap.xml` → "Testen" + "Neu einreichen"
2. `https://clawguru.org/de/runbooks` → URL-Inspektion → "Indexierung anfragen"
3. `https://clawguru.org/de` → URL-Inspektion → "Indexierung anfragen"
4. `https://clawguru.org/robots.txt` → pruefen ob Sitemap-Chunks nicht mehr geblockt sind

**Asia/LatAm DB-Seeding (Production):**
```
GET https://clawguru.org/api/geo/asia-latam-expansion?stable=1
Authorization: Bearer [GEO_EXPANSION_SECRET aus Vercel Env]
```
→ Aktiviert 27 neue Staedte (Japan, Korea, Brasilien, Mexiko, Suedostasien)

---

### TRAFFIC-GROWTH-ROADMAP Q2/Q3 2026

#### Phase 1: Technische SEO-Basis (08.04. — DONE ✅)
- [x] robots.txt Chunk-Block entfernt
- [x] Sitemap alle 15 Locales
- [x] 1.300+ neue URLs in Sitemap (Moltbot/OpenClaw/Security)
- [x] OG-Metadata Soft-404-Fix
- [x] Build-Fehler behoben

#### Phase 2: Content-Tiefe (NAECHSTE SESSION)
- [ ] **OpenClaw Batch 2** (5 neue SubPages: Service Mesh Security, WAF Rules, CI/CD Security Gate, Microservices Auth, Secrets Rotation)
- [ ] **Moltbot Batch 3** (5 neue SubPages: AI-Agent Threat Model, Real-Time CVE Feed, Bot Security Testing, Compliance Automation, SBOM Generation)
- [ ] **Compare Batch 2** (5 Pages: vs-crowdstrike, vs-datadog, vs-falco, vs-lacework, vs-pagerduty) — hohe SEO-Intent
- [ ] **Solutions Batch 2** (ISO27001-Setup, PCI-DSS-Checklist, HIPAA-Controls) — Enterprise-Traffic
- [ ] Alle Moltbot-Pages: `buildLocalizedAlternates()` statt hardcoded LANGS (x-default hreflang)
- [ ] Schema Markup (FAQ, HowTo, WebPage) auf alle Moltbot/OpenClaw/Security Pages

#### Phase 3: Geo-Traffic-Explosion (Q2/2026)
- [ ] GEO_MATRIX_SITEMAP=1 aktivieren (Vercel Env)
- [ ] Afrika-Expansion: /api/geo/africa-expansion (Kairo, Lagos, Nairobi, Johannesburg, Casablanca)
- [ ] MEA-Expansion: /api/geo/mea-expansion (Dubai, Istanbul, Riad, Tel Aviv)
- [ ] Ozeanien: /api/geo/oceania-expansion (Sydney, Melbourne, Auckland)
- [ ] LatAm+: /api/geo/latam-plus-expansion (Buenos Aires, Bogota, Lima, Santiago)
- [ ] **Ziel: 500+ Staedte × 15 Locales × 8 Runbooks = 60.000 Geo-URLs**

#### Phase 4: Content-Empire (Q3/2026)
- [ ] **250 Moltbot/AI-Agent Pages** (lt. Mycelium Content Architect v3 Plan)
- [ ] Woche 1-4: 25 Seiten/Batch × 10 Batches
- [ ] Automatisierung: Script der neue Pages aus Template generiert
- [ ] **Ziel: 1.000.000+ indexierbare Qualitaetsseiten**

---

### KRITISCHE REGELN FUER TRAFFIC-MAXIMIERUNG

1. **JEDE neue Page MUSS** in `MOLTBOT_SLUGS` / `OPENCLAW_SLUGS` / `SECURITY_SLUGS` in `route.ts` eingetragen werden
2. **JEDE neue Page MUSS** `buildLocalizedAlternates()` verwenden — KEIN hardcoded LANGS Array
3. **JEDE neue Page MUSS** eigenes `openGraph.url` setzen — NIE Root-Layout OG erben lassen
4. **robots.txt** darf NIEMALS Sitemap-XML-Files blocken (`/sitemaps/*.xml`)
5. **Nach jeder Neuen Page**: `npm run build` (Exit 0) → `git push` → Search Console URL pruefen

### SITEMAP-HEALTH-CHECK (Quick-Commands nach Deploy)

```powershell
# Sitemap-Index pruefen (sollte 100+ Eintraege haben)
Invoke-WebRequest "https://clawguru.org/sitemap.xml" | Select-Object -ExpandProperty Content | Select-String -Pattern "<sitemap>" | Measure-Object

# robots.txt pruefen (Sitemap-Chunks duerfen NICHT blocked sein)
Invoke-WebRequest "https://clawguru.org/robots.txt" | Select-Object -ExpandProperty Content

# Einzelne Sitemap pruefen
Invoke-WebRequest "https://clawguru.org/sitemaps/main-de.xml" | Select-Object -ExpandProperty Content | Select-String "<url>" | Measure-Object
```

---

## 14. SESSION-LOG (Immer aktuell halten!)

| Datum | Session | Erledigte Tasks |
|-------|---------|-----------------|
| 06.04.2026 | 1-4 | Security-Audit, Cockpit Realism A-D, Killermachine v3, China+Global Expansion |
| 06.04.2026 | 5 | 1M-Pages-Strategie, Content-Pipeline definiert |
| 07.04.2026 | 6 | Moltbot Batch 1+2 (21 Pages), OpenClaw Batch 1 (10 Pages), Asia/LatAm Geo (27 Staedte), Solutions (5 Pages), Compare (5 Pages), AGENTS.md Master Plan v5 |
| 08.04.2026 | 7 | VOLLANALYSE + Traffic-Masterplan v6: robots.txt Fix (Chunk-Block entfernt), Sitemap 15 Locales, 1300+ neue URLs in Sitemap, OG-Soft-404-Fix fuer /de/runbooks + alle Locale-Homepages, Badge-Komponente, truncated JSX Fix |

### Offene Tasks (Stand 08.04.2026)

- [ ] KRITISCH: Vercel Env setzen: GEO_MATRIX_SITEMAP=1, SITEMAP_BUCKETS=5, GEO_MATRIX_SITEMAP_CITY_LIMIT=50
- [ ] KRITISCH: Asia/LatAm DB-Seeding: GET /api/geo/asia-latam-expansion?stable=1
- [ ] KRITISCH: Search Console: sitemap.xml neu einreichen, /de/runbooks + /de Indexierung anfragen
- [ ] HOCH: Alle Moltbot-Pages auf buildLocalizedAlternates() migrieren (x-default hreflang)
- [ ] HOCH: Schema Markup (FAQ, HowTo) auf alle Content-Pages
- [ ] HOCH: OpenClaw Batch 2 (5 neue Pages)
- [ ] HOCH: Moltbot Batch 3 (5 neue Pages)
- [ ] HOCH: Compare Batch 2 (5 Pages: vs-crowdstrike, vs-datadog etc.)
- [ ] MITTEL: Solutions Batch 2 (ISO27001, PCI-DSS, HIPAA)
- [ ] MITTEL: Afrika + MEA + Ozeanien Geo-Expansion Routes erstellen
- [ ] MITTEL: 250 AI-Agent/Moltbot Pages (Mycelium Content Architect v3)

---

> **JEDER AGENT MERKE**: Lies dieses Dokument vollstaendig vor der ersten Aktion.
> Aktualisiere Session-Log + Offene Tasks nach jeder Session.
> Baue NIE ohne gruenen Build. Pushe NIE roten Code.
> Das Ziel: ClawGuru = #1 Security-Check-Platform fuer Self-Hosted Infrastrukturen weltweit.

```
> **Every Agent Must Remember**: Read this document fully before the first action.
> Update Session Log + Open Tasks after every session.
> Never build with errors. Never push red code.
> Goal: ClawGuru = #1 Security Check Platform for Self-Hosted Infrastructure worldwide.
