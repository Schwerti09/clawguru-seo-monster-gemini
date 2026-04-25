#!/usr/bin/env node
/**
 * i18n-build-autotranslate-via-aya.js
 *
 * Local-Ollama twin of i18n-build-autotranslate.js. Reads the same
 * lib/i18n-pick-sources.json, writes the same lib/i18n-autotranslate/<locale>.json
 * checkpoints, and emits the same lib/i18n-autotranslate.ts — so a run started
 * with one backend can be finished with the other.
 *
 *   Usage:
 *     node scripts/i18n-build-autotranslate-via-aya.js                  # all locales
 *     node scripts/i18n-build-autotranslate-via-aya.js sv fi            # subset
 *     RESUME=1 node scripts/i18n-build-autotranslate-via-aya.js         # default-on; reuse checkpoints
 *     LIMIT=5 node ... sv                                               # smoke-test: 5 strings, 1 locale
 *
 *   Env:
 *     OLLAMA_URL       default http://127.0.0.1:11434
 *     OLLAMA_MODEL     default aya-expanse:8b
 *     BATCH_SIZE       default 30
 *     LIMIT            optional: only translate first N source strings
 *     RESUME           default 1 (set to 0 to ignore checkpoints)
 *
 * Notes vs. Gemini variant:
 *   - No inter-batch sleep — local, no rate limit.
 *   - Smaller batch (30) — 8b breaks JSON above ~50.
 *   - Same checkpoint shape as the Gemini script: { "<en>": "<translation>" }.
 */

const fs = require("fs")
const path = require("path")
const { execFileSync } = require("child_process")

const OLLAMA_URL = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "")
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "aya-expanse:8b"
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "30", 10)
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : null
const RESUME = process.env.RESUME !== "0"

const SOURCES_FILE = path.join("lib", "i18n-pick-sources.json")
const CHECKPOINT_DIR = path.join("lib", "i18n-autotranslate")
const OUTPUT_FILE = path.join("lib", "i18n-autotranslate.ts")

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

async function callOllama(prompt, attempt = 1) {
  const url = `${OLLAMA_URL}/api/generate`
  try {
    const controller = new AbortController()
    const to = setTimeout(() => controller.abort(), 600000)
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        format: "json",
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 8192,
        },
      }),
    })
    clearTimeout(to)
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`ollama http ${res.status}: ${body.slice(0, 200)}`)
    }
    const data = await res.json()
    return (data?.response || "").trim()
  } catch (e) {
    if (attempt <= 3) {
      const delay = 2000 * attempt
      console.warn(`  [retry ${attempt}/3] ${String(e.message || e).slice(0, 100)}`)
      await sleep(delay)
      return callOllama(prompt, attempt + 1)
    }
    throw e
  }
}

function buildPrompt(targetLang, batch) {
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
  if (!langName) { console.warn(`[aya] skip ${locale}: unknown locale`); return {} }

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
  let failedBatches = 0
  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE)
    const batchNo = Math.floor(i / BATCH_SIZE) + 1
    process.stdout.write(`  ${locale} batch ${batchNo}/${total} (${batch.length}) ... `)
    const t0 = Date.now()
    let translated
    try {
      const reply = await callOllama(buildPrompt(langName, batch))
      translated = parseReply(reply, batch)
      if (!translated) throw new Error("no_json")
    } catch (e) {
      failedBatches++
      console.log(`FAIL (${String(e.message || e).slice(0, 80)})`)
      // Don't checkpoint on failure — just move on; resume run will retry.
      continue
    }
    for (let j = 0; j < batch.length; j++) {
      result[batch[j]] = translated[j]
    }
    fs.writeFileSync(ckpt, JSON.stringify(result, null, 2) + "\n", "utf-8")
    console.log(`ok ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  }
  if (failedBatches > 0) {
    console.warn(`[${locale}] ${failedBatches}/${total} batches failed — re-run to retry.`)
  }
  return result
}

function emitTsModule(allMaps, sources) {
  const header = [
    "// AUTO-GENERATED by scripts/i18n-build-autotranslate{,-via-aya}.js — DO NOT EDIT.",
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
}

function harvestNow() {
  // SOURCES_FILE is gitignored and regenerable. Always re-harvest at the start
  // of a run so we translate the *current* set of pick() calls, not a stale
  // snapshot from days ago. Set SKIP_HARVEST=1 to bypass (e.g. CI with cached
  // sources). Cheap — ~2s for ~1000 files.
  if (process.env.SKIP_HARVEST === "1" && fs.existsSync(SOURCES_FILE)) {
    console.log(`[aya] SKIP_HARVEST=1 — using existing ${SOURCES_FILE}`)
    return
  }
  console.log(`[aya] harvesting pick() source strings...`)
  execFileSync(process.execPath, [path.join("scripts", "i18n-harvest-pick-sources.js")], { stdio: "inherit" })
}

async function main() {
  harvestNow()
  if (!fs.existsSync(SOURCES_FILE)) {
    console.error(`[aya] ERROR: ${SOURCES_FILE} still missing after harvest. Aborting.`)
    process.exit(2)
  }
  const harvest = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf-8"))
  let sources = harvest.pairs.map((p) => p.en)
  if (LIMIT && LIMIT > 0) sources = sources.slice(0, LIMIT)

  if (!fs.existsSync(CHECKPOINT_DIR)) fs.mkdirSync(CHECKPOINT_DIR, { recursive: true })

  const argLocales = process.argv.slice(2)
  const targets = argLocales.length ? argLocales : Object.keys(LANG_NAMES)

  console.log(`[aya] Ollama: ${OLLAMA_URL}  model: ${OLLAMA_MODEL}`)
  console.log(`[aya] targets: ${targets.length} locales`)
  console.log(`[aya] sources: ${sources.length} English strings${LIMIT ? ` (LIMIT=${LIMIT})` : ""}`)
  console.log(`[aya] batch size: ${BATCH_SIZE}`)

  const allMaps = {}
  for (const loc of targets) {
    try {
      allMaps[loc] = await translateLocale(loc, sources)
    } catch (e) {
      console.error(`[${loc}] FAILED: ${e.message || e}`)
      allMaps[loc] = {}
    }
  }

  // Pull in any locales not in this run from existing checkpoints so the
  // emitted .ts module is complete.
  for (const loc of Object.keys(LANG_NAMES)) {
    if (allMaps[loc]) continue
    const ckpt = path.join(CHECKPOINT_DIR, `${loc}.json`)
    if (fs.existsSync(ckpt)) {
      try { allMaps[loc] = JSON.parse(fs.readFileSync(ckpt, "utf-8")) } catch { allMaps[loc] = {} }
    }
  }

  // Emit the consolidated .ts module from full sources (not the LIMIT slice)
  // so partial runs don't truncate the output for already-complete locales.
  const fullSources = harvest.pairs.map((p) => p.en)
  emitTsModule(allMaps, fullSources)
  console.log(`\n[aya] → ${OUTPUT_FILE}  (${Object.keys(allMaps).length} locales, ${fullSources.length} sources)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
