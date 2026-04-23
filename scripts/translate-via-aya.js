/**
 * translate-via-aya.js
 *
 * Translate missing dictionary keys using a local Ollama instance.
 * Targets aya-expanse (Cohere's multilingual specialist) by default but
 * falls back to whatever Ollama has loaded.
 *
 *   Usage:
 *     node scripts/translate-via-aya.js                # all missing locales
 *     node scripts/translate-via-aya.js sv             # single locale
 *     node scripts/translate-via-aya.js sv fi th       # multiple locales
 *
 *   Env:
 *     OLLAMA_URL        default http://127.0.0.1:11434
 *     OLLAMA_MODEL      default aya-expanse:8b, then aya-expanse:32b, then first available
 *     BATCH_SIZE        default 40  (keys per Ollama call)
 *     DRY_RUN=1         translate but don't write files
 *
 * Persists incrementally — if interrupted, re-run to resume.
 */

const fs = require("fs")
const path = require("path")

// ── Config ─────────────────────────────────────────────────────────────────
const OLLAMA_URL = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "")
const PREFERRED_MODELS = [
  process.env.OLLAMA_MODEL,
  "aya-expanse:8b",
  "aya-expanse:32b",
  "qwen2.5:14b",
].filter(Boolean)
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "40", 10)
const DRY_RUN = process.env.DRY_RUN === "1"

const DICT_DIR = path.join(__dirname, "../dictionaries")
const REF_LOCALE = "en"
const SKIP_SECTIONS = ["roast"]          // culturally specific — leave EN/DE only

const LANG_NAMES = {
  af: "Afrikaans", ar: "Arabic", bn: "Bengali", cs: "Czech", da: "Danish",
  el: "Greek", es: "Spanish", fi: "Finnish", fr: "French", he: "Hebrew",
  hi: "Hindi", hu: "Hungarian", id: "Indonesian", it: "Italian", ja: "Japanese",
  ko: "Korean", nl: "Dutch", no: "Norwegian (Bokmål)", pl: "Polish",
  pt: "Portuguese (Brazilian)", ro: "Romanian", ru: "Russian", sv: "Swedish",
  th: "Thai", tr: "Turkish", uk: "Ukrainian", vi: "Vietnamese", zh: "Chinese (Simplified)",
}

// ── JSON helpers ───────────────────────────────────────────────────────────
function readDict(locale) {
  const p = path.join(DICT_DIR, `${locale}.json`)
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, "utf-8"))
}
function writeDict(locale, obj) {
  const p = path.join(DICT_DIR, `${locale}.json`)
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf-8")
}
function flatten(obj, prefix = "") {
  const out = {}
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k
    if (obj[k] && typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      Object.assign(out, flatten(obj[k], full))
    } else {
      out[full] = obj[k]
    }
  }
  return out
}
function setNested(obj, dotKey, value) {
  const parts = dotKey.split(".")
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}
function isSkipped(dotKey) {
  return SKIP_SECTIONS.some((s) => dotKey === s || dotKey.startsWith(`${s}.`))
}

// ── Ollama calls ───────────────────────────────────────────────────────────
async function listModels() {
  const res = await fetch(`${OLLAMA_URL}/api/tags`).catch(() => null)
  if (!res || !res.ok) return []
  const data = await res.json()
  return (data.models || []).map((m) => m.name)
}

