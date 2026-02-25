// WORLD BEAST: lib/i18n.ts
// Multi-Language System – de/en with auto-detect + es/fr bonus languages.
// Provides translations, locale detection, and Gemini-powered runbook translation.

export type Locale = "de" | "en" | "es" | "fr"

export const SUPPORTED_LOCALES: Locale[] = ["de", "en", "es", "fr"]
export const DEFAULT_LOCALE: Locale = "de"

// ---------------------------------------------------------------------------
// Static UI translations
// ---------------------------------------------------------------------------

export type TranslationKey =
  | "runbook.breadcrumb"
  | "runbook.stepByStep"
  | "runbook.recheck"
  | "runbook.copilot"
  | "runbook.related"
  | "runbook.share"
  | "runbook.faq"
  | "runbook.notice"
  | "nav.runbooks"
  | "nav.check"
  | "nav.pricing"
  | "nav.copilot"
  | "home.kicker"
  | "home.title"
  | "home.subtitle"
  | "upsell.title"
  | "upsell.cta"

const translations: Record<Locale, Record<TranslationKey, string>> = {
  de: {
    "runbook.breadcrumb": "Runbooks",
    "runbook.stepByStep": "Schritt-für-Schritt",
    "runbook.recheck": "Re-Check starten →",
    "runbook.copilot": "Copilot Runbook Builder →",
    "runbook.related": "Verwandte Runbooks",
    "runbook.share": "Teilen",
    "runbook.faq": "Häufige Fragen (FAQ)",
    "runbook.notice": "Hinweis: Diese Inhalte sind für Ops/Security gedacht.",
    "nav.runbooks": "Runbooks",
    "nav.check": "Check",
    "nav.pricing": "Pricing",
    "nav.copilot": "Copilot",
    "home.kicker": "Ops Intelligence",
    "home.title": "ClawGuru – Nr. 1 Ops Platform",
    "home.subtitle": "Runbooks, Security Checks, KI-Copilot – alles automatisiert.",
    "upsell.title": "Unlock 500+ Runbooks für 9€/Monat",
    "upsell.cta": "Jetzt freischalten →",
  },
  en: {
    "runbook.breadcrumb": "Runbooks",
    "runbook.stepByStep": "Step by Step",
    "runbook.recheck": "Start Re-Check →",
    "runbook.copilot": "Copilot Runbook Builder →",
    "runbook.related": "Related Runbooks",
    "runbook.share": "Share",
    "runbook.faq": "Frequently Asked Questions",
    "runbook.notice": "Note: This content is intended for Ops/Security professionals.",
    "nav.runbooks": "Runbooks",
    "nav.check": "Check",
    "nav.pricing": "Pricing",
    "nav.copilot": "Copilot",
    "home.kicker": "Ops Intelligence",
    "home.title": "ClawGuru – #1 Ops Platform",
    "home.subtitle": "Runbooks, Security Checks, AI Copilot – fully automated.",
    "upsell.title": "Unlock 500+ Runbooks for €9/month",
    "upsell.cta": "Unlock now →",
  },
  es: {
    "runbook.breadcrumb": "Runbooks",
    "runbook.stepByStep": "Paso a paso",
    "runbook.recheck": "Iniciar Re-Check →",
    "runbook.copilot": "Copilot Runbook Builder →",
    "runbook.related": "Runbooks relacionados",
    "runbook.share": "Compartir",
    "runbook.faq": "Preguntas frecuentes",
    "runbook.notice": "Nota: Este contenido está destinado a profesionales de Ops/Seguridad.",
    "nav.runbooks": "Runbooks",
    "nav.check": "Check",
    "nav.pricing": "Precios",
    "nav.copilot": "Copilot",
    "home.kicker": "Inteligencia Ops",
    "home.title": "ClawGuru – Plataforma Ops #1",
    "home.subtitle": "Runbooks, Checks de Seguridad, Copilot IA – completamente automatizado.",
    "upsell.title": "Desbloquea 500+ Runbooks por €9/mes",
    "upsell.cta": "Desbloquear ahora →",
  },
  fr: {
    "runbook.breadcrumb": "Runbooks",
    "runbook.stepByStep": "Étape par étape",
    "runbook.recheck": "Démarrer Re-Check →",
    "runbook.copilot": "Copilot Runbook Builder →",
    "runbook.related": "Runbooks associés",
    "runbook.share": "Partager",
    "runbook.faq": "Questions fréquentes (FAQ)",
    "runbook.notice": "Remarque : Ce contenu est destiné aux professionnels Ops/Sécurité.",
    "nav.runbooks": "Runbooks",
    "nav.check": "Check",
    "nav.pricing": "Tarifs",
    "nav.copilot": "Copilot",
    "home.kicker": "Intelligence Ops",
    "home.title": "ClawGuru – Plateforme Ops #1",
    "home.subtitle": "Runbooks, Contrôles de Sécurité, Copilot IA – entièrement automatisé.",
    "upsell.title": "Déverrouillez 500+ Runbooks pour €9/mois",
    "upsell.cta": "Débloquer maintenant →",
  },
}

