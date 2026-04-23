/**
 * gen-mission-outlines.js
 *
 * Use local Ollama (aya-expanse / qwen / whatever is loaded) to generate
 * structured mission outlines for every track in the Academy ∞ plan.
 * Output lands in lib/academy/missions/_outlines/<track>.json.
 *
 *   Usage:
 *     node scripts/gen-mission-outlines.js                # all 8 tracks
 *     node scripts/gen-mission-outlines.js auth           # single track
 *     node scripts/gen-mission-outlines.js auth compliance
 *
 *   Env:
 *     OLLAMA_URL, OLLAMA_MODEL (same as translate-via-aya.js)
 *     COUNT_PER_TRACK   default 10
 *
 * Outlines are drafts — each gets a human review + expansion into a
 * playable mission file (mission engine format).
 */

const fs = require("fs")
const path = require("path")

const OLLAMA_URL = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "")
const PREFERRED_MODELS = [
  process.env.OLLAMA_MODEL,
  "aya-expanse:8b",
  "aya-expanse:32b",
  "qwen2.5:14b",
  "qwen2.5:3b",
].filter(Boolean)
const COUNT = parseInt(process.env.COUNT_PER_TRACK || "10", 10)

const OUT_DIR = path.join(__dirname, "../lib/academy/missions/_outlines")

const TRACKS = [
  {
    slug: "beginner",
    title: "Foundations",
    theme: "Zero-to-defender fundamentals for self-hosted infrastructure.",
    existingTitles: ["Ship HSTS before the crawler comes", "Lock down SSH before the bots find you", "Firewall: only what you actually need", "TLS in three commands", "Misconfig Hunt — fix the top three"],
  },
  {
    slug: "intermediate",
    title: "Stack Hardening",
    theme: "DevOps-grade hardening across Nginx, Docker, Kubernetes, Proxmox.",
    existingTitles: [],
  },
  {
    slug: "advanced",
    title: "AI Agent Security",
    theme: "Prompt injection, LLM gateways, AI agent sandboxing, EU AI Act.",
    existingTitles: [],
  },
  {
    slug: "auth",
    title: "Auth & Identity",
    theme: "OAuth 2.1, JWT, SSO, Zero-Trust, WebAuthn, passkeys.",
    existingTitles: [],
  },
  {
    slug: "incident-response",
    title: "Incident Response",
    theme: "Detection, triage, containment, forensics, post-mortem.",
    existingTitles: [],
  },
  {
    slug: "compliance",
    title: "Compliance",
    theme: "NIS2, DORA, EU AI Act, GDPR Art. 32 — technical controls only.",
    existingTitles: [],
  },
  {
    slug: "adversarial",
    title: "Adversarial Defense",
    theme: "Red-team-style defensive training: supply chain, social engineering, insider threats.",
    existingTitles: [],
  },
  {
    slug: "story",
    title: "The Hodlberg Campaign",
    theme: "Narrative 12-act campaign defending fictional fintech 'Hodlberg AG' from seed round to IPO.",
    existingTitles: [],
  },
]

// ── Ollama helpers ─────────────────────────────────────────────────────────
async function listModels() {
  const res = await fetch(`${OLLAMA_URL}/api/tags`).catch(() => null)
  if (!res || !res.ok) return []
  const data = await res.json()
  return (data.models || []).map((m) => m.name)
}

async function pickModel() {
  const avail = await listModels()
  if (avail.length === 0) {
    console.error(`[gen] ERROR: Ollama at ${OLLAMA_URL} returned no models.`)
    process.exit(2)
  }
  for (const m of PREFERRED_MODELS) if (avail.includes(m)) return m
  return avail[0]
}

async function chat(model, system, user) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      format: "json",
      options: { temperature: 0.5, num_predict: 6000 },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })
  if (!res.ok) throw new Error(`ollama http ${res.status}`)
  const data = await res.json()
  return (data.message && data.message.content) || ""
}

