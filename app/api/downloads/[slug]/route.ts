import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export const runtime = "nodejs"

const DOWNLOAD_MAP: Record<string, { filename: string; displayName: string }> = {
  "openclaw-fortress-blueprint-2026": {
    filename: "openclaw-fortress-blueprint-2026.zip",
    displayName: "OpenClaw-Fortress-Blueprint-2026.zip",
  },
  "zero-trust-self-hosting-arsenal-2026": {
    filename: "zero-trust-self-hosting-arsenal-2026.zip",
    displayName: "Zero-Trust-Self-Hosting-Arsenal-2026.zip",
  },
  "moltbot-ai-threat-intelligence-kit-2026": {
    filename: "moltbot-ai-threat-intelligence-kit-2026.zip",
    displayName: "Moltbot-AI-Agent-Threat-Intelligence-Kit-2026.zip",
  },
  "self-hosted-ir-warfare-manual-2026": {
    filename: "self-hosted-ir-warfare-manual-2026.zip",
    displayName: "Self-Hosted-IR-Warfare-Manual-2026.zip",
  },
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const entry = DOWNLOAD_MAP[params.slug]
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const filePath = path.join(process.cwd(), "public", "downloads", entry.filename)

  try {
    await fs.stat(filePath)
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const data = await fs.readFile(filePath)

  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${entry.displayName}"`,
      "Cache-Control": "public, max-age=86400",
      "Content-Length": String(data.length),
    },
  })
}