/** Returns a translation string for a given key and locale. */
export function t(key: TranslationKey, locale: Locale = DEFAULT_LOCALE): string {
  return translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key]
}

// ---------------------------------------------------------------------------
// Locale detection
// ---------------------------------------------------------------------------

/**
 * WORLD BEAST: Detect the best locale from an Accept-Language header string.
 * Falls back to DEFAULT_LOCALE ("de") if nothing matches.
 */
export function detectLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const candidates = acceptLanguage
    .split(",")
    .map((s) => {
      const [lang, q] = s.trim().split(";q=")
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 }
    })
    .sort((a, b) => b.q - a.q)
    .map((c) => c.lang.slice(0, 2))

  for (const candidate of candidates) {
    if (SUPPORTED_LOCALES.includes(candidate as Locale)) return candidate as Locale
  }
  return DEFAULT_LOCALE
}

/** Validate that a path segment is a supported locale. */
export function isValidLocale(segment: string): segment is Locale {
  return SUPPORTED_LOCALES.includes(segment as Locale)
}

// ---------------------------------------------------------------------------
// Gemini-powered runbook translation
// ---------------------------------------------------------------------------

export type TranslatedRunbookSnippet = {
  title: string
  summary: string
  locale: Locale
}

/**
 * WORLD BEAST: Translates runbook title + summary into a target locale via Gemini.
 * Returns null if Gemini is unavailable or translation fails.
 */
export async function translateRunbookSnippet(opts: {
  title: string
  summary: string
  targetLocale: Locale
}): Promise<TranslatedRunbookSnippet | null> {
  const { title, summary, targetLocale } = opts
  if (targetLocale === "de") return { title, summary, locale: "de" }

  const geminiKey = process.env.GEMINI_API_KEY
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash"
  const geminiBase = (
    process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "")

  if (!geminiKey) return null

  const languageNames: Record<Locale, string> = {
    de: "German",
    en: "English",
    es: "Spanish",
    fr: "French",
  }

  const prompt = [
    `Translate the following runbook metadata from German to ${languageNames[targetLocale]}.`,
    "Return ONLY a JSON object with keys: title (string), summary (string, max 160 chars).",
    "Do not add any explanation outside the JSON.",
    "",
    `Title: ${title}`,
    `Summary: ${summary}`,
  ].join("\n")

  try {
    const url = `${geminiBase}/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
      }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts
    const text: string = Array.isArray(parts)
      ? parts.map((p: { text?: string }) => p?.text ?? "").join("").trim()
      : ""
    if (!text) return null
    const jsonStr = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(jsonStr) as { title?: string; summary?: string }
    if (parsed.title && parsed.summary) {
      return { title: parsed.title, summary: parsed.summary, locale: targetLocale }
    }
    return null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/** Build a localised runbook URL. */
export function localizedRunbookUrl(slug: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return `/runbook/${slug}`
  return `/${locale}/runbook/${slug}`
}

/** Build a localised site URL for hreflang tags. */
export function hreflangUrls(path: string): Array<{ locale: Locale; url: string }> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org").replace(/\/$/, "")
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    url: locale === DEFAULT_LOCALE ? `${base}${path}` : `${base}/${locale}${path}`,
  }))
}