// ── Prompt templates ───────────────────────────────────────────────────────
function systemPrompt() {
  return [
    `You are a security education designer for the ClawGuru Academy ∞ platform.`,
    `You write mission outlines for an interactive browser-based Linux simulator.`,
    ``,
    `Every mission follows this format:`,
    `- cinematic short title (≤ 60 chars, active voice, specific)`,
    `- one-sentence brief (≤ 140 chars) — what the learner ships`,
    `- 2-3 sentence scenario — the story, the stakes, who the learner is defending`,
    `- 4-6 concrete goals, each 3-8 words, imperative`,
    `- 4-8 simulator commands the learner will actually type (e.g. "cat /etc/ssh/sshd_config", "patch hsts", "ufw enable")`,
    `- integer XP 100..180`,
    `- integer durationMin 4..12`,
    ``,
    `HARD RULES:`,
    `- Only DEFENSIVE content. No attack walkthroughs, no exploit code.`,
    `- Avoid topics already covered — the user will tell you which titles exist.`,
    `- Keep titles tight and specific — not "Learn about X" but "Ship X under pressure".`,
    `- Goals must be verifiable in a simulator (config patched, service reloaded, score improved).`,
    `- Write output in English.`,
    ``,
    `Return JSON: {"missions": [{ "slug": "kebab-case", "title": "...", "brief": "...", "scenario": "...", "goals": [...], "commands": [...], "xp": 120, "durationMin": 6 }, ...] }`,
  ].join("\n")
}

function userPrompt(track, count) {
  const lines = [
    `Track: ${track.title}`,
    `Theme: ${track.theme}`,
    `Generate ${count} mission outlines for this track.`,
    track.existingTitles.length > 0
      ? `Do NOT propose missions that overlap with these existing titles:\n${track.existingTitles.map((t) => `  - ${t}`).join("\n")}`
      : `This track has no missions yet. Design a coherent arc from easy → advanced within the theme.`,
    ``,
    `Return the JSON shape specified in the system message.`,
  ]
  return lines.join("\n")
}

function parse(reply) {
  let obj
  try { obj = JSON.parse(reply) } catch { return null }
  if (!obj || !Array.isArray(obj.missions)) return null
  const valid = []
  for (const m of obj.missions) {
    if (!m || typeof m !== "object") continue
    const slug = String(m.slug || "").trim().replace(/[^a-z0-9-]+/gi, "-").toLowerCase()
    if (!slug) continue
    valid.push({
      slug,
      title: String(m.title || "").slice(0, 120),
      brief: String(m.brief || "").slice(0, 200),
      scenario: String(m.scenario || "").slice(0, 600),
      goals: Array.isArray(m.goals) ? m.goals.map((g) => String(g).slice(0, 120)).slice(0, 8) : [],
      commands: Array.isArray(m.commands) ? m.commands.map((c) => String(c).slice(0, 120)).slice(0, 12) : [],
      xp: clampInt(m.xp, 100, 180, 120),
      durationMin: clampInt(m.durationMin, 4, 12, 6),
    })
  }
  return valid
}
function clampInt(v, min, max, fallback) {
  const n = Math.floor(Number(v))
  if (!Number.isFinite(n)) return fallback
  return Math.max(min, Math.min(max, n))
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
  const argSlugs = process.argv.slice(2)
  const targets = argSlugs.length ? TRACKS.filter((t) => argSlugs.includes(t.slug)) : TRACKS

  console.log(`[gen] Ollama: ${OLLAMA_URL}`)
  const model = await pickModel()
  console.log(`[gen] model: ${model}`)
  console.log(`[gen] tracks: ${targets.map((t) => t.slug).join(", ")}`)
  console.log(`[gen] count per track: ${COUNT}`)

  for (const t of targets) {
    const outFile = path.join(OUT_DIR, `${t.slug}.json`)
    console.log(`\n[${t.slug}] generating ${COUNT} missions…`)
    const t0 = Date.now()
    try {
      const reply = await chat(model, systemPrompt(), userPrompt(t, COUNT))
      const missions = parse(reply)
      if (!missions || missions.length === 0) {
        console.error(`  FAIL — no valid missions parsed. Raw reply head:`)
        console.error(reply.slice(0, 400))
        continue
      }
      fs.writeFileSync(outFile, JSON.stringify({ track: t.slug, generated: new Date().toISOString(), missions }, null, 2) + "\n")
      console.log(`  wrote ${missions.length} → ${path.relative(process.cwd(), outFile)} (${Math.round((Date.now() - t0) / 1000)}s)`)
    } catch (e) {
      console.error(`  FAIL: ${e.message || e}`)
    }
  }

  console.log("\n[gen] done. Review outlines before expanding into full mission files.")
}

main().catch((e) => { console.error(e); process.exit(1) })
