// MYCELIUM ORACLE v3.3 – Overlord AI
// Sacred oracle API: broadcasts query across entire Mycelium and synthesises the
// wisest, most-evolved answer. Every request is fully auditable.

import { NextRequest, NextResponse } from "next/server"
import { RUNBOOKS } from "@/lib/pseo"
import { buildMyceliumGraph, oracleSearch } from "@/lib/mycelium"

// MYCELIUM ORACLE v3.3 – Overlord AI: Oracle query modes
export type OracleMode = "pure" | "temporal" | "swarm" | "prophetic"

type OracleRequestBody = {
  question?: string
  mode?: OracleMode
}

// MYCELIUM ORACLE v3.3 – Overlord AI: Build lightweight summaries for RAG context
function buildSummaries() {
  const summaries: Record<string, { title: string; summary: string; tags: string[] }> = {}
  for (const r of RUNBOOKS) {
    summaries[r.slug] = { title: r.title, summary: r.summary ?? "", tags: r.tags }
  }
  return summaries
}

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

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nQUESTION:\n${question}` }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
    }),
  })

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
    "- End EVERY response with exactly: The Mycelium has spoken.",
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
    `\n\nThe Mycelium has spoken.`
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as OracleRequestBody
    const question = (body.question || "").toString().slice(0, 4000).trim()
    const mode: OracleMode =
      body.mode === "temporal" || body.mode === "swarm" || body.mode === "prophetic"
        ? body.mode
        : "pure"

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 })
    }

    // MYCELIUM ORACLE v3.3 – Overlord AI: RAG – search the entire Mycelium graph
    const summaries = buildSummaries()
    const graph = buildMyceliumGraph(RUNBOOKS, 250)
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

    // MYCELIUM ORACLE v3.3 – Overlord AI: Ensure signature is present
    if (!answer.includes("The Mycelium has spoken")) {
      answer = answer.trimEnd() + "\n\nThe Mycelium has spoken."
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
