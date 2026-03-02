// File: app/api/selfhealth/cron/route.ts
// FULL PASSIVE WELTMACHT: canonical self-health cron endpoint.
// Called daily by Netlify Scheduled Function and Vercel Cron.
// Secured by CRON_SECRET – no unauthorised triggering possible.

export const runtime = "edge"

export { GET, dynamic } from "@/app/api/health/cron/route"
