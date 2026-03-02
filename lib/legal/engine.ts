import { apiCacheGet, apiCacheSet, buildCacheKey } from "@/lib/api-cache"
import { BRAND, LEGAL_INFO } from "@/lib/constants"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"

export type LegalRegion = "DE" | "EU" | "US" | "GLOBAL"
export type LegalDocumentType = "terms" | "privacy" | "impressum"

export type LegalBundle = {
  locale: Locale
  region: LegalRegion
  terms: string
  privacy: string
  impressum: string
  aiGenerated: boolean
  generatedAt: string
}

const EU_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
])

const LOCALE_NAMES: Record<Locale, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  it: "Italian",
  ru: "Russian",
  zh: "Simplified Chinese",
  ja: "Japanese",
  ar: "Arabic",
}

const DOC_TTL_SECONDS = 60 * 60 * 24
const GEO_TTL_SECONDS = 60 * 60 * 6

function normalizeLocale(locale?: string | null): Locale {
  const lower = (locale || "").toLowerCase() as Locale
  return SUPPORTED_LOCALES.includes(lower) ? lower : DEFAULT_LOCALE
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true
  if (ip === "::1" || ip.startsWith("fd") || ip.startsWith("fe80")) return true
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("127.")) return true
  if (ip.startsWith("172.")) {
    const second = Number(ip.split(".")[1])
    return second >= 16 && second <= 31
  }
  return false
}

function cleanIp(raw: string | null | undefined): string {
  const trimmed = String(raw || "").split(",")[0]?.trim() || ""
  if (!trimmed) return ""
  if (trimmed.includes(".") && trimmed.includes(":")) {
    return trimmed.split(":")[0] || trimmed
  }
  return trimmed
}

async function getCountryForIp(ip: string): Promise<string | null> {
  const cleaned = cleanIp(ip)
  if (!cleaned || cleaned === "unknown" || isPrivateIp(cleaned)) return null

  const cacheKey = buildCacheKey("legal:geo", { ip: cleaned })
  const cached = apiCacheGet<string>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(cleaned)}/country/`, {
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(4_000),
    })
    if (!res.ok) return null
    const country = (await res.text()).trim().toUpperCase()
    if (!country) return null
    apiCacheSet(cacheKey, country, GEO_TTL_SECONDS)
    return country
  } catch {
    return null
  }
}

async function resolveRegion(ip: string, locale: Locale): Promise<LegalRegion> {
  const country = await getCountryForIp(ip)
  if (country === "DE" || locale === "de") return "DE"
  if (country === "US") return "US"
  if (country && EU_COUNTRIES.has(country)) return "EU"
  if (!country && locale === "en") return "US"
  return "GLOBAL"
}

type LegalDocResult = { text: string; aiGenerated: boolean }

function buildFallbackDoc(type: LegalDocumentType, locale: Locale, region: LegalRegion): string {
  const companyLine = `${LEGAL_INFO.company} · ${LEGAL_INFO.address}, ${LEGAL_INFO.city}`
  if (locale === "de") {
    if (type === "impressum") {
      return [
        "Impressum",
        `Anbieter: ${LEGAL_INFO.company}`,
        `Inhaber: ${LEGAL_INFO.owner}`,
        `Adresse: ${LEGAL_INFO.address}, ${LEGAL_INFO.city}`,
        `Kontakt: ${LEGAL_INFO.email}`,
        `Hinweis: ${LEGAL_INFO.taxNote}`,
      ].join("\n")
    }
    if (type === "privacy") {
      return [
        "Datenschutzerklärung (Kurzfassung)",
        `Verantwortlich: ${LEGAL_INFO.company}, ${LEGAL_INFO.address}, ${LEGAL_INFO.city}.`,
        "Wir verarbeiten technische Zugriffsdaten (IP, User-Agent, Logs) sowie Zahlungsdaten über Stripe.",
        "Bei aktivierten KI-Funktionen können Eingaben an externe KI-Anbieter übertragen werden.",
        `Rechte nach DSGVO: Auskunft, Löschung, Widerspruch. Kontakt: ${LEGAL_INFO.email}.`,
      ].join("\n")
    }
    return [
      "AGB (Kurzfassung)",
      `${companyLine}. Kontakt: ${LEGAL_INFO.email}.`,
      "ClawGuru bietet digitale Security-Checks, Runbooks und kostenpflichtige Zugänge (Pro/Team/Day Pass).",
      "Nutzung auf eigene Verantwortung, kein Ersatz für Sicherheits- oder Rechtsberatung.",
      "Es gilt deutsches Recht.",
    ].join("\n")
  }

  if (type === "impressum") {
    return [
      "Legal Notice",
      `Provider: ${LEGAL_INFO.company}`,
      `Owner: ${LEGAL_INFO.owner}`,
      `Address: ${LEGAL_INFO.address}, ${LEGAL_INFO.city}`,
      `Contact: ${LEGAL_INFO.email}`,
    ].join("\n")
  }
  if (type === "privacy") {
    const rights =
      region === "US"
        ? "US privacy rights (e.g. CCPA/CPRA) apply where relevant. Contact us for access or deletion requests."
        : "GDPR-style rights apply where relevant. Contact us for access or deletion requests."
    return [
      "Privacy Policy (Short)",
      `Controller: ${LEGAL_INFO.company} (${LEGAL_INFO.address}, ${LEGAL_INFO.city}).`,
      "We process access logs, payment data via Stripe, and optional AI inputs to deliver services.",
      rights,
      `Contact: ${LEGAL_INFO.email}.`,
    ].join("\n")
  }

  return [
    "Terms of Service (Short)",
    `${companyLine}. Contact: ${LEGAL_INFO.email}.`,
    "ClawGuru provides digital security guidance, runbooks, and paid access plans.",
    "Use at your own risk; no guarantee of completeness or legal advice.",
  ].join("\n")
}

async function callGemini(prompt: string): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash"
  const geminiBase = (
    process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "")
  if (!geminiKey) return null

  try {
    const url = `${geminiBase}/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
      }),
      signal: AbortSignal.timeout(20_000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts
    if (Array.isArray(parts)) {
      const text = parts.map((p: { text?: string }) => p?.text ?? "").join("").trim()
      return text || null
    }
    return null
  } catch {
    return null
  }
}

