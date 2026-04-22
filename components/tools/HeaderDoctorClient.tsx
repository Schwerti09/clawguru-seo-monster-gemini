"use client"

import { useState } from "react"

interface Finding {
  header: string
  status: "good" | "warn" | "bad"
  message: string
  value?: string
  fix?: { nginx?: string; apache?: string; express?: string }
}
interface Result {
  url: string
  finalUrl: string
  status: number
  headers: Record<string, string>
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  findings: Finding[]
}

const gradeColor: Record<Result["grade"], string> = {
  A: "text-emerald-300 border-emerald-400/40 bg-emerald-500/10",
  B: "text-lime-300 border-lime-400/40 bg-lime-500/10",
  C: "text-amber-300 border-amber-400/40 bg-amber-500/10",
  D: "text-orange-300 border-orange-400/40 bg-orange-500/10",
  F: "text-red-300 border-red-400/40 bg-red-500/10",
}
const statusColor: Record<Finding["status"], string> = {
  good: "text-emerald-400",
  warn: "text-amber-400",
  bad: "text-red-400",
}

export function HeaderDoctorClient() {
  const [url, setUrl] = useState("https://")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  async function run(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setResult(null); setLoading(true)
    try {
      const r = await fetch("/api/tools/headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      if (!r.ok) {
        const err = (await r.json().catch(() => ({}))) as { error?: string; detail?: string }
        throw new Error(err.error ?? `http_${r.status}`)
      }
      setResult(await r.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : "request_failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={run} className="flex gap-2 mb-8">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com"
          className="flex-1 bg-white/5 border border-white/10 focus:border-emerald-400/50 rounded-lg px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !url.startsWith("http")}
          className="px-6 py-3 bg-emerald-500 text-black font-black rounded-lg hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Scanning…" : "Scan"}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 text-red-300 text-sm font-mono mb-6">
          {error === "invalid_url" ? "URL invalid — must be public http(s)." : `Error: ${error}`}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`px-4 py-3 rounded-xl border font-mono ${gradeColor[result.grade]}`}>
              <div className="text-xs tracking-widest opacity-70">GRADE</div>
              <div className="text-3xl font-black">{result.grade}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-gray-500 mb-0.5">SCORE</div>
              <div className="text-2xl font-bold text-gray-100">{result.score}/100</div>
            </div>
            <div className="text-xs text-gray-400 font-mono break-all">
              <div>{result.finalUrl}</div>
              <div>HTTP {result.status}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-mono tracking-widest text-cyan-400 mb-3">FINDINGS</h3>
            <ul className="space-y-3">
              {result.findings.map((f, i) => (
                <li key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-start gap-3">
                    <span className={`font-mono shrink-0 ${statusColor[f.status]}`}>
                      {f.status === "good" ? "✓" : f.status === "warn" ? "!" : "✗"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-100 mb-1">{f.header}</div>
                      <p className="text-sm text-gray-300 mb-2">{f.message}</p>
                      {f.value && <div className="text-xs font-mono text-gray-500 break-all mb-2">{f.value}</div>}
                      {f.fix && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-emerald-400 hover:text-emerald-300">Show fix</summary>
                          <div className="mt-2 space-y-2">
                            {f.fix.nginx && (
                              <div>
                                <div className="text-[10px] text-gray-500 mb-1">nginx</div>
                                <pre className="bg-black/50 p-2 rounded text-gray-200 font-mono whitespace-pre-wrap break-all">{f.fix.nginx}</pre>
                              </div>
                            )}
                            {f.fix.apache && (
                              <div>
                                <div className="text-[10px] text-gray-500 mb-1">apache</div>
                                <pre className="bg-black/50 p-2 rounded text-gray-200 font-mono whitespace-pre-wrap break-all">{f.fix.apache}</pre>
                              </div>
                            )}
                            {f.fix.express && (
                              <div>
                                <div className="text-[10px] text-gray-500 mb-1">express</div>
                                <pre className="bg-black/50 p-2 rounded text-gray-200 font-mono whitespace-pre-wrap break-all">{f.fix.express}</pre>
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <details className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <summary className="cursor-pointer text-sm font-mono text-gray-400 hover:text-white">Raw response headers</summary>
            <pre className="mt-3 text-xs font-mono text-gray-400 whitespace-pre-wrap break-all">
              {Object.entries(result.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
