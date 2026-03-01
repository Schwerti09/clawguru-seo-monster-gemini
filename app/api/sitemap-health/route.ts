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

  const [indexResult, mainResult] = await Promise.all([
    checkUrl(`${base}/sitemap.xml`, "<sitemapindex"),
    checkUrl(`${base}/sitemaps/main.xml`, "<urlset"),
  ])

  // Verify index lists at least one child sitemap
  let indexListsChildSitemap = false
  if (indexResult.ok) {
    try {
      const res = await fetch(`${base}/sitemap.xml`, { cache: "no-store" })
      const text = await res.text()
      indexListsChildSitemap = text.includes("/sitemaps/")
    } catch (err) {
      console.error("Failed to verify child sitemap listing:", err)
      // ignore
    }
  }

  const allPassed =
    indexResult.ok &&
    indexResult.containsExpected &&
    mainResult.ok &&
    mainResult.containsExpected &&
    indexListsChildSitemap

  return NextResponse.json(
    {
      ok: allPassed,
      checks: {
        sitemapIndex: {
          ...indexResult,
          description: "/sitemap.xml must return <sitemapindex>",
        },
        mainUrlset: {
          ...mainResult,
          description: "/sitemaps/main.xml must return <urlset>",
        },
        indexListsChild: {
          ok: indexListsChildSitemap,
          description: "sitemap index must list at least one /sitemaps/ child URL",
        },
      },
    },
    { status: allPassed ? 200 : 500 }
  )
}
