/**
 * translate-missing.js
 * Übersetzt alle fehlenden Dictionary-Keys (ohne roast.*) für alle 14 Nicht-EN/DE-Sprachen
 * via Gemini API. Schreibt Ergebnisse direkt in dictionaries/{locale}.json
 *
 * Aufruf: node scripts/translate-missing.js
 */

const fs = require("fs")
const path = require("path")

// ── Konfiguration ──────────────────────────────────────────────────────────
const GEMINI_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_KEY) {
  console.error("[translate-missing] ERROR: set GEMINI_API_KEY in env.")
  process.exit(1)
}
const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"

const DICT_DIR = path.join(__dirname, "../dictionaries")
const REF_LOCALE = "en"
const SKIP_SECTIONS = ["roast"] // bewusst nicht übersetzen

// Sprach-Namen für den Prompt (damit Gemini weiß, in welche Sprache)
const LANG_NAMES = {
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
}

// ── Hilfsfunktionen ────────────────────────────────────────────────────────
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

async function callGemini(prompt, retries = 5) {
  const url = `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8000 },
        }),
        signal: AbortSignal.timeout(60_000),
      })
      if (res.status === 429) {
        const waitMs = 8000 * (attempt + 1)
        process.stdout.write(` [Rate-Limit, warte ${waitMs / 1000}s...]`)
        await sleep(waitMs)
        continue
      }
      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Gemini HTTP ${res.status}: ${err.slice(0, 200)}`)
      }
      const data = await res.json()
      const parts = data?.candidates?.[0]?.content?.parts
      if (!Array.isArray(parts)) throw new Error("Keine parts in Gemini-Antwort")
      return parts
        .filter((p) => !p.thought)
        .map((p) => p.text ?? "")
        .join("")
        .trim()
    } catch (err) {
      if (attempt === retries) throw err
      await sleep(3000)
    }
  }
  throw new Error("Max retries exceeded")
}

async function translateBatch(langCode, langName, keysWithValues) {
  const entries = Object.entries(keysWithValues)
  if (entries.length === 0) return {}

  const inputJson = JSON.stringify(Object.fromEntries(entries), null, 2)

  const prompt = `You are a professional localization expert for a cybersecurity platform called ClawGuru.
Translate the following JSON key-value pairs from English to ${langName}.

Rules:
- Translate ONLY the values, never the keys
- Keep {placeholders}, HTML tags, URLs, brand names (ClawGuru, Gemini, Docker, etc.) unchanged
- Keep technical terms (CVE, DSGVO/GDPR, IP, API, etc.) as-is or use the standard ${langName} equivalent
- Maintain the same tone: professional, direct, slightly technical
- Return ONLY a valid JSON object with the same keys and translated values
- No explanations, no markdown, just the JSON

English input:
${inputJson}`

  const raw = await callGemini(prompt)

  // JSON aus der Antwort extrahieren
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Kein JSON in Antwort für ${langCode}: ${raw.slice(0, 200)}`)

  return JSON.parse(jsonMatch[0])
}

// ── Hauptlogik ─────────────────────────────────────────────────────────────
async function main() {
  console.log("🌍 ClawGuru i18n Batch-Übersetzer startet...\n")

  // Referenz laden
  const ref = JSON.parse(fs.readFileSync(path.join(DICT_DIR, `${REF_LOCALE}.json`), "utf8"))
  const refFlat = getFlat(ref)

  // Nur Keys ohne gesperrte Sections
  const allTranslatableFlat = Object.fromEntries(
    Object.entries(refFlat).filter(([k]) => !SKIP_SECTIONS.some((s) => k.startsWith(s + ".")))
  )

  const targetLocales = Object.keys(LANG_NAMES)
  let totalTranslated = 0
  let totalErrors = 0

  for (const locale of targetLocales) {
    const langName = LANG_NAMES[locale]
    const dictPath = path.join(DICT_DIR, `${locale}.json`)

    if (!fs.existsSync(dictPath)) {
      console.log(`⚠️  ${locale}: Datei nicht gefunden, überspringe`)
      continue
    }

    const dict = JSON.parse(fs.readFileSync(dictPath, "utf8"))
    const dictFlat = getFlat(dict)

    // Fehlende Keys finden
    const missingKeys = Object.keys(allTranslatableFlat).filter((k) => !(k in dictFlat))

    if (missingKeys.length === 0) {
      console.log(`✅ ${locale} (${langName}): Vollständig, nichts zu tun`)
      continue
    }

    console.log(`\n🔄 ${locale} (${langName}): ${missingKeys.length} fehlende Keys`)

    // In Batches von 30 Keys übersetzen (Prompt-Größe begrenzen)
    const BATCH_SIZE = 30
    const batches = []
    for (let i = 0; i < missingKeys.length; i += BATCH_SIZE) {
      batches.push(missingKeys.slice(i, i + BATCH_SIZE))
    }

    let localeTranslated = 0
    let localeErrors = 0

    for (let bi = 0; bi < batches.length; bi++) {
      const batch = batches[bi]
      const batchValues = Object.fromEntries(batch.map((k) => [k, allTranslatableFlat[k]]))

      process.stdout.write(`  Batch ${bi + 1}/${batches.length} (${batch.length} Keys)... `)

      try {
        const translated = await translateBatch(locale, langName, batchValues)

        // Ergebnisse in dict schreiben
        for (const [key, value] of Object.entries(translated)) {
          if (typeof value === "string" && value.length > 0) {
            setNestedKey(dict, key, value)
            localeTranslated++
          }
        }
        console.log(`✓ (${Object.keys(translated).length} Keys)`)

        // Pause zwischen Batches (Rate Limiting)
        if (bi < batches.length - 1) {
          await sleep(3000)
        }
      } catch (err) {
        console.log(`✗ Fehler: ${err.message}`)
        localeErrors++
        await sleep(5000)
      }
    }

    // Datei zurückschreiben
    fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), "utf8")
    console.log(`  💾 ${locale}: ${localeTranslated} Keys übersetzt, ${localeErrors} Fehler`)
    totalTranslated += localeTranslated
    totalErrors += localeErrors

    // Pause zwischen Sprachen
    await sleep(4000)
  }

  console.log(`\n${"─".repeat(60)}`)
  console.log(`✅ FERTIG: ${totalTranslated} Keys übersetzt, ${totalErrors} Fehler`)
  console.log(`📁 Alle Dateien in ${DICT_DIR} aktualisiert`)

  // Abschlussbericht
  console.log("\n📊 Abschlussbericht:")
  for (const locale of targetLocales) {
    const dictPath = path.join(DICT_DIR, `${locale}.json`)
    if (!fs.existsSync(dictPath)) continue
    const dict = JSON.parse(fs.readFileSync(dictPath, "utf8"))
    const dictFlat = getFlat(dict)
    const total = Object.keys(allTranslatableFlat).length
    const present = Object.keys(allTranslatableFlat).filter((k) => k in dictFlat).length
    const pct = Math.round((present / total) * 100)
    console.log(`  ${locale}: ${present}/${total} (${pct}%)`)
  }
}

main().catch((err) => {
  console.error("❌ Kritischer Fehler:", err)
  process.exit(1)
})
