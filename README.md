# ClawGuru – SaaS + Conversation Mutant (Vercel + Netlify)

**Next.js 14.2.21** pinned (Netlify CVE gate safe), React 18.2.

ClawGuru ist kein „Blog“. Es ist ein Loop:
**Score → Runbook → Fix → Re-Check → Share**.

## Local run
```bash
cp .env.example .env.local
npm install
npm run dev
```

## Deploy

### Automatisches Deployment via GitHub Actions

Nach dem Merge eines PRs in `main` passiert **nichts manuell** – der Deploy läuft automatisch:

1. **CI** (`.github/workflows/ci.yml`) – prüft Build bei jedem PR-Push → Task wird grün.
2. **Deploy** (`.github/workflows/deploy.yml`) – sobald der PR gemergt ist (Push auf `main`), wird automatisch nach Netlify deployed.

**Einmalig in GitHub einrichten (Repository → Settings → Secrets and variables → Actions):**
- `NETLIFY_AUTH_TOKEN` – dein persönlicher Netlify API Token (Netlify → User Settings → Applications → Personal access tokens)
- `NETLIFY_SITE_ID` – deine Site-ID (Netlify → Site → Site configuration → Site ID)

Danach: PR erstellen → warten bis CI grün → mergen → fertig. Kein manuelles Drücken nötig.

---

### Vercel
Repo importieren → Environment Variables setzen → Deploy.

### Netlify (manuell / ohne GitHub Actions)
- Build: `npm run build`
- Publish: `.next`
- Plugin: `@netlify/plugin-nextjs` (in `netlify.toml`)

#### Netlify ENV – bitte exakt so (sonst „klickt nix“)
**Deploy context:** Setz deine Werte unter **Production** (nicht nur „Deploy Previews“).

**Scopes:**
- Alles was bei Klicks/Chats zur Laufzeit gebraucht wird (Stripe/OpenAI/Admin/Webhook) muss mindestens **Functions** haben.
- `NEXT_PUBLIC_SITE_URL` sollte **Builds + Functions + Runtime** haben (damit Links / Redirects immer stimmen).

**„Contains secret values“ ankreuzen bei:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (wenn genutzt)
- `OPENAI_API_KEY` (wenn genutzt)
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `RESEND_API_KEY` (wenn genutzt)

**Stripe Test vs Live:**
Wenn im Stripe Dashboard ein **roter Balken / Test Mode** aktiv ist, kopierst du *Test*-Keys. Für Production brauchst du:
- `STRIPE_SECRET_KEY` muss mit **`sk_live_`** anfangen
- deine Price IDs müssen aus **Live Mode** stammen (bei Test Mode sind es andere Objekte)

Wenn Preview funktioniert, Production aber nicht: in Netlify fehlen fast immer die **Production**-Values oder die **Functions/Runtime**-Scopes.

## Stripe (nur Stripe)

**Pflicht:**
- `STRIPE_SECRET_KEY`
- `ACCESS_TOKEN_SECRET` (signiert den Access-Cookie)

**Prices (bereits vorkonfiguriert):**
- Pro: `price_1SyY02INFtiy8u5xA9v6IeVA`
- Team: `price_1SyY1FINFtiy8u5xGhxFTkEe`
- Day Pass: `price_1SyZiaINFtiy8u5xSuvtlste`

Wenn du willst, kannst du sie via ENV überschreiben:
- `STRIPE_PRICE_PRO`, `STRIPE_PRICE_TEAM`, `STRIPE_PRICE_DAYPASS`

## Wie der Zugang funktioniert (ohne Login)
1) User kauft via Stripe Checkout (`/api/stripe/checkout`)
2) Success Seite zeigt **„Zugriff aktivieren“**
3) `/api/auth/activate` verifiziert die Stripe Session und setzt einen **httpOnly Cookie** (`claw_access`)
4) `/dashboard` ist gated (Subscription-Status wird bei jedem Zugriff via Stripe geprüft)

## Produkte / Dateien
- Free Lead Magnet: `/public/downloads/clawguru-launch-pack.pdf`
- Pro/Team/Daypass Downloads (Placeholder, bitte ersetzen):
  - `/private_downloads/sprint-pack.pdf`
  - `/private_downloads/incident-kit.zip`

