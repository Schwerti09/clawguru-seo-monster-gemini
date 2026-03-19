import { NextResponse } from "next/server"
import path from "node:path"
import { readFile } from "node:fs/promises"

export const runtime = "nodejs"
export const dynamic = "force-static"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "api", "clawlink.js")
    const js = await readFile(filePath, "utf8")
    return new NextResponse(js, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch (e) {
    const fallback = 
`/*! ClawLink Magic Connector v∞ | (fallback) */
(function(){try{var s=document.currentScript||document.querySelector('script[data-site-id]');var id=s&&s.getAttribute('data-site-id')||'';var el=document.createElement('div');el.id='clawlink-anchor';el.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483647;padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(0,0,0,0.6);color:#00ff9d;font:600 11px/1.2 system-ui,Segoe UI,Arial;box-shadow:0 0 24px rgba(0,255,157,0.08)';el.title='ClawLink Connected';el.textContent='ClawLink ✓';(document.body?document.body:document.documentElement).appendChild(el);}catch(_){}})();`
    return new NextResponse(fallback, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=600, s-maxage=600",
        "X-ClawLink-Fallback": "1",
      },
    })
  }
}
