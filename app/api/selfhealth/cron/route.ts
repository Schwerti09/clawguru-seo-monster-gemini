// File: app/api/selfhealth/cron/route.ts
// FULL PASSIVE WELTMACHT: canonical self-health cron endpoint.
// Called daily by Netlify Scheduled Function and Vercel Cron.
// Secured by CRON_SECRET – no unauthorised triggering possible.

// Declare runtime/dynamic as string literals so Next.js can statically analyse
// them (re-exporting from another module is not recognised by the analyser).
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export { GET } from "@/app/api/health/cron/route"