## Routen
- `/check` Live Security Check (Badge + Share Loop)
- `/copilot` Runbook Copilot (conversation engine)
- `/dashboard` Pro Area (gated)
- `/pricing` Pläne
- `/api/download?key=sprint-pack|incident-kit` gated download
- `/api/stripe/portal` Billing Portal

## Optional: LLM Copilot
Wenn `GEMINI_API_KEY` gesetzt ist, antwortet Copilot mit Google Gemini.

Optional:
- `GEMINI_MODEL` (Default: `gemini-2.0-flash`)
- `OPENAI_API_KEY` als Fallback, falls du später wieder GPT aktivieren willst.
Ohne Key bleibt er rule-based (kein Crash).


## Programmatic SEO

### Sitemap structure

| URL | Content | Source route |
|-----|---------|-------------|
| `/sitemap.xml` | `<sitemapindex>` listing all child sitemaps | `app/sitemap-index/route.ts` (served via rewrite) |
| `/sitemaps/main.xml` | `<urlset>` – core pages | `app/sitemaps/[name]/route.ts` |
| `/sitemaps/providers.xml` | `<urlset>` – provider pages | same |
| `/sitemaps/runbooks-a-f.xml` … `runbooks-0-9.xml` | `<urlset>` – runbook alphabetical buckets | same |
| `/sitemaps/tags-a-f.xml` … `tags-0-9.xml` | `<urlset>` – tag pages | same |
| `/sitemaps/runbook100k-N.xml` | `<urlset>` – paginated 50k runbooks | same |
| `/sitemaps/i18n-{locale}.xml` | `<urlset>` – localised runbook URLs | same |
| `/sitemaps/issues.xml` | `<urlset>` – issue hub | same |
| `/sitemaps/services.xml` | `<urlset>` – service hub | same |
| `/sitemaps/years.xml` | `<urlset>` – year hub | same |

**Why `sitemap-index` instead of `sitemap.xml` as a folder?**
Next.js 14 App Router reserves the name `sitemap.xml` for its built-in metadata route system.
A folder called `app/sitemap.xml/` causes a routing conflict that makes the custom route handler
invisible to the framework. The fix is to serve the sitemap index from `app/sitemap-index/route.ts`
and add a rewrite rule in `next.config.js` that maps `/sitemap.xml` → `/sitemap-index`.

### Sitemap health check

A runtime verification endpoint is available at `/api/sitemap-health`. It checks that:
- `/sitemap.xml` returns HTTP 200 and contains `<sitemapindex`
- `/sitemaps/main.xml` returns HTTP 200 and contains `<urlset`
- The index lists at least one `/sitemaps/` child URL

Returns `200 { ok: true, checks: … }` on success, `500 { ok: false, checks: … }` on failure.

- Child sitemaps: `/sitemaps/main.xml` + `/sitemaps/runbooks-*.xml`
- Runbook pages: `/runbook/[slug]` (ISR)


### Runbook Factory
- `lib/pseo.ts` generiert aktuell **1000** Runbooks (Provider×Topics + Error×Stack + Config).
- Sitemaps: `/sitemap.xml` (Index), `/sitemaps/runbooks-*.xml`, `/sitemaps/tags-*.xml`.
- Tag Hubs: `/tags` und `/tag/[tag]`.

## Webhook + Recovery (empfohlen)
Damit Nutzer **immer** ihren Zugang bekommen (auch wenn sie den Tab schließen), aktivierst du:
1) **Stripe Webhook** → `/api/stripe/webhook`
   - Stripe Dashboard → Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://DEINE_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Signing secret → als `STRIPE_WEBHOOK_SECRET` in ENV setzen

2) **Email Versand (Resend)**
   - Resend API Key → `RESEND_API_KEY`
   - Absender → `EMAIL_FROM` (Domain in Resend verifizieren)
   - Optional: `EMAIL_REPLY_TO` / `SUPPORT_EMAIL`

Neue Route:
- `/recover` → Recovery-Seite (Magic Link anfordern)
