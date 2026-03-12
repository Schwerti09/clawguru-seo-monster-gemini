import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface CheckResult {
  url: string
  ok: boolean
  status?: number
  containsExpected?: boolean
  error?: string
}

async function checkUrl(url: string, expectedContent: string): Promise<CheckResult> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    const text = await res.text()
    return {
      url,
      ok: res.ok,
      status: res.status,
      containsExpected: text.includes(expectedContent),
    }
  } catch (err) {
    return { url, ok: false, error: String(err) }
  }
}

export async function GET(req: Request) {
  const host = req.headers.get("host") ?? "localhost:3000"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  const base = `${protocol}://${host}`

  const [indexResult, runbooksResult] = await Promise.all([
    checkUrl(`${base}/sitemap.xml`, "<sitemapindex"),
    checkUrl(`${base}/sitemap/runbooks.xml`, "<urlset"),
  ])

  // Verify index lists at least one child sitemap
  let indexListsChildSitemap = false
  if (indexResult.ok) {
    try {
      const res = await fetch(`${base}/sitemap.xml`, { cache: "no-store" })
      const text = await res.text()
      indexListsChildSitemap = text.includes("/sitemap/")
    } catch (err) {
      console.error("Failed to verify child sitemap listing:", err)
      // ignore
    }
  }

  const allPassed =
    indexResult.ok &&
    indexResult.containsExpected &&
    runbooksResult.ok &&
    runbooksResult.containsExpected &&
    indexListsChildSitemap

  return NextResponse.json(
    {
      ok: allPassed,
      checks: {
        sitemapIndex: {
          ...indexResult,
          description: "/sitemap.xml must return <sitemapindex>",
        },
        runbooksUrlset: {
          ...runbooksResult,
          description: "/sitemap/runbooks.xml must return <urlset>",
        },
        indexListsChild: {
          ok: indexListsChildSitemap,
          description: "sitemap index must list at least one /sitemap/ child URL",
        },
      },
    },
    { status: allPassed ? 200 : 500 }
  )
}
