import { NextRequest, NextResponse } from "next/server"
import { fetchUpstreamCVEs } from "@/lib/upstream-cve"
import { KNOWN_CVES, getCveEntry, parseCveId } from "@/lib/cve-pseo"
import { generateCveContent } from "@/lib/agents/cve-agent"
import { SUPPORTED_LOCALES, localePrefix, translateRunbook } from "@/lib/i18n"
import { indexUrls } from "@/lib/google-indexer"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const BATCH_SIZE = Number.parseInt(process.env.CVE_INDEX_BATCH_SIZE ?? "200", 10) || 200
const MAX_NEW_CVES = Number.parseInt(process.env.CVE_SYNC_MAX_NEW ?? "20", 10) || 20

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

  const processed: Array<{
    entry: NonNullable<ReturnType<typeof getCveEntry>>
    aiGenerated: boolean
    locales: string[]
  } | null> = []
  const concurrentCveProcessing = 3
  for (let i = 0; i < fresh.length; i += concurrentCveProcessing) {
    const batch = fresh.slice(i, i + concurrentCveProcessing)
    const batchResults = await Promise.all(
      batch.map(async (cveId) => {
        const entry = getCveEntry(cveId)
        if (!entry) return null
        const ai = await generateCveContent(entry).catch((err) => {
          console.error("[sync-cves] generateCveContent", entry.cveId, err instanceof Error ? err.message : err)
          return null
        })
        const translations = await Promise.all(
          SUPPORTED_LOCALES.map((locale) =>
            translateRunbook({ slug: entry.slug, title: entry.name, summary: entry.description, targetLocale: locale })
          )
        )
        return {
          entry,
          aiGenerated: Boolean(ai?.aiGenerated),
          locales: translations.map((t) => t.locale),
        }
      })
    )
    processed.push(...batchResults)
  }

  for (const item of processed.filter((x): x is NonNullable<typeof x> => Boolean(x))) {
    generated.push({
      cveId: item.entry.cveId,
      aiGenerated: item.aiGenerated,
      locales: item.locales,
    })
    for (const locale of SUPPORTED_LOCALES) {
      if (urls.length >= BATCH_SIZE) break
      urls.push(`${BASE_URL}${localePrefix(locale)}/solutions/fix-${item.entry.cveId}`)
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