async function pickModel() {
  const avail = await listModels()
  if (avail.length === 0) {
    console.error(`[aya] ERROR: Ollama at ${OLLAMA_URL} returned no models. Is it running? Pull a model first.`)
    process.exit(2)
  }
  for (const m of PREFERRED_MODELS) {
    if (avail.includes(m)) return m
  }
  console.warn(`[aya] Preferred model(s) ${PREFERRED_MODELS.join(", ")} not available. Using first: ${avail[0]}`)
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
      options: { temperature: 0.15, num_predict: 8000 },
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

// ── Translation logic ──────────────────────────────────────────────────────
function buildSystemPrompt(targetLang) {
  return [
    `You are a professional translator for a cybersecurity product called ClawGuru.`,
    `Translate the supplied UI strings from English into ${targetLang}.`,
    `RULES:`,
    `- Keep technical terms (HSTS, TLS, SSH, JWT, CSP, nginx, Docker, Kubernetes, CVE, DevOps, OAuth, SSO) as-is.`,
    `- Preserve placeholders exactly: {n}, {name}, {0}, %s, %d, $1, {{...}}, backtick-wrapped code, HTML tags, emoji, arrows like → and ←.`,
    `- Keep numbers, URLs, product names, and brand tokens unchanged.`,
    `- Keep the translated string natural, concise, and appropriate for a modern tech product.`,
    `- Do NOT add quotes, explanations, or surrounding text. Output JSON only.`,
    `- If a source string is empty, return an empty string.`,
    ``,
    `Return a JSON object of the form {"translations": {"<key>": "<translation>", ...}} preserving every key the user gave you.`,
  ].join("\n")
}

function buildUserPrompt(batch) {
  return `Translate each value. Preserve keys exactly.\n\n${JSON.stringify({ strings: batch }, null, 2)}`
}

function parseResponse(text) {
  // Ollama with format:"json" returns a JSON string. Defensive parse + unwrap.
  let obj
  try { obj = JSON.parse(text) } catch { return null }
  if (obj && obj.translations && typeof obj.translations === "object") return obj.translations
  // Some models return the object flat.
  if (obj && typeof obj === "object" && !Array.isArray(obj)) return obj
  return null
}

async function translateBatch(model, targetLang, batch, attempt = 1) {
  try {
    const reply = await chat(model, buildSystemPrompt(targetLang), buildUserPrompt(batch))
    const parsed = parseResponse(reply)
    if (!parsed) throw new Error("no_json")
    // ensure every input key is present — fall back to source for missing ones
    const out = {}
    for (const k of Object.keys(batch)) {
      out[k] = typeof parsed[k] === "string" ? parsed[k] : batch[k]
    }
    return out
  } catch (e) {
    if (attempt < 3) {
      console.warn(`  [retry ${attempt}] ${e.message || e}`)
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return translateBatch(model, targetLang, batch, attempt + 1)
    }
    throw e
  }
}

async function translateLocale(model, locale) {
  const langName = LANG_NAMES[locale]
  if (!langName) {
    console.warn(`[aya] skip ${locale}: no language name mapping`)
    return { translated: 0, total: 0 }
  }
  const ref = readDict(REF_LOCALE)
  if (!ref) { console.error("[aya] no en.json — aborting"); process.exit(2) }
  const cur = readDict(locale) || {}

  const refFlat = flatten(ref)
  const curFlat = flatten(cur)
  const missing = {}
  for (const [k, v] of Object.entries(refFlat)) {
    if (isSkipped(k)) continue
    if (typeof v !== "string") continue
    if (typeof curFlat[k] === "string" && curFlat[k].trim() !== "" && curFlat[k] !== v) continue
    missing[k] = v
  }
  const missingKeys = Object.keys(missing)
  console.log(`\n[${locale}] ${langName}: ${missingKeys.length} missing keys`)
  if (missingKeys.length === 0) return { translated: 0, total: 0 }

  const target = { ...cur }
  let done = 0
  for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
    const slice = missingKeys.slice(i, i + BATCH_SIZE)
    const batch = {}
    for (const k of slice) batch[k] = missing[k]
    process.stdout.write(`  batch ${i / BATCH_SIZE + 1}/${Math.ceil(missingKeys.length / BATCH_SIZE)} (${slice.length}) ... `)
    const t0 = Date.now()
    let translated
    try {
      translated = await translateBatch(model, langName, batch)
    } catch (e) {
      console.log(`FAIL (${e.message || e})`)
      continue
    }
    for (const [k, v] of Object.entries(translated)) {
      setNested(target, k, v)
      done++
    }
    console.log(`ok ${(Date.now() - t0) / 1000}s`)
    // write incrementally so a crash doesn't lose work
    if (!DRY_RUN) writeDict(locale, target)
  }
  return { translated: done, total: missingKeys.length }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const argLocales = process.argv.slice(2)
  const targets = argLocales.length > 0
    ? argLocales
    : Object.keys(LANG_NAMES)

  console.log(`[aya] Ollama: ${OLLAMA_URL}`)
  const model = await pickModel()
  console.log(`[aya] using model: ${model}`)
  console.log(`[aya] targets: ${targets.join(", ")}`)
  console.log(`[aya] batch size: ${BATCH_SIZE}${DRY_RUN ? " (DRY_RUN)" : ""}`)

  const summary = []
  for (const loc of targets) {
    try {
      const r = await translateLocale(model, loc)
      summary.push({ loc, ...r })
    } catch (e) {
      console.error(`[${loc}] FAILED: ${e.message || e}`)
      summary.push({ loc, translated: 0, total: -1 })
    }
  }

  console.log("\n───── SUMMARY ─────")
  for (const s of summary) {
    if (s.total === -1) console.log(`  ${s.loc}: FAILED`)
    else console.log(`  ${s.loc}: ${s.translated}/${s.total}`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
