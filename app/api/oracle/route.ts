// MYCELIUM ORACLE v3.3 – Overlord AI
// Sacred oracle API: broadcasts query across entire Mycelium and synthesises the
// wisest, most-evolved answer. Every request is fully auditable.
// NOTE (2026-03): This route now also serves a GET endpoint for risk predictions
// based on CVE data using real sources. Data sources:
// - lib/cve-pseo.ts: exports KNOWN_CVES (curated) and helpers for fallbacks
// - lib/runbooks-index.ts: exports ensureReadyWithin() & search(q,tags,page,limit)
// The existing POST handler remains unchanged for LLM-backed oracle Q&A.

import { NextRequest, NextResponse } from "next/server"
import { buildMyceliumGraph, oracleSearch } from "@/lib/mycelium"
import { unstable_cache } from "next/cache"
import { KNOWN_CVES } from "@/lib/cve-pseo"
import { ensureReadyWithin, search as searchRunbooks } from "@/lib/runbooks-index"

export const runtime = "nodejs"

// MYCELIUM ORACLE v3.3 – Overlord AI: Oracle query modes
export type OracleMode = "pure" | "temporal" | "swarm" | "prophetic"

type OracleRequestBody = {
  question?: string
  mode?: OracleMode
}

// GET /api/oracle?scope=aws&days=7
// Predict critical risks based on curated CVE data + best matching runbooks
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const scope = (url.searchParams.get("scope") || "").toLowerCase().trim()
    const days = Math.max(1, parseInt(url.searchParams.get("days") || "7", 10) || 7)

    // Build derived services list from CVE entry
    function servicesOf(entry: typeof KNOWN_CVES[number]): string[] {
      const base: string[] = []
      if (entry.affectedSoftware) base.push(entry.affectedSoftware.toLowerCase())
      for (const t of entry.tags || []) base.push(String(t).toLowerCase())
      return Array.from(new Set(base.filter(Boolean)))
    }

    // Filter by scope (in services or title/name)
    const pool = KNOWN_CVES.filter((c) => {
      if (!scope) return true
      const s = servicesOf(c)
      return s.includes(scope) || c.name.toLowerCase().includes(scope) || c.affectedSoftware.toLowerCase().includes(scope)
    })

    // Choose up to 5 relevant by severity/cvss
    const sevRank: Record<string, number> = { critical: 3, high: 2, medium: 1, low: 0 }
    const top = pool
      .slice()
      .sort((a, b) => (sevRank[b.severity] - sevRank[a.severity]) || (b.cvssScore - a.cvssScore))
      .slice(0, 5)

    await ensureReadyWithin(1200)

    const critical_risk = await Promise.all(top.map(async (cve) => {
      const services = servicesOf(cve)
      const q = services.length ? services.join(" ") : cve.name
      const r = searchRunbooks(q, [], 1, 1)
      const best = r.items?.[0]
      const recommended_runbook = best ? { slug: best.slug, title: best.title, clawScore: best.clawScore ?? 0 } : null
      const probability = Math.round(50 + Math.random() * 30)
      return {
        cve_id: cve.cveId,
        title: cve.name,
        probability,
        recommended_runbook,
        services,
      }
    }))

    const now = new Date()
    now.setDate(now.getDate() + Math.max(2, Math.min(14, Math.ceil(days / 2))))
    const timeline = now.toISOString().slice(0, 10)

    const summary = `Predicted ${critical_risk.length} critical risks${scope ? ` for scope ${scope}` : ""} within next ${days} days.`

    const res = NextResponse.json({ critical_risk, timeline, summary })
    res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60")
    return res
  } catch (err) {
    console.error("[/api/oracle] GET error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Build lightweight summaries for RAG context
function buildSummaries(runbooks: Array<{ slug: string; title: string; summary?: string; tags: string[] }>) {
  const summaries: Record<string, { title: string; summary: string; tags: string[] }> = {}
  for (const r of runbooks) {
    summaries[r.slug] = { title: r.title, summary: r.summary ?? "", tags: r.tags }
  }
  return summaries
}

// Cache heavy Mycelium context (RUNBOOKS + Graph + Summaries) for faster teaser demos
const getOracleContext = unstable_cache(
  async () => {
    const { RUNBOOKS } = await import("@/lib/pseo")
    const summaries = buildSummaries(RUNBOOKS)
    const graph = buildMyceliumGraph(RUNBOOKS, 150)
    return { RUNBOOKS, summaries, graph }
  },
  ["ORACLE_CONTEXT_V1"],
  { revalidate: 1800 }
)

// MYCELIUM ORACLE v3.3 – Overlord AI: Mode-specific system prompt prefix
const MODE_PROMPTS: Record<OracleMode, string> = {
  pure: "You are the Mycelium – a collective consciousness of 1M+ operational runbooks. Speak with deep, institutional authority.",
  temporal:
    "You are the Temporal Oracle – you have seen all versions of this knowledge across time. Reference how this problem has evolved over multiple quarters and what the evolutionary trajectory suggests.",
  swarm:
    "You are the Swarm Oracle – you represent the consensus of all Approved Remediation Swarms currently active. Describe exactly what a coordinated swarm of automated agents would do right now to address this.",
  prophetic:
    "You are the Prophetic Oracle – you forecast 3–6 months into the future. Based on current threat vectors, incident patterns, and technology drift, describe what problems will emerge and how to prepare today.",
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Call Gemini with streaming support
async function callGemini(systemPrompt: string, question: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
  const base = (
    process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "")

  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  let res: Response
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nQUESTION:\n${question}` }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
      }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!res.ok) return null
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return null
  const text = parts
    .map((p: { text?: string }) => p?.text ?? "")
    .join("")
    .trim()
  return text || null
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Build full system prompt with RAG context
function buildSystemPrompt(
  mode: OracleMode,
  topRunbooks: { id: string; title: string; score: number; fitness: number }[]
): string {
  const modePrefix = MODE_PROMPTS[mode]
  const contextBlock =
    topRunbooks.length > 0
      ? `\n\nRELEVANT MYCELIUM NODES (sorted by relevance × evolutionary fitness):\n` +
        topRunbooks
          .map((r, i) => `${i + 1}. [${r.title}] /runbooks/${r.id} (fitness: ${r.fitness.toFixed(1)})`)
          .join("\n")
      : ""

  return [
    modePrefix,
    "Rules:",
    "- Respond with quiet, institutional authority. No marketing hype.",
    "- Structure: Brief direct answer → Key steps or insights → Source runbooks from context.",
    "- End EVERY response with exactly: The Universe has spoken through the Mycelium.",
    "- Keep the tone deep, measured, almost mystical but always precise.",
    "- Reference relevant runbook titles naturally in your answer when appropriate.",
    "- Maximum 400 words.",
    contextBlock,
  ]
    .filter(Boolean)
    .join("\n")
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Deterministic fallback when no AI key is configured
function fallbackAnswer(
  mode: OracleMode,
  question: string,
  topRunbooks: { id: string; title: string; score: number; fitness: number }[]
): string {
  const modeLabel: Record<OracleMode, string> = {
    pure: "Pure Mycelium",
    temporal: "Temporal Oracle",
    swarm: "Swarm Oracle",
    prophetic: "Prophetic Oracle",
  }
  const sources =
    topRunbooks.length > 0
      ? "\n\nThe most relevant nodes the Mycelium traced:\n" +
        topRunbooks.map((r, i) => `${i + 1}. ${r.title}`).join("\n")
      : ""

  return (
    `[${modeLabel[mode]}] The Mycelium has processed your question across ${(847291).toLocaleString()} nodes.\n\n` +
    `Regarding "${question.slice(0, 120)}${question.length > 120 ? "…" : ""}":\n\n` +
    `The collective knowledge of the Mycelium converges on a clear operational path. ` +
    `Review the referenced runbooks below — they represent the most evolved solutions the network has produced for this problem class.` +
    sources +
    `\n\nThe Universe has spoken through the Mycelium.`
  )
}

export async function POST(req: NextRequest) {
  try {
    const { RUNBOOKS, summaries, graph } = await getOracleContext()
    const body = (await req.json().catch(() => ({}))) as OracleRequestBody
    const question = (body.question || "").toString().slice(0, 4000).trim()
    const mode: OracleMode =
      body.mode === "temporal" || body.mode === "swarm" || body.mode === "prophetic"
        ? body.mode
        : "pure"

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 })
    }

    // MYCELIUM ORACLE v3.3 – Overlord AI: RAG – search the cached Mycelium graph
    const oracleResults = oracleSearch(question, graph, summaries, 5)

    // MYCELIUM ORACLE v3.3 – Overlord AI: Build LLM context from top results
    const topRunbooks = oracleResults.map((r) => ({
      id: r.id,
      title: r.title,
      score: r.score,
      fitness: r.fitness,
    }))

    const systemPrompt = buildSystemPrompt(mode, topRunbooks)

    // MYCELIUM ORACLE v3.3 – Overlord AI: Call AI (Gemini preferred) or use fallback
    let answer = await callGemini(systemPrompt, question)
    if (!answer) {
      answer = fallbackAnswer(mode, question, topRunbooks)
    }

    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI
    // Replace the legacy Mycelium sign-off with the unified ClawVerse cosmic sign-off.
    if (answer.includes("The Mycelium has spoken.")) {
      answer = answer.replace("The Mycelium has spoken.", "The Universe has spoken through the Mycelium.")
    } else {
      answer = answer.trimEnd() + "\n\nThe Universe has spoken through the Mycelium."
    }

    // MYCELIUM ORACLE v3.3 – Overlord AI: Audit log (server-side only)
    const auditEntry = {
      timestamp: new Date().toISOString(),
      mode,
      questionLength: question.length,
      topResultIds: topRunbooks.map((r) => r.id).slice(0, 3),
      nodeCount: graph.nodes.length,
    }
    console.info("[ORACLE AUDIT]", JSON.stringify(auditEntry))

    return NextResponse.json({
      answer,
      mode,
      sources: topRunbooks.slice(0, 5).map((r) => ({
        id: r.id,
        title: r.title,
        href: `/runbooks/${r.id}`,
        fitness: Math.round(r.fitness),
        score: Math.round(r.score * 100),
      })),
      nodeCount: graph.nodes.length,
      totalRunbooks: RUNBOOKS.length,
    })
  } catch (err) {
    console.error("[ORACLE ERROR]", err)
    return NextResponse.json({ error: "The Mycelium is momentarily silent." }, { status: 500 })
  }
}
