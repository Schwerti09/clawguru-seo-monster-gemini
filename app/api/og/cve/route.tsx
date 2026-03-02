import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export function GET(req: NextRequest) {
  const cve = req.nextUrl.searchParams.get("cve") || "CVE-XXXX-YYYY"

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0f172a 100%)",
          color: "#ffffff",
          padding: "60px",
          justifyContent: "space-between",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, textTransform: "uppercase", color: "#7dd3fc" }}>
          ClawGuru Security Runbook
        </div>
        <div style={{ fontSize: 72, fontWeight: 800 }}>{cve}</div>
        <div style={{ fontSize: 28, color: "#94a3b8" }}>
          Step-by-step mitigation · Verified fixes · ClawGuru.org
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
