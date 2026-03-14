// File: app/api/admin/rebuild/route.ts
// Admin route to trigger a full content rebuild + sitemap refresh manually.
// Secured by admin session cookie – only authenticated admins can call this.

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { BASE_URL } from "@/lib/config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST() {
  const token = (await cookies()).get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  try {
    const { totalSitemapUrls } = await import("@/lib/pseo")
    const { autoHeal } = await import("@/lib/selfhealth")
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
