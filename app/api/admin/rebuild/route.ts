// File: app/api/admin/rebuild/route.ts
// Admin route to trigger a full content rebuild + sitemap refresh manually.
// Secured by admin session cookie – only authenticated admins can call this.

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { autoHeal } from "@/lib/selfhealth"
import { BASE_URL } from "@/lib/config"
import { totalSitemapUrls } from "@/lib/pseo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST() {
  const token = cookies().get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  try {
    // Run autoHeal to regenerate runbook metadata + ping sitemaps
    const healResult = await autoHeal()

    // Warm the sitemap index so Google sees fresh content immediately
    const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`)
    await Promise.allSettled([
      fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
      fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
    ])

    return NextResponse.json({
      ok: true,
      ts: new Date().toISOString(),
      totalSitemapUrls: totalSitemapUrls(),
      heal: healResult,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
