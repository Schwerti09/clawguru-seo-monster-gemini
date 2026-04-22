/**
 * translate-all.js
 * Übersetzt ALLE fehlenden Dictionary-Keys für alle 30 Sprachen via Gemini.
 * Idempotent — überspringt bereits übersetzte Keys.
 * Größere Batches (60 Keys) = weniger API-Calls = weniger Rate-Limits.
 *
 * Aufruf: node scripts/translate-all.js
 * Einzelne Sprache: node scripts/translate-all.js he uk vi
 */

const fs = require("fs")
const path = require("path")

// Zwei API-Keys abwechselnd = doppelter Durchsatz, weniger Rate-Limits
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY2,
].filter(Boolean)
if (GEMINI_KEYS.length === 0) {
  console.error("[translate-all] ERROR: set GEMINI_API_KEY (and optionally GEMINI_API_KEY2) in env.")
  process.exit(1)
}
let keyIndex = 0
const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"
const DICT_DIR = path.join(__dirname, "../dictionaries")
const SKIP_SECTIONS = ["roast"]
const BATCH_SIZE = 60

const LANG_NAMES = {
  // Bestehende 14 (ohne de/en)
  af: "Afrikaans",
  ar: "Arabic",
  es: "Spanish",
  fr: "French",
  hi: "Hindi",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  nl: "Dutch",
  pl: "Polish",
  pt: "Portuguese (Brazilian)",
  ru: "Russian",
  tr: "Turkish",
  zh: "Chinese (Simplified)",
  // Neu — Round 14
  he: "Hebrew",
  uk: "Ukrainian",
  vi: "Vietnamese",
  id: "Indonesian (Bahasa Indonesia)",
  sv: "Swedish",
  fi: "Finnish",
  ro: "Romanian",
  cs: "Czech",
  th: "Thai",
  bn: "Bengali",
  el: "Greek",
  hu: "Hungarian",
  da: "Danish",
  no: "Norwegian",
}

function getFlat(obj, prefix = "") {
  const result = {}
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (typeof obj[k] === "object" && obj[k] !== null) {
      Object.assign(result, getFlat(obj[k], fullKey))
    } else {
      result[fullKey] = obj[k]
    }
  }
  return result
}

function setNestedKey(obj, dotKey, value) {
  const parts = dotKey.split(".")
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function callGemini(prompt, retries = 6) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    // Wechsle Key bei 429 — so treffen wir zwei separate Rate-Limit-Buckets
    const key = GEMINI_KEYS[keyIndex % GEMINI_KEYS.length]
    const url = `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${key}`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 16000 },
        }),
        signal: AbortSignal.timeout(90_000),
      })
      if (res.status === 429) {
        // Key wechseln und kurz warten statt lang warten
        keyIndex++
        const waitMs = 4000 * (attempt + 1)
        process.stdout.write(` [429 → Key${(keyIndex % GEMINI_KEYS.length) + 1}, ${waitMs / 1000}s...]`)
        await sleep(waitMs)
        continue
      }
      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Gemini HTTP ${res.status}: ${err.slice(0, 300)}`)
      }
      const data = await res.json()
      const parts = data?.candidates?.[0]?.content?.parts
      if (!Array.isArray(parts)) throw new Error("Keine parts in Antwort")
      keyIndex++ // Nächster Aufruf nutzt anderen Key
      return parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("").trim()
    } catch (err) {
      if (attempt === retries) throw err
      keyIndex++
      process.stdout.write(` [Fehler, Retry ${attempt + 1}/${retries}...]`)
      await sleep(3000 * (attempt + 1))
    }
  }
  throw new Error("Max retries exceeded")
}

async function translateBatch(langCode, langName, keysWithValues) {
  const entries = Object.entries(keysWithValues)
  if (entries.length === 0) return {}

  const inputJson = JSON.stringify(Object.fromEntries(entries), null, 2)

  const prompt = `You are a professional localization expert for ClawGuru, a cybersecurity platform for DevOps and SysAdmins who manage self-hosted infrastructure.

Translate the following JSON from English to ${langName}.

STRICT RULES:
- Translate ONLY the values, NEVER the keys
- Keep intact: {placeholders}, HTML tags, URLs, emails, brand names (ClawGuru, Docker, Nginx, Redis, Kubernetes, Stripe, Gemini, etc.)
- Keep technical terms as-is or use the standard ${langName} equivalent: CVE, API, DSGVO/GDPR, IP, SSH, TLS, SSL, JWT, SLA, CI/CD, SRE, DevOps
- Tone: professional, direct, slightly technical — like a senior SRE explaining to a colleague
- Return ONLY valid JSON — no markdown, no code blocks, no explanation
- Every key from the input must appear in the output

