/**
 * polish-via-gemini.js
 *
 * Pass-2 native-speaker polish using Gemini. Targets only "hot paths" —
 * sections users actually read (hero, pricing, nav, footer, faq, academy,
 * home, homepage). For each hot-path key, feeds Gemini:
 *   - the English source string
 *   - the current locale string (usually aya Pass-1 output)
 * Gemini returns a native-speaker polish.
 *
 * Skips sections:
 *   - roast (EN/DE only by design)
 *   - copilot, intel, neuro, oracle, mycelium, summon, vorstellung,
 *     jackpot, live, share, check, dayPass, runbooks (lower-traffic
 *     paths, saved for later if we run out of budget)
 *
 *   Usage:
 *     node scripts/polish-via-gemini.js                # all non-de/en
 *     node scripts/polish-via-gemini.js sv fi th       # specific locales
 *     DRY_RUN=1 node scripts/polish-via-gemini.js sv   # inspect without writing
 *
 *   Env:
 *     GEMINI_API_KEY    required
 *     GEMINI_MODEL      default gemini-2.5-flash-lite
 *     BATCH_SIZE        default 30  (keys per Gemini call — Gemini handles more)
 */

const fs = require("fs")
const path = require("path")

if (!process.env.GEMINI_API_KEY) {
  console.error("[polish] ERROR: set GEMINI_API_KEY in env.")
  process.exit(1)
}
const GEMINI_KEY = process.env.GEMINI_API_KEY.trim()
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite"
const GEMINI_BASE = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "")
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "30", 10)
const DRY_RUN = process.env.DRY_RUN === "1"

const DICT_DIR = path.join(__dirname, "../dictionaries")
const REF_LOCALE = "en"

// Hot paths — user-facing, high-traffic sections only. Add new sections here
// when expanding Pass 2 scope. Excludes roast.* by design + low-traffic tools.
const HOT_SECTIONS = [
  "hero", "pricing", "nav", "common", "footer", "faq", "home", "homepage",
  "academy",
]

const LANG_NAMES = {
  af: "Afrikaans", ar: "Arabic", bg: "Bulgarian", bn: "Bengali", cs: "Czech",
  da: "Danish", el: "Greek", es: "Spanish", fi: "Finnish", fr: "French",
  he: "Hebrew", hi: "Hindi", hu: "Hungarian", id: "Indonesian", it: "Italian",
  ja: "Japanese", ko: "Korean", ms: "Malay", nl: "Dutch",
  no: "Norwegian (Bokmål)", pl: "Polish", pt: "Portuguese (Brazilian)",
  ro: "Romanian", ru: "Russian", sv: "Swedish", th: "Thai", tr: "Turkish",
  uk: "Ukrainian", vi: "Vietnamese", zh: "Chinese (Simplified)",
}

// ── JSON helpers ───────────────────────────────────────────────────────────
function readDict(locale) {
  const p = path.join(DICT_DIR, `${locale}.json`)
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : null
}
function writeDict(locale, obj) {
  fs.writeFileSync(path.join(DICT_DIR, `${locale}.json`), JSON.stringify(obj, null, 2) + "\n", "utf-8")
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
function isHotPath(dotKey) {
  const top = dotKey.split(".")[0]
  return HOT_SECTIONS.includes(top)
}

// ── Gemini call ────────────────────────────────────────────────────────────
async function callGemini(prompt, attempt = 1) {
  const url = `${GEMINI_BASE}/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`
  try {
    const controller = new AbortController()
    const to = setTimeout(() => controller.abort(), 30000)
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8000,
          responseMimeType: "application/json",
        },
      }),
    })
    clearTimeout(to)
    if (res.status === 429 && attempt < 4) {
      const delay = 1500 * Math.pow(2, attempt)
      console.warn(`  [rate-limit, retry ${attempt}] sleeping ${delay}ms`)
      await new Promise((r) => setTimeout(r, delay))
      return callGemini(prompt, attempt + 1)
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`gemini http ${res.status}: ${body.slice(0, 200)}`)
    }
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? ""
    return text.trim()
  } catch (e) {
    if (attempt < 3) {
      const delay = 1500 * attempt
      console.warn(`  [retry ${attempt}] ${e.message || e}`)
      await new Promise((r) => setTimeout(r, delay))
      return callGemini(prompt, attempt + 1)
    }
    throw e
  }
}

