// File: app/api/selfhealth/cron/route.ts
// FULL PASSIVE WELTMACHT: canonical self-health cron endpoint.
// Called daily by Netlify Scheduled Function and Vercel Cron.
// Secured by CRON_SECRET – no unauthorised triggering possible.

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export { GET } from "@/app/api/health/cron/route"
