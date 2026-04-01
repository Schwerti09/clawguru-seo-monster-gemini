import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-geo-revalidate-secret") ?? ""
  if (!process.env.GEO_REVALIDATE_SECRET || secret !== process.env.GEO_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  let body: { paths?: string[] } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const paths = Array.isArray(body.paths) ? body.paths : []
  for (const p of paths) {
    if (typeof p === "string" && p.startsWith("/")) {
      revalidatePath(p)
    }
  }

  return NextResponse.json({ ok: true, revalidated: paths.length })
}
