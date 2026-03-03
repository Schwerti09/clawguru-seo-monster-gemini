// Server-side dictionary loader for i18n
// Loads the appropriate JSON dictionary for a given locale and merges with
// the English fallback so that missing keys never produce empty strings.

import type { Locale } from "@/lib/i18n"
import { DEFAULT_LOCALE } from "@/lib/i18n"

/** Shape of every dictionary JSON file */
export type Dictionary = {
  hero: {
    badge: string
    /** Text displayed after the gradient "ClawGuru" brand prefix in the hero h1 */
    titleSuffix: string
    subtitle: string
    ctaMycelium: string
    ctaCopilot: string
    ctaProKits: string
    ctaIntel: string
    miniCopilotTitle: string
    miniCopilotSubtitle: string
    miniCopilotPlaceholder: string
    miniCopilotSubmit: string
    popularPromptsTitle: string
    noLoginNote: string
    featureCopilot: string
    featureCopilotDesc: string
    featureVault: string
    featureVaultDesc: string
    featureAcademy: string
    featureAcademyDesc: string
  }
  nav: {
    live: string
    securityCheck: string
    copilot: string
    runbooks: string
    intelFeed: string
    pricing: string
    emergency: string
    proKits: string
  }
  dayPass: {
    label: string
  }
  jackpot: {
    kicker: string
    title: string
    subtitle: string
    liveScore: string
    liveScoreDesc: string
    copilotRunbooks: string
    copilotRunbooksDesc: string
    kitsTemplates: string
    kitsTemplatesDesc: string
    liveOpsWall: string
    liveOpsWallDesc: string
    runbooksLink: string
    allPlans: string
    discordOpsRoom: string
    proTip: string
    activateAccess: string
    then: string
  }
  faq: {
    kicker: string
    title: string
    subtitle: string
    q1: string
    a1: string
    q2: string
    a2: string
    q3: string
    a3: string
    q4: string
    a4: string
  }
  home: {
    clawVerseKicker: string
    clawVerseTitle: string
    clawVerseDesc: string
    clawVerseCta: string
    genesisProtocol: string
    myceliumTitle: string
    myceliumDesc: string
    openMycelium: string
  }
}

// Supported dictionary locales (JSON files that exist in /dictionaries)
const DICTIONARY_LOCALES = ["de", "en", "es", "fr", "pt", "it", "ru", "zh", "ja", "ar"] as const
type DictionaryLocale = (typeof DICTIONARY_LOCALES)[number]

const loaders: Record<DictionaryLocale, () => Promise<Dictionary>> = {
  de: () => import("@/dictionaries/de.json").then((m) => m.default as unknown as Dictionary),
  en: () => import("@/dictionaries/en.json").then((m) => m.default as unknown as Dictionary),
  es: () => import("@/dictionaries/es.json").then((m) => m.default as unknown as Dictionary),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default as unknown as Dictionary),
  pt: () => import("@/dictionaries/pt.json").then((m) => m.default as unknown as Dictionary),
  it: () => import("@/dictionaries/it.json").then((m) => m.default as unknown as Dictionary),
  ru: () => import("@/dictionaries/ru.json").then((m) => m.default as unknown as Dictionary),
  zh: () => import("@/dictionaries/zh.json").then((m) => m.default as unknown as Dictionary),
  ja: () => import("@/dictionaries/ja.json").then((m) => m.default as unknown as Dictionary),
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default as unknown as Dictionary),
}

/** Returns the best available dictionary locale for the given locale. */
function resolveLoader(locale: Locale): DictionaryLocale {
  if ((DICTIONARY_LOCALES as readonly string[]).includes(locale)) {
    return locale as DictionaryLocale
  }
  // Fall back to English for unsupported locales, then to DEFAULT_LOCALE
  if ((DICTIONARY_LOCALES as readonly string[]).includes("en")) return "en"
  return DEFAULT_LOCALE as DictionaryLocale
}

/**
 * Loads the dictionary for the given locale.
 * Falls back to English (then German) for any missing keys so the UI
 * never shows an empty string or throws an error.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const targetKey = resolveLoader(locale)

  try {
    const dict = await loaders[targetKey]()

    // For non-default locales, deep-merge with the English fallback so that
    // any missing key is automatically filled in.
    if (targetKey !== "en") {
      const fallback = await loaders["en"]()
      return deepMerge(fallback, dict)
    }

    return dict
  } catch {
    // Last-resort: return default-locale dictionary
    return loaders[DEFAULT_LOCALE as DictionaryLocale]()
  }
}

/** Recursively fills missing keys in `target` from `source`. */
function deepMerge<T extends object>(source: T, target: Partial<T>): T {
  const result = { ...source } as T
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sv = source[key]
    const tv = target[key]
    if (tv !== undefined && tv !== null) {
      if (typeof sv === "object" && !Array.isArray(sv) && typeof tv === "object") {
        result[key] = deepMerge(sv as object, tv as object) as T[keyof T]
      } else {
        result[key] = tv as T[keyof T]
      }
    }
  }
  return result
}
