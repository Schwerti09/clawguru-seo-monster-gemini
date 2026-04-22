/**
 * translate-multi.js
 * 4-Provider-Worker-Pool: 2× Gemini + DeepSeek + OpenAI parallel.
 * Jeder Worker zieht sich Batches aus einer zentralen Queue und übersetzt mit
 * seinem jeweiligen Provider. Bei 429/Fehler: nächster Batch, Worker läuft weiter.
 *
 * Aufruf: node scripts/translate-multi.js              (alle 28 Nicht-DE/EN-Locales)
 *         node scripts/translate-multi.js he uk vi     (nur diese)
 *
 * Idempotent — überspringt bereits übersetzte Keys.
 */

const fs = require("fs")
const path = require("path")

// ── Konfiguration ──────────────────────────────────────────────────────────
const DICT_DIR = path.join(__dirname, "../dictionaries")
const SKIP_SECTIONS = ["roast"]
const BATCH_SIZE = 50

// Lese .env.local für API-Keys (kein dotenv-Dependency nötig)
function loadEnvLocal() {
  try {
    const content = fs.readFileSync(path.join(__dirname, "../.env.local.localonly"), "utf8")
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n\r]*)"?\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch {}
}
loadEnvLocal()

// Keys werden NUR aus Env gelesen — niemals hardcoden (landet in Git-History)
const GEMINI_KEY_1 = process.env.GEMINI_API_KEY_FRESH1 || process.env.GEMINI_API_KEY
const GEMINI_KEY_2 = process.env.GEMINI_API_KEY_FRESH2 || process.env.GEMINI_API_KEY2
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY_FRESH || process.env.DEEPSEEK_API_KEY
const OPENAI_KEY   = process.env.OPENAI_API_KEY

const PROVIDERS = [
  GEMINI_KEY_1 && { name: "Gemini-1", kind: "gemini", key: GEMINI_KEY_1, model: "gemini-2.0-flash" },
  GEMINI_KEY_2 && { name: "Gemini-2", kind: "gemini", key: GEMINI_KEY_2, model: "gemini-2.0-flash" },
  DEEPSEEK_KEY && { name: "DeepSeek", kind: "openai-compat", key: DEEPSEEK_KEY, model: "deepseek-chat", baseUrl: "https://api.deepseek.com/v1" },
  OPENAI_KEY   && { name: "OpenAI",   kind: "openai-compat", key: OPENAI_KEY,   model: "gpt-4o-mini", baseUrl: "https://api.openai.com/v1" },
].filter(Boolean)

if (PROVIDERS.length === 0) {
  console.error("[translate-multi] ERROR: no provider keys found in env. Set GEMINI_API_KEY / GEMINI_API_KEY2 / DEEPSEEK_API_KEY / OPENAI_API_KEY.")
  process.exit(1)
}

console.log(`🧠 ${PROVIDERS.length} Provider aktiv: ${PROVIDERS.map((p) => p.name).join(", ")}`)

const LANG_NAMES = {
  af: "Afrikaans", ar: "Arabic", es: "Spanish", fr: "French", hi: "Hindi", it: "Italian",
  ja: "Japanese", ko: "Korean", nl: "Dutch", pl: "Polish", pt: "Portuguese (Brazilian)",
  ru: "Russian", tr: "Turkish", zh: "Chinese (Simplified)",
  he: "Hebrew", uk: "Ukrainian", vi: "Vietnamese", id: "Indonesian (Bahasa Indonesia)",
  sv: "Swedish", fi: "Finnish", ro: "Romanian", cs: "Czech", th: "Thai", bn: "Bengali",
  el: "Greek", hu: "Hungarian", da: "Danish", no: "Norwegian",
}

// ── Helpers ────────────────────────────────────────────────────────────────
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Provider-Calls ─────────────────────────────────────────────────────────
async function callGemini(provider, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${provider.key}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 16000 },
    }),
    signal: AbortSignal.timeout(90_000),
  })
  if (res.status === 429) throw Object.assign(new Error("429"), { status: 429 })
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) throw new Error("no parts in gemini response")
  return parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("").trim()
}

async function callOpenAICompat(provider, prompt) {
  const res = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${provider.key}`,
    },
    body: JSON.stringify({
      model: provider.model,
      temperature: 0.1,
      max_tokens: 16000,
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(120_000),
  })
  if (res.status === 429) throw Object.assign(new Error("429"), { status: 429 })
  if (!res.ok) throw new Error(`${provider.name} HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error(`no content in ${provider.name} response`)
  return text.trim()
}

async function callProvider(provider, prompt) {
  if (provider.kind === "gemini") return callGemini(provider, prompt)
  return callOpenAICompat(provider, prompt)
}

