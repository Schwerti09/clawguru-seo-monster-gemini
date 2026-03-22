"use client"

import React, { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
type AnalyzeResult = {
  id: string
  title: string
  summary: string
  cvss: number
  severity: Severity
  exploitStatus: "ACTIVE" | "POC" | "NONE"
  affected: string[]
  published: string
  clawScore: number
  recommendedRunbook?: { slug: string; title: string; clawScore: number }
  steps: string[]
  references: string[]
}
type IntelDict = {
  analyzer_header?: string
  analyzer_input_placeholder?: string
  analyzing_label?: string
  analyze_btn?: string
  published_label?: string
  recommended_runbook_label?: string
  link_fix_page?: string
  analyzer_error?: string
}

export default function CveAnalyzer({ prefix = "", dict = {} as IntelDict }: { prefix?: string; dict?: IntelDict }) {
  const reduce = useReducedMotion()
  const [q, setQ] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [res, setRes] = useState<AnalyzeResult | null>(null)
  const df = useMemo(
    () =>
      new Intl.DateTimeFormat(typeof navigator !== "undefined" ? navigator.language : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  )
  const nf = useMemo(
    () =>
      new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-US", {
        maximumFractionDigits: 1,
      }),
    []
  )

  const header = dict.analyzer_header || "CVE Analyzer & Runbook Matcher"
  const placeholder = dict.analyzer_input_placeholder || "CVE ID (e.g. CVE-2024-6387)"
  const analyzing = dict.analyzing_label || "Analyzing…"
  const analyzeBtn = dict.analyze_btn || "Analyze"
  const publishedLabel = dict.published_label || "Published"
  const recLabel = dict.recommended_runbook_label || "Recommended Runbook"
  const linkFix = dict.link_fix_page || "Fix page"

  async function onAnalyze() {
    const id = q.trim().toUpperCase()
    if (!id) return
    setBusy(true)
    setErr(null)
    setRes(null)
    try {
      const u = new URL("/api/intel", window.location.origin)
      u.searchParams.set("op", "analyze")
      u.searchParams.set("id", id)
      const r = await fetch(u.toString(), { cache: "no-store" })
      if (!r.ok) throw new Error(String(r.status))
      const j = (await r.json()) as AnalyzeResult
      setRes(j)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : dict.analyzer_error || "Analyzer load error")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4">
      <div className="text-sm font-semibold text-white mb-3">{header}</div>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="cve-input">CVE ID</label>
        <input
          id="cve-input"
          value={q}
          onChange={(e) => setQ(e.target.value.slice(0, 64))}
          onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
          placeholder={placeholder}
          className="flex-1 rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-400/40"
        />
        <motion.button
          whileTap={reduce ? undefined : { scale: 0.98 }}
          disabled={busy}
          onClick={onAnalyze}
          className="px-3 py-2 rounded-lg text-xs font-bold border border-cyan-500/40 bg-cyan-500/20 text-cyan-100 hover:shadow-[0_0_30px_rgba(0,184,255,0.35)] disabled:opacity-50"
        >
          {busy ? analyzing : analyzeBtn}
        </motion.button>
      </div>

      {!res && !err && busy && <div className="mt-4 h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse" />}
      {err && <div className="mt-3 text-xs text-red-300">{err}</div>}

      {res && (
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-white font-semibold">{res.title}</div>
              <div className="text-xs text-gray-400">{publishedLabel}: {df.format(new Date(res.published))}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2 py-[2px] rounded-full border ${
                res.severity === "CRITICAL" ? "border-red-500/40 text-red-300" :
                res.severity === "HIGH" ? "border-orange-500/40 text-orange-300" :
                res.severity === "MEDIUM" ? "border-yellow-500/40 text-yellow-200" : "border-green-500/40 text-green-300"
              }`}>{res.severity}</span>
              <span className="text-[11px] px-2 py-[2px] rounded-full border border-cyan-500/40 text-cyan-200">CVSS {nf.format(res.cvss)}</span>
              <span className="text-[11px] px-2 py-[2px] rounded-full border border-emerald-500/40 text-emerald-200">ClawScore {res.clawScore}</span>
            </div>
          </div>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{res.summary}</p>
          {res.affected?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {res.affected.map((a) => (
                <span key={a} className="px-2 py-0.5 rounded-full text-[11px] border border-white/10 text-gray-300">{a}</span>
              ))}
            </div>
          )}
          {res.steps?.length > 0 && (
            <ol className="list-decimal pl-5 text-sm text-gray-200 space-y-1">
              {res.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}
          <div className="flex flex-wrap gap-2">
            {res.recommendedRunbook && (
              <>
                <a
                  href={`${prefix}/runbook/${res.recommendedRunbook.slug}`.replace(/\/\//g, "/")}
                  className="px-3 py-2 rounded-lg text-xs font-bold border border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                >
                  {recLabel}
                </a>
                <a
                  href={`${prefix}/runbook/${res.recommendedRunbook.slug}`.replace(/\/\//g, "/")}
                  className="px-3 py-2 rounded-lg text-xs font-bold border border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
                >
                  {dict.link_fix_page || "Fix in 1 Click"}
                </a>
              </>
            )}
            <a
              href={`${prefix}/runbooks`.replace(/\/\//g, "/")}
              className="px-3 py-2 rounded-lg text-xs font-bold border border-white/10 bg-white/5 text-gray-200"
            >
              {linkFix}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
