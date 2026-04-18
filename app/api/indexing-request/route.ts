import { NextRequest, NextResponse } from "next/server"
import { getRequestId } from "@/lib/ops/request-id"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * API Route for manual indexing requests to Google Search Console
 * 
 * POST /api/indexing-request
 * Body: { urls: string[] }
 * 
 * This endpoint returns a list of URLs that should be manually submitted
 * to Google Search Console for indexing. It does NOT perform the actual
 * indexing request - that must be done manually in GSC.
 * 
 * Security: Protected by INDEXING_SECRET env var
 */

export async function POST(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const secret = req.headers.get("x-indexing-secret")
  
  // Security check
  if (secret !== process.env.INDEXING_SECRET) {
    console.error("Indexing request failed: invalid secret", { requestId })
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { urls } = body as { urls?: string[] }

    // Define priority pages for indexing (most important traffic pages)
    const priorityPages = [
      // Core viral pages
      "/de/roast-my-moltbot",
      "/en/roast-my-moltbot",
      "/de/check",
      "/en/check",
      
      // High-value content hubs
      "/de/academy",
      "/en/academy",
      "/de/solutions",
      "/en/solutions",
      "/de/runbooks",
      "/en/runbooks",
      
      // Product pages
      "/de/openclaw",
      "/en/openclaw",
      "/oracle",
      "/neuro",
      
      // Homepage
      "/de",
      "/en",
      "/",
    ]

    // If specific URLs provided, validate them
    if (urls && Array.isArray(urls) && urls.length > 0) {
      const validUrls = urls.filter(url => {
        try {
          new URL(url)
          return true
        } catch {
          return false
        }
      })

      console.log("Indexing request validated", { requestId, count: validUrls.length })

      return NextResponse.json({
        success: true,
        message: "URLs validated for manual indexing in Google Search Console",
        urls: validUrls,
        instructions: "Submit these URLs to Google Search Console > URL Inspection > Request Indexing"
      })
    }

    // Return default priority pages
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
    const fullUrls = priorityPages.map(path => `${baseUrl}${path}`)

    console.log("Indexing request returned priority pages", { requestId, count: fullUrls.length })

    return NextResponse.json({
      success: true,
      message: "Priority pages for manual indexing in Google Search Console",
      urls: fullUrls,
      instructions: "Submit these URLs to Google Search Console > URL Inspection > Request Indexing"
    })

  } catch (error) {
    console.error("Indexing request error", { requestId, error: String(error) })
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}

// GET endpoint returns priority pages without authentication (for reference)
export async function GET(req: NextRequest) {
  const requestId = getRequestId(req.headers)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

  const priorityPages = [
    "/de/roast-my-moltbot",
    "/en/roast-my-moltbot",
    "/de/check",
    "/en/check",
    "/de/academy",
    "/en/academy",
    "/de/solutions",
    "/en/solutions",
    "/de/runbooks",
    "/en/runbooks",
    "/de/openclaw",
    "/en/openclaw",
    "/oracle",
    "/neuro",
    "/de",
    "/en",
    "/",
  ]

  const fullUrls = priorityPages.map(path => `${baseUrl}${path}`)

  console.log("Indexing reference request", { requestId, count: fullUrls.length })

  return NextResponse.json({
    message: "Priority pages for manual indexing in Google Search Console",
    urls: fullUrls,
    instructions: "Use POST with x-indexing-secret header to validate custom URLs"
  })
}