// ── Prompt + Batch-Übersetzung ────────────────────────────────────────────
function buildPrompt(langName, keysWithValues) {
  const inputJson = JSON.stringify(keysWithValues, null, 2)
  return `You are a professional localization expert for ClawGuru, a cybersecurity platform for DevOps and SysAdmins who manage self-hosted infrastructure.

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
}

async function translateBatch(provider, langName, keysWithValues, retries = 3) {
  const prompt = buildPrompt(langName, keysWithValues)
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const raw = await callProvider(provider, prompt)
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error(`no JSON in response: ${raw.slice(0, 150)}`)
      return JSON.parse(jsonMatch[0])
    } catch (err) {
      if (err.status === 429) {
        if (attempt === retries) throw err
        const waitMs = 3000 * (attempt + 1)
        await sleep(waitMs)
        continue
      }
      if (attempt === retries) throw err
      await sleep(1500)
    }
  }
  throw new Error("retries exhausted")
}

// ── Task-Queue + Worker-Pool ───────────────────────────────────────────────
function buildTasks(targetLocales, refFlat) {
  const tasks = []
  for (const locale of targetLocales) {
    const langName = LANG_NAMES[locale]
    if (!langName) continue
    const dictPath = path.join(DICT_DIR, `${locale}.json`)
    const dict = fs.existsSync(dictPath) ? JSON.parse(fs.readFileSync(dictPath, "utf8")) : {}
    const dictFlat = getFlat(dict)
    const missing = Object.keys(refFlat).filter((k) => !(k in dictFlat))
    if (missing.length === 0) {
      console.log(`✅ ${locale} (${langName}): vollständig`)
      continue
    }
    console.log(`🔄 ${locale} (${langName}): ${missing.length} Keys fehlen`)
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batchKeys = missing.slice(i, i + BATCH_SIZE)
      tasks.push({ locale, langName, dictPath, batchKeys, batchValues: Object.fromEntries(batchKeys.map((k) => [k, refFlat[k]])) })
    }
  }
  return tasks
}

// Serialize writes per locale to avoid race conditions when multiple workers
// save batches for the same file.
const writeLocks = new Map()
async function writeDictSafe(dictPath, updater) {
  const prev = writeLocks.get(dictPath) || Promise.resolve()
  const next = prev.then(async () => {
    const current = fs.existsSync(dictPath) ? JSON.parse(fs.readFileSync(dictPath, "utf8")) : {}
    const updated = updater(current)
    fs.writeFileSync(dictPath, JSON.stringify(updated, null, 2), "utf8")
  })
  writeLocks.set(dictPath, next.catch(() => {}))
  return next
}

async function runWorker(provider, queue, state) {
  while (queue.length > 0) {
    const task = queue.shift()
    if (!task) break
    const startedAt = Date.now()
    try {
      const result = await translateBatch(provider, task.langName, task.batchValues)
      let written = 0
      await writeDictSafe(task.dictPath, (dict) => {
        for (const [key, value] of Object.entries(result)) {
          if (typeof value === "string" && value.length > 0) {
            setNestedKey(dict, key, value)
            written++
          }
        }
        return dict
      })
      state.done += 1
      state.keys += written
      const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
      console.log(`  [${provider.name}] ${task.locale} batch ✓ ${written} keys (${elapsed}s) — ${state.done}/${state.total} batches done`)
    } catch (err) {
      state.errors += 1
      console.log(`  [${provider.name}] ${task.locale} batch ✗ ${String(err.message).slice(0, 80)}`)
      // Failed batch goes back to the queue for a different provider
      queue.push(task)
      await sleep(1500)
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const targetLocales = args.length > 0 ? args.filter((a) => a in LANG_NAMES) : Object.keys(LANG_NAMES)

  console.log(`\n🌍 Multi-Provider-Übersetzer — ${targetLocales.length} Sprachen × ${PROVIDERS.length} Worker\n`)

  const ref = JSON.parse(fs.readFileSync(path.join(DICT_DIR, "en.json"), "utf8"))
  const refFlat = Object.fromEntries(
    Object.entries(getFlat(ref)).filter(([k]) => !SKIP_SECTIONS.some((s) => k.startsWith(s + ".")))
  )

  const tasks = buildTasks(targetLocales, refFlat)
  if (tasks.length === 0) {
    console.log("\n✅ Alle Sprachen vollständig. Nichts zu tun.")
    return
  }

  const state = { total: tasks.length, done: 0, keys: 0, errors: 0 }
  console.log(`\n📊 ${tasks.length} Batches in der Queue. ${PROVIDERS.length} Worker starten.\n${"─".repeat(60)}`)

  const startedAt = Date.now()
  await Promise.all(PROVIDERS.map((p) => runWorker(p, tasks, state)))
  const elapsedMin = ((Date.now() - startedAt) / 60000).toFixed(1)

  console.log("\n" + "═".repeat(60))
  console.log(`🎉 FERTIG in ${elapsedMin} min — ${state.keys} Keys übersetzt, ${state.errors} transient Fehler\n`)

  console.log("📊 Abschlussbericht:")
  const refTotal = Object.keys(refFlat).length
  for (const locale of Object.keys(LANG_NAMES)) {
    const dictPath = path.join(DICT_DIR, `${locale}.json`)
    if (!fs.existsSync(dictPath)) { console.log(`  ${locale.padEnd(4)} ✗ keine Datei`); continue }
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