// ── Polish logic ───────────────────────────────────────────────────────────
function buildPrompt(targetLang, batch) {
  return [
    `You are a native speaker of ${targetLang} and a professional copywriter for a cybersecurity SaaS product called ClawGuru.`,
    `Your job: review each current translation against the English source and return the best native-speaker version.`,
    ``,
    `INPUT shape:`,
    `  { "<key>": { "en": "<English source>", "current": "<current translation>" }, ... }`,
    ``,
    `RULES:`,
    `- Return only a JSON object: { "translations": { "<key>": "<polished translation>", ... } }`,
    `- Preserve every key.`,
    `- Keep technical terms as-is: HSTS, TLS, SSH, JWT, CSP, nginx, Docker, Kubernetes, CVE, DevOps, OAuth, SSO, SAML, SaaS, HTTPS.`,
    `- Keep placeholders exact: {n}, {0}, {name}, %s, %d, $1, {{...}}, URLs, backtick code, HTML tags, emoji, → ←.`,
    `- Fix grammar, agreement, idiom, awkward machine-translation artifacts.`,
    `- Keep the tone modern, sharp, SaaS-B2B — not stiff, not casual.`,
    `- If the current translation is already good, return it unchanged.`,
    `- If current is empty or identical to EN, produce a high-quality translation from scratch.`,
    ``,
    `INPUT:`,
    JSON.stringify({ strings: batch }, null, 2),
  ].join("\n")
}

function parse(reply) {
  let obj
  try { obj = JSON.parse(reply) } catch { return null }
  if (obj && obj.translations && typeof obj.translations === "object") return obj.translations
  if (obj && typeof obj === "object") return obj
  return null
}

async function polishBatch(targetLang, batch) {
  const reply = await callGemini(buildPrompt(targetLang, batch))
  const parsed = parse(reply)
  if (!parsed) throw new Error("no_json")
  const out = {}
  for (const k of Object.keys(batch)) {
    out[k] = typeof parsed[k] === "string" ? parsed[k] : batch[k].current
  }
  return out
}

async function polishLocale(locale) {
  const langName = LANG_NAMES[locale]
  if (!langName) { console.warn(`[polish] skip ${locale}: no language name`); return { done: 0, total: 0 } }

  const ref = flatten(readDict(REF_LOCALE))
  const cur = readDict(locale) || {}
  const curFlat = flatten(cur)

  const hotPairs = {}
  for (const [k, v] of Object.entries(ref)) {
    if (typeof v !== "string") continue
    if (!isHotPath(k)) continue
    hotPairs[k] = { en: v, current: typeof curFlat[k] === "string" ? curFlat[k] : v }
  }
  const keys = Object.keys(hotPairs)
  console.log(`\n[${locale}] ${langName}: ${keys.length} hot-path keys`)
  if (keys.length === 0) return { done: 0, total: 0 }

  const target = { ...cur }
  let done = 0
  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const slice = keys.slice(i, i + BATCH_SIZE)
    const batch = {}
    for (const k of slice) batch[k] = hotPairs[k]
    process.stdout.write(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(keys.length / BATCH_SIZE)} (${slice.length}) ... `)
    const t0 = Date.now()
    let polished
    try {
      polished = await polishBatch(langName, batch)
    } catch (e) {
      console.log(`FAIL (${e.message || e})`)
      continue
    }
    for (const [k, v] of Object.entries(polished)) {
      setNested(target, k, v)
      done++
    }
    console.log(`ok ${((Date.now() - t0) / 1000).toFixed(1)}s`)
    if (!DRY_RUN) writeDict(locale, target)
  }
  return { done, total: keys.length }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const argLocales = process.argv.slice(2)
  const targets = argLocales.length ? argLocales : Object.keys(LANG_NAMES)

  console.log(`[polish] Gemini: ${GEMINI_BASE}  model: ${GEMINI_MODEL}`)
  console.log(`[polish] targets: ${targets.join(", ")}`)
  console.log(`[polish] hot sections: ${HOT_SECTIONS.join(", ")}`)
  console.log(`[polish] batch size: ${BATCH_SIZE}${DRY_RUN ? " (DRY_RUN)" : ""}`)

  const summary = []
  for (const loc of targets) {
    try {
      const r = await polishLocale(loc)
      summary.push({ loc, ...r })
    } catch (e) {
      console.error(`[${loc}] FAILED: ${e.message || e}`)
      summary.push({ loc, done: 0, total: -1 })
    }
  }

  console.log("\n───── SUMMARY ─────")
  for (const s of summary) {
    if (s.total === -1) console.log(`  ${s.loc}: FAILED`)
    else console.log(`  ${s.loc}: ${s.done}/${s.total}`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
