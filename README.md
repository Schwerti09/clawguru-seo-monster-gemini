# ClawGuru SEO Monster

**Massive PSEO Engine** – 350.000+ echte Seiten mit Next.js 14 + ISR.

## Live
- **Domain**: https://clawguru.org
- **Plattform**: Vercel
- **Seiten**: ~350.000 (on-demand ISR)
- **Sprachen**: 10 (de, en, fr, es, it, nl, pl, ru, zh, ja)

## Architektur
- App Router + `generateStaticParams()`
- Incremental Static Regeneration (ISR)
- Dynamische Runbooks, CVE-Fixes, Tags, Provider-Pages
- Mycelium Visualisierung + AI-Copilot

## Lokales Entwickeln
```bash
npm install
npm run dev
Deployment (Vercel)
Bashnpm run build
Wichtige Config in next.config.js:

ESLint + TypeScript Errors werden ignoriert

Sitemap

Haupt-Index: /sitemap.xml
Unter-Sitemaps: /sitemap/runbooks.xml, /sitemap/solutions.xml usw.

Wichtige Env-Variablen

NEXT_PUBLIC_SITE_URL
DATABASE_URL
NEXTAUTH_SECRET / ACCESS_TOKEN_SECRET
STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
