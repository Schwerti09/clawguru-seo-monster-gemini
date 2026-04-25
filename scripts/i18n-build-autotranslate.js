#!/usr/bin/env node
/**
 * i18n-build-autotranslate.js
 *
 * Take the English source strings harvested from every pick() call in the
 * repo and translate each one into the 28 non-de/en locales. Write the
 * result as a TypeScript module that `lib/i18n-pick.ts` imports statically.
 *
 *   Usage:
 *     node --env-file=.env.local scripts/i18n-build-autotranslate.js
 *     node --env-file=.env.local scripts/i18n-build-autotranslate.js sv fi      # only these locales
 *     RESUME=1 node ... scripts/i18n-build-autotranslate.js                      # reuse per-locale checkpoints
 *
 *   Env:
 *     GEMINI_API_KEY   required
 *     GEMINI_MODEL     default gemini-2.5-flash-lite (free-tier friendly)
 *     BATCH_SIZE       default 100 strings per call
 *     INTER_BATCH_MS   default 4500ms (≤15 RPM on free tier)
 *
 * Checkpoints land in lib/i18n-autotranslate/<locale>.json so a crashed or
 * killed run can be resumed without redoing completed locales.
 */

const fs = require("fs")
const path = require("path")

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
].map((k) => (k || "").trim()).filter(Boolean)

if (GEMINI_KEYS.length === 0) {
  console.error("[autotranslate] ERROR: set GEMINI_API_KEY in env.")
  process.exit(1)
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite"
const GEMINI_BASE = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "")
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "100", 10)
const INTER_BATCH_MS = parseInt(process.env.INTER_BATCH_MS || "4500", 10)
const RESUME = process.env.RESUME === "1"

let keyIdx = 0
function nextKey() {
  const k = GEMINI_KEYS[keyIdx % GEMINI_KEYS.length]
  keyIdx++
  return k
}

const SOURCES_FILE = path.join("lib", "i18n-pick-sources.json")
const CHECKPOINT_DIR = path.join("lib", "i18n-autotranslate")
const OUTPUT_FILE = path.join("lib", "i18n-autotranslate.ts")

// 28 non-de/en locales to fill (DE is the source; EN is identity).
const LANG_NAMES = {
  af: "Afrikaans", ar: "Arabic", bg: "Bulgarian", bn: "Bengali", cs: "Czech",
  da: "Danish", el: "Greek", es: "Spanish", fi: "Finnish", fr: "French",
  he: "Hebrew", hi: "Hindi", hu: "Hungarian", id: "Indonesian", it: "Italian",
  ja: "Japanese", ko: "Korean", ms: "Malay", nl: "Dutch",
  no: "Norwegian (Bokmål)", pl: "Polish", pt: "Portuguese (Brazilian)",
  ro: "Romanian", ru: "Russian", sv: "Swedish", th: "Thai", tr: "Turkish",
  uk: "Ukrainian", vi: "Vietnamese", zh: "Chinese (Simplified)",
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

async function callGemini(prompt, attempt = 1) {
  const key = nextKey()
  const url = `${GEMINI_BASE}/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(key)}`
  try {
    const controller = new AbortController()
    const to = setTimeout(() => controller.abort(), 60000)
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 16000,
          responseMimeType: "application/json",
        },
      }),
    })
    clearTimeout(to)
    if (res.status === 429 && attempt <= 6) {
      const delay = Math.min(60000, 15000 * attempt)
      console.warn(`  [429, retry ${attempt}/6] sleeping ${delay}ms`)
      await sleep(delay)
      return callGemini(prompt, attempt + 1)
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`gemini http ${res.status}: ${body.slice(0, 200)}`)
    }
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? ""
  } catch (e) {
    if (attempt <= 3) {
      const delay = 3000 * attempt
      console.warn(`  [retry ${attempt}/3] ${String(e.message || e).slice(0, 100)}`)
      await sleep(delay)
      return callGemini(prompt, attempt + 1)
    }
    throw e
  }
}

function buildPrompt(targetLang, batch) {
  // batch is an array of English source strings; we ask Gemini to return a
  // parallel array keyed by index for exact-match lookup on output.
  const indexed = {}
  batch.forEach((en, i) => { indexed[String(i)] = en })
  return [
    `You are a native speaker of ${targetLang} and a professional translator for a cybersecurity SaaS product called ClawGuru.`,
    `Translate each English source string into ${targetLang}.`,
    ``,
    `INPUT shape:`,
    `  { "<index>": "<English source>" }`,
    ``,
    `RULES:`,
    `- Output JSON: { "translations": { "<index>": "<translation>", ... } } — preserve every key exactly.`,
    `- Keep technical terms as-is: HSTS, TLS, SSH, JWT, CSP, nginx, Docker, Kubernetes, CVE, DevOps, OAuth, SSO, SAML, SaaS, HTTPS, NIS2, DORA, GDPR, ISO 27001, SOC 2.`,
    `- Preserve placeholders exact: {n}, {0}, {name}, %s, %d, $1, {{...}}, URLs, backtick code, HTML tags, emoji, → ←.`,
    `- If the source is a brand token, product name, URL, or pure code identifier, return it unchanged.`,
    `- Tone: modern, sharp, B2B SaaS — not stiff, not casual.`,
    ``,
    `INPUT:`,
    JSON.stringify(indexed, null, 2),
  ].join("\n")
}

