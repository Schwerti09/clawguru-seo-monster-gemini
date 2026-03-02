import { NextRequest, NextResponse } from "next/server"
import { fetchUpstreamCVEs } from "@/lib/upstream-cve"
import { KNOWN_CVES, getCveEntry, parseCveId } from "@/lib/cve-pseo"
import { generateCveContent } from "@/lib/agents/cve-agent"
import { SUPPORTED_LOCALES, localePrefix, translateRunbook } from "@/lib/i18n"
import { indexUrls } from "@/lib/google-indexer"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const BATCH_SIZE = 200
const MAX_NEW_CVES = 20

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    const param = req.nextUrl.searchParams.get("secret") ?? ""
    if (auth !== `Bearer ${secret}` && param !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const upstream = await fetchUpstreamCVEs()
  const known = new Set(KNOWN_CVES.map((c) => c.cveId))
  const fresh = upstream
    .map((c) => parseCveId(c.id))
    .filter((id): id is string => Boolean(id))
    .filter((id) => !known.has(id))
    .slice(0, MAX_NEW_CVES)

  const generated: Array<{
    cveId: string
    aiGenerated: boolean
    locales: string[]
  }> = []

  const urls: string[] = []

  for (const cveId of fresh) {
    const entry = getCveEntry(cveId)
    if (!entry) continue
    const ai = await generateCveContent(entry).catch(() => null)
    const translations = await Promise.all(
      SUPPORTED_LOCALES.map((locale) =>
        translateRunbook({ slug: entry.slug, title: entry.name, summary: entry.description, targetLocale: locale })
      )
    )
    generated.push({
      cveId,
      aiGenerated: Boolean(ai?.aiGenerated),
      locales: translations.map((t) => t.locale),
    })
    for (const locale of SUPPORTED_LOCALES) {
      if (urls.length >= BATCH_SIZE) break
      urls.push(`${BASE_URL}${localePrefix(locale)}/solutions/fix-${entry.cveId}`)
    }
  }

  let indexingResults: Awaited<ReturnType<typeof indexUrls>> | null = null
  let indexingError: string | null = null
  if (urls.length > 0) {
    try {
      indexingResults = await indexUrls(urls)
    } catch (err) {
      indexingError = err instanceof Error ? err.message : String(err)
    }
  }

  return NextResponse.json({
    upstreamFetched: upstream.length,
    newCves: fresh,
    generated,
    submitted: urls.length,
    indexingError,
    indexingResults,
    ts: new Date().toISOString(),
  })
}