async function callOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a privacy and compliance counsel." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
      signal: AbortSignal.timeout(20_000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const content = data?.choices?.[0]?.message?.content?.trim()
    return content || null
  } catch {
    return null
  }
}

async function callAi(prompt: string): Promise<string | null> {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase()
  if (provider === "gemini") return callGemini(prompt)
  return callOpenAI(prompt)
}

function buildPrompt(type: LegalDocumentType, locale: Locale, region: LegalRegion): string {
  const language = LOCALE_NAMES[locale]
  const jurisdiction =
    region === "DE"
      ? "German law (TMG/TTDSG) and GDPR"
      : region === "EU"
        ? "GDPR (EU)"
        : region === "US"
          ? "US privacy laws (CCPA/CPRA) and FTC guidelines"
          : "global baseline privacy and consumer protection rules"

  const heading =
    type === "terms"
      ? "Terms of Service"
      : type === "privacy"
        ? "Privacy Policy"
        : "Impressum / Legal Notice"

  const requirements =
    type === "privacy"
      ? "Include data categories (logs, payment via Stripe, optional AI inputs), purpose, retention, user rights, and contact."
      : type === "terms"
        ? "Include scope of service, subscription access (Pro/Team/Day Pass), payment terms, liability disclaimer, and governing law."
        : "Include company owner, address, contact, and tax note. For non-DE users provide a Legal Notice in English."

  return [
    `Write a concise ${heading} for ${BRAND.name} (${BRAND.domain}).`,
    `Jurisdiction focus: ${jurisdiction}.`,
    `Company: ${LEGAL_INFO.company}. Owner: ${LEGAL_INFO.owner}. Address: ${LEGAL_INFO.address}, ${LEGAL_INFO.city}. Email: ${LEGAL_INFO.email}. Tax note: ${LEGAL_INFO.taxNote}.`,
    "Services: security checks, runbooks, AI copilot, digital downloads, paid subscriptions (Pro/Team/Day Pass).",
    `Language: ${language}.`,
    "Output plain text with short headings and paragraphs. No markdown code fences.",
    requirements,
  ].join("\n")
}

async function generateLegalDoc(
  type: LegalDocumentType,
  locale: Locale,
  region: LegalRegion
): Promise<LegalDocResult> {
  const prompt = buildPrompt(type, locale, region)
  const aiText = await callAi(prompt)
  if (aiText && aiText.trim()) {
    return { text: aiText.trim(), aiGenerated: true }
  }
  return { text: buildFallbackDoc(type, locale, region), aiGenerated: false }
}

export async function getLegalBundle(params: {
  ip: string
  locale?: string | null
}): Promise<LegalBundle> {
  const locale = normalizeLocale(params.locale)
  const region = await resolveRegion(params.ip, locale)
  const cacheKey = buildCacheKey("legal:bundle", { locale, region })

  const cached = apiCacheGet<LegalBundle>(cacheKey)
  if (cached) return cached

  const [terms, privacy, impressum] = await Promise.all([
    generateLegalDoc("terms", locale, region),
    generateLegalDoc("privacy", locale, region),
    generateLegalDoc("impressum", locale, region),
  ])

  const bundle: LegalBundle = {
    locale,
    region,
    terms: terms.text,
    privacy: privacy.text,
    impressum: impressum.text,
    aiGenerated: terms.aiGenerated && privacy.aiGenerated && impressum.aiGenerated,
    generatedAt: new Date().toISOString(),
  }

  apiCacheSet(cacheKey, bundle, DOC_TTL_SECONDS)
  return bundle
}

export async function getLegalDocument(params: {
  ip: string
  locale?: string | null
  type: LegalDocumentType
}): Promise<string> {
  const bundle = await getLegalBundle({ ip: params.ip, locale: params.locale })
  if (params.type === "terms") return bundle.terms
  if (params.type === "privacy") return bundle.privacy
  return bundle.impressum
}