function parseReply(reply, batch) {
  let obj
  try { obj = JSON.parse(reply) } catch { return null }
  const t = obj?.translations && typeof obj.translations === "object" ? obj.translations : obj
  if (!t || typeof t !== "object") return null
  const out = new Array(batch.length)
  for (let i = 0; i < batch.length; i++) {
    const v = t[String(i)]
    out[i] = typeof v === "string" && v.length > 0 ? v : batch[i]
  }
  return out
}

async function translateLocale(locale, sources) {
  const langName = LANG_NAMES[locale]
  if (!langName) { console.warn(`[autotranslate] skip ${locale}: no language name`); return {} }

  const ckpt = path.join(CHECKPOINT_DIR, `${locale}.json`)
  let existing = {}
  if (RESUME && fs.existsSync(ckpt)) {
    try { existing = JSON.parse(fs.readFileSync(ckpt, "utf-8")) } catch { existing = {} }
  }
  const todo = sources.filter((s) => typeof existing[s] !== "string")
  console.log(`\n[${locale}] ${langName}: ${todo.length}/${sources.length} to translate${RESUME ? " (resume)" : ""}`)
  if (todo.length === 0) return existing

  const result = { ...existing }
  const total = Math.ceil(todo.length / BATCH_SIZE)
  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE)
    process.stdout.write(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${total} (${batch.length}) ... `)
    const t0 = Date.now()
    let translated
    try {
      const reply = await callGemini(buildPrompt(langName, batch))
      translated = parseReply(reply, batch)
      if (!translated) throw new Error("no_json")
    } catch (e) {
      console.log(`FAIL (${String(e.message || e).slice(0, 80)})`)
      if (INTER_BATCH_MS > 0) await sleep(INTER_BATCH_MS)
      continue
    }
    for (let j = 0; j < batch.length; j++) {
      result[batch[j]] = translated[j]
    }
    // Checkpoint per batch — resume-safe.
    fs.writeFileSync(ckpt, JSON.stringify(result, null, 2) + "\n", "utf-8")
    console.log(`ok ${((Date.now() - t0) / 1000).toFixed(1)}s`)
    if (INTER_BATCH_MS > 0) await sleep(INTER_BATCH_MS)
  }
  return result
}

async function main() {
  if (!fs.existsSync(SOURCES_FILE)) {
    console.error(`[autotranslate] ERROR: ${SOURCES_FILE} missing. Run i18n-harvest-pick-sources.js first.`)
    process.exit(2)
  }
  const harvest = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf-8"))
  const sources = harvest.pairs.map((p) => p.en)

  if (!fs.existsSync(CHECKPOINT_DIR)) fs.mkdirSync(CHECKPOINT_DIR, { recursive: true })

  const argLocales = process.argv.slice(2)
  const targets = argLocales.length ? argLocales : Object.keys(LANG_NAMES)

  console.log(`[autotranslate] Gemini: ${GEMINI_BASE}  model: ${GEMINI_MODEL}`)
  console.log(`[autotranslate] keys: ${GEMINI_KEYS.length} in rotation`)
  console.log(`[autotranslate] targets: ${targets.length} locales`)
  console.log(`[autotranslate] sources: ${sources.length} English strings`)
  console.log(`[autotranslate] batch size: ${BATCH_SIZE} · inter-batch pause: ${INTER_BATCH_MS}ms`)
  console.log(`[autotranslate] ETA: ~${Math.round((Math.ceil(sources.length / BATCH_SIZE) * (INTER_BATCH_MS + 2500) * targets.length) / 60000)} min`)

  const allMaps = {}
  for (const loc of targets) {
    try {
      allMaps[loc] = await translateLocale(loc, sources)
    } catch (e) {
      console.error(`[${loc}] FAILED: ${e.message || e}`)
      allMaps[loc] = {}
    }
  }

  // Load any locales not in `targets` from existing checkpoints so we can
  // still write a complete output file.
  for (const loc of Object.keys(LANG_NAMES)) {
    if (allMaps[loc]) continue
    const ckpt = path.join(CHECKPOINT_DIR, `${loc}.json`)
    if (fs.existsSync(ckpt)) {
      try { allMaps[loc] = JSON.parse(fs.readFileSync(ckpt, "utf-8")) } catch { allMaps[loc] = {} }
    }
  }

  // Emit the TypeScript module. Keys are English source strings; values are
  // the localized translation. pick() looks them up by `en`.
  const header = [
    "// AUTO-GENERATED by scripts/i18n-build-autotranslate.js — DO NOT EDIT.",
    "// Source strings come from scripts/i18n-harvest-pick-sources.js.",
    "// lib/i18n-pick.ts imports this module to localize pick(locale, de, en) calls.",
    "",
    `// Generated: ${new Date().toISOString()}`,
    `// Sources:   ${sources.length} unique English strings`,
    `// Locales:   ${Object.keys(allMaps).length}`,
    "",
    "const autotranslate: Record<string, Record<string, string>> = ",
  ].join("\n")
  fs.writeFileSync(OUTPUT_FILE, header + JSON.stringify(allMaps, null, 2) + "\n\nexport default autotranslate\n", "utf-8")
  console.log(`\n[autotranslate] → ${OUTPUT_FILE}  (${Object.keys(allMaps).length} locales, ${sources.length} sources)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