Input:
${inputJson}`

  const raw = await callGemini(prompt)
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Kein JSON in Antwort: ${raw.slice(0, 200)}`)
  return JSON.parse(jsonMatch[0])
}

async function processLocale(locale, langName, refFlat) {
  const dictPath = path.join(DICT_DIR, `${locale}.json`)
  const dict = fs.existsSync(dictPath)
    ? JSON.parse(fs.readFileSync(dictPath, "utf8"))
    : {}
  const dictFlat = getFlat(dict)

  const missingKeys = Object.keys(refFlat).filter((k) => !(k in dictFlat))

  if (missingKeys.length === 0) {
    console.log(`✅ ${locale} (${langName}): vollständig`)
    return 0
  }

  const total = Object.keys(refFlat).length
  const pct = Math.round(((total - missingKeys.length) / total) * 100)
  console.log(`\n🔄 ${locale} (${langName}): ${missingKeys.length} Keys fehlen (aktuell ${pct}%)`)

  const batches = []
  for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
    batches.push(missingKeys.slice(i, i + BATCH_SIZE))
  }

  let translated = 0
  let errors = 0

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi]
    const batchValues = Object.fromEntries(batch.map((k) => [k, refFlat[k]]))
    process.stdout.write(`  Batch ${bi + 1}/${batches.length} (${batch.length} Keys)...`)

    try {
      const result = await translateBatch(locale, langName, batchValues)
      for (const [key, value] of Object.entries(result)) {
        if (typeof value === "string" && value.length > 0) {
          setNestedKey(dict, key, value)
          translated++
        }
      }
      console.log(` ✓ ${Object.keys(result).length} Keys`)
    } catch (err) {
      console.log(` ✗ ${err.message.slice(0, 80)}`)
      errors++
    }

    // Datei nach jedem Batch sichern
    fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), "utf8")

    if (bi < batches.length - 1) await sleep(5000)
  }

  const newPct = Math.round(
    (Object.keys(refFlat).filter((k) => k in getFlat(dict)).length / total) * 100
  )
  console.log(`  💾 ${locale}: +${translated} Keys → ${newPct}% | ${errors} Fehler`)
  return translated
}

async function main() {
  // Ziel-Locales aus Argument oder alle
  const args = process.argv.slice(2)
  const targetLocales = args.length > 0
    ? args.filter((a) => a in LANG_NAMES)
    : Object.keys(LANG_NAMES)

  console.log(`\n🌍 ClawGuru Globale Übersetzung — ${targetLocales.length} Sprachen\n`)
  console.log("Ziele:", targetLocales.join(", "), "\n")

  // EN-Referenz laden (ohne roast.*)
  const ref = JSON.parse(fs.readFileSync(path.join(DICT_DIR, "en.json"), "utf8"))
  const refFlat = Object.fromEntries(
    Object.entries(getFlat(ref)).filter(([k]) => !SKIP_SECTIONS.some((s) => k.startsWith(s + ".")))
  )
  console.log(`Referenz: ${Object.keys(refFlat).length} Keys (ohne roast.*)\n`)
  console.log("─".repeat(60))

  let grandTotal = 0

  for (const locale of targetLocales) {
    const langName = LANG_NAMES[locale]
    if (!langName) {
      console.log(`⚠️  Unbekannte Locale: ${locale}`)
      continue
    }
    const count = await processLocale(locale, langName, refFlat)
    grandTotal += count
    if (targetLocales.indexOf(locale) < targetLocales.length - 1) {
      await sleep(3000)
    }
  }

  // Abschlussbericht
  console.log("\n" + "═".repeat(60))
  console.log(`🎉 FERTIG — ${grandTotal} Keys neu übersetzt\n`)
  console.log("📊 Abschlussbericht:")

  const allLocales = Object.keys(LANG_NAMES)
  const refTotal = Object.keys(refFlat).length
  for (const locale of allLocales) {
    const dictPath = path.join(DICT_DIR, `${locale}.json`)
    if (!fs.existsSync(dictPath)) { console.log(`  ${locale}: ✗ keine Datei`); continue }
    const dict = JSON.parse(fs.readFileSync(dictPath, "utf8"))
    const flat = getFlat(dict)
    const present = Object.keys(refFlat).filter((k) => k in flat).length
    const pct = Math.round((present / refTotal) * 100)
    const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5))
    console.log(`  ${locale.padEnd(4)} ${bar} ${pct}% (${present}/${refTotal})`)
  }
}

main().catch((err) => {
  console.error("\n❌ Kritischer Fehler:", err)
  process.exit(1)
})
