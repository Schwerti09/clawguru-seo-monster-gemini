import { NextRequest } from "next/server"
import { indexUrls } from "../../../../lib/google-indexer"

export const runtime = "nodejs"

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
    ...init,
  })
}

export async function POST(req: NextRequest) {
  const envToken = process.env.ADMIN_API_TOKEN
  const url = new URL(req.url)
  const token = req.headers.get("x-admin-token") || url.searchParams.get("token") || ""

  if (!envToken) {
    return json({ error: "ADMIN_API_TOKEN is not configured" }, { status: 500 })
  }
  if (token !== envToken) {
    return json({ error: "unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: "invalid JSON" }, { status: 400 })
  }

  const urls = Array.isArray((body as any)?.urls) ? (body as any).urls as unknown[] : null
  if (!urls) {
    return json({ error: "body.urls must be an array" }, { status: 400 })
  }

  const parsed: string[] = []
  for (const u of urls) {
    if (typeof u !== "string") return json({ error: "urls must be strings" }, { status: 400 })
    try {
      const parsedUrl = new URL(u)
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new Error("invalid protocol")
      parsed.push(parsedUrl.toString())
    } catch {
      return json({ error: `invalid URL: ${u}` }, { status: 400 })
    }
  }

  if (parsed.length === 0) return json({ error: "no urls provided" }, { status: 400 })
  if (parsed.length > 200) return json({ error: "too many urls; max 200 per request" }, { status: 429 })

  try {
    const results = await indexUrls(parsed)
    return json({ ok: true, count: parsed.length, results })
  } catch (e) {
    return json({ error: (e as Error)?.message || String(e) }, { status: 500 })
  }
}
