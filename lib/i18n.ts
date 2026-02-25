// WORLD BEAST: lib/i18n.ts
// Multilingual system: de/en (primary) + es/fr (bonus)
// Auto-detects language from URL prefix; Gemini auto-translates runbook metadata.

export type Locale = "de" | "en" | "es" | "fr"

export const SUPPORTED_LOCALES: Locale[] = ["de", "en", "es", "fr"]
export const DEFAULT_LOCALE: Locale = "de"

// ---------------------------------------------------------------------------
// Locale UI strings
// ---------------------------------------------------------------------------

export const UI_STRINGS: Record<Locale, Record<string, string>> = {
  de: {
    runbooks: "Runbooks",
    providers: "Anbieter",
    dashboard: "Dashboard",
    share: "Teilen",
    leaderboard: "Bestenliste",
    pricing: "Preise",
    check: "Score prüfen",
    tagline: "Die Nr. 1 globale Ops-Intelligence-Plattform 2026",
    runbookFor: "Runbook für",
    steps: "Schritte",
    related: "Ähnliche Runbooks",
    copyLink: "Link kopieren",
    shareTwitter: "Twitter-Thread",
    shareLinkedin: "LinkedIn-Post",
    shareReddit: "Reddit-Thread",
    freeBadge: "Kostenlos",
    proBadge: "Pro",
    worldbeastScore: "WorldBeast Score",
    healCycles: "Heal-Zyklen heute",
    revenueToday: "Umsatz heute",
    globalRank: "Globaler Rang",
    activateAll: "One-Click World Domination",
  },
  en: {
    runbooks: "Runbooks",
    providers: "Providers",
    dashboard: "Dashboard",
    share: "Share",
    leaderboard: "Leaderboard",
    pricing: "Pricing",
    check: "Check Score",
    tagline: "The #1 Global Ops Intelligence Platform 2026",
    runbookFor: "Runbook for",
    steps: "Steps",
    related: "Related Runbooks",
    copyLink: "Copy Link",
    shareTwitter: "Twitter Thread",
    shareLinkedin: "LinkedIn Post",
    shareReddit: "Reddit Thread",
    freeBadge: "Free",
    proBadge: "Pro",
    worldbeastScore: "WorldBeast Score",
    healCycles: "Heal cycles today",
    revenueToday: "Revenue today",
    globalRank: "Global Rank",
    activateAll: "One-Click World Domination",
  },
  es: {
    runbooks: "Runbooks",
    providers: "Proveedores",
    dashboard: "Panel",
    share: "Compartir",
    leaderboard: "Clasificación",
    pricing: "Precios",
    check: "Verificar Score",
    tagline: "La Plataforma de Ops Intelligence #1 Global 2026",
    runbookFor: "Runbook para",
    steps: "Pasos",
    related: "Runbooks Relacionados",
    copyLink: "Copiar enlace",
    shareTwitter: "Hilo de Twitter",
    shareLinkedin: "Post de LinkedIn",
    shareReddit: "Hilo de Reddit",
    freeBadge: "Gratis",
    proBadge: "Pro",
    worldbeastScore: "Puntuación WorldBeast",
    healCycles: "Ciclos de sanación hoy",
    revenueToday: "Ingresos hoy",
    globalRank: "Rango Global",
    activateAll: "Dominación Mundial con Un Clic",
  },
  fr: {
    runbooks: "Runbooks",
    providers: "Fournisseurs",
    dashboard: "Tableau de bord",
    share: "Partager",
    leaderboard: "Classement",
    pricing: "Tarifs",
    check: "Vérifier le Score",
    tagline: "La Plateforme Ops Intelligence #1 Mondiale 2026",
    runbookFor: "Runbook pour",
    steps: "Étapes",
    related: "Runbooks associés",
    copyLink: "Copier le lien",
    shareTwitter: "Fil Twitter",
    shareLinkedin: "Post LinkedIn",
    shareReddit: "Fil Reddit",
    freeBadge: "Gratuit",
    proBadge: "Pro",
    worldbeastScore: "Score WorldBeast",
    healCycles: "Cycles de guérison aujourd'hui",
    revenueToday: "Revenus aujourd'hui",
    globalRank: "Rang Mondial",
    activateAll: "Domination Mondiale en Un Clic",
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function t(locale: Locale, key: string): string {
  return UI_STRINGS[locale]?.[key] ?? UI_STRINGS[DEFAULT_LOCALE][key] ?? key
}

/** Detect locale from URL path segment (e.g. "/de/runbook/...") */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split("/").filter(Boolean)[0]?.toLowerCase() as Locale
  return SUPPORTED_LOCALES.includes(seg) ? seg : DEFAULT_LOCALE
}

/** Build the localized URL prefix for a given locale */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`
}

/** Return alternate hreflang links for SEO */
export function hreflangAlternates(path: string): { hreflang: string; href: string }[] {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  return SUPPORTED_LOCALES.map((locale) => ({
    hreflang: locale,
    href: `${base}/${locale}${path.startsWith("/") ? path : "/" + path}`,
  }))
}

// ---------------------------------------------------------------------------
// Gemini auto-translation
// ---------------------------------------------------------------------------

export type TranslatedRunbook = {
  title: string
  summary: string
  locale: Locale
}

/**
 * WORLD BEAST: Auto-translate runbook metadata via Gemini API.
 * Falls back to original text if Gemini is unavailable.
 */
export async function translateRunbook(opts: {
  slug: string
  title: string
  summary: string
  targetLocale: Locale
}): Promise<TranslatedRunbook> {
  const { slug, title, summary, targetLocale } = opts

  if (targetLocale === "de") {
    return { title, summary, locale: "de" }
  }

  const localeNames: Record<Locale, string> = {
    de: "German",
    en: "English",
    es: "Spanish",
    fr: "French",
  }

  const geminiKey = process.env.GEMINI_API_KEY
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash"
  const geminiBase = (
    process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "")

  if (!geminiKey) {
    return { title, summary, locale: targetLocale }
  }

  const prompt = [
    `Translate the following runbook title and summary from German to ${localeNames[targetLocale]}.`,
    "Keep technical terms (e.g. SSH, TLS, CORS, CVE, runbook) as-is.",
    "Return ONLY a JSON object: { \"title\": \"...\", \"summary\": \"...\" }",
    "",
    `Slug: ${slug}`,
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
    if (!res.ok) return { title, summary, locale: targetLocale }
    const data = await res.json()
    const text: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p?.text ?? "")
        .join("") ?? ""
    const jsonStr = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(jsonStr) as { title?: string; summary?: string }
    if (parsed.title && parsed.summary) {
      return { title: parsed.title, summary: parsed.summary, locale: targetLocale }
    }
  } catch {
    // fall through to default
  }

  return { title, summary, locale: targetLocale }
}
