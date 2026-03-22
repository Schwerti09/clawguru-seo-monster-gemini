// Server-side dictionary loader for i18n
// Loads the appropriate JSON dictionary for a given locale and merges with
// the English fallback so that missing keys never produce empty strings.

import type { Locale } from "@/lib/i18n"
import { DEFAULT_LOCALE } from "@/lib/i18n"

/** Shape of every dictionary JSON file */
export type Dictionary = {
  common: {
    ctaDashboard: string
    ctaMissionControl: string
  }
  share: {
    myceliumBtn: string
    myceliumXBtn: string
    myceliumLinkedinBtn: string
    myceliumCta: string
    myceliumPost: string
    myceliumCount: string
    myceliumGenerating: string
    myceliumCopied: string
  }
  copilot: {
    greeting: string
    followup1: string
    followup2: string
    followup3: string
    followup4: string
    error: string
    mode: string
    emergencyLink: string
    launchpad: string
    you: string
    thinking: string
    placeholder: string
    send: string
    tip: string
    proAccess: string
    proTitle: string
    proDesc: string
    proLabel: string
    proSub: string
    dayPassLabel: string
    dayPassSub: string
    dayPassBtn: string
    allPlans: string
    links: string
    llmTitle: string
    llmDesc: string
  }
  live: {
    title: string
    subtitle: string
  }
  runbooks: {
    subtitle: string
  }
  hero: {
    badge: string
    /** Text displayed after the gradient "ClawGuru" brand prefix in the hero h1 */
    titleSuffix: string
    subtitle: string
    ctaMycelium: string
    ctaCopilot: string
    ctaProKits: string
    ctaIntel: string
    knowledgeEdges: string
    genesisProtocol: string
    nodeTooltip: string
    scrollLabel: string
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
    more: string
    clawVerse: string
    summon: string
    oracle: string
    neuro: string
    mycelium: string
    tags: string
    academy: string
    vault: string
    report: string
    downloads: string
    cases: string
    costs: string
    about: string
    login: string
    footerDescription: string
    footerDisclaimer: string
    footerHubs: string
    footerLegal: string
    imprint: string
    privacy: string
    terms: string
    trustCenter: string
    footerTrustCenter: string
    footerDiscord: string
    footerAffiliate: string
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

  pricing: {
    accessBadge: string
    title: string
    subtitle: string
    emergencyText: string
    emergencyLink: string
    featureComparison: string
    voiceCopilotLimited: string
    dayPassBadge: string
    dayPassDesc: string
    dayPassBtn: string
    dayPassMeta: string
    dayPassOnce: string
    mostPopular: string
    proBadge: string
    proDesc: string
    proBtn: string
    cancelable: string
    teamBadge: string
    teamDesc: string
    teamBtn: string
    enterpriseDesc: string
    enterpriseBtn: string
    enterpriseContact: string
    contactSectionTitle: string
    contactSectionDesc: string
    instantAccess: string
    instantAccessDesc: string
    noAccount: string
    noAccountDesc: string
    paymentIssue: string
    paymentIssueDesc: string
    faqDuration: string
    faqDurationA: string
    faqTransfer: string
    faqTransferA: string
    faqNoAccess: string
    faqNoAccessA: string
    faqCancel: string
    faqCancelA: string
    faqNewPro: string
    faqNewProA: string
    faqIntelligence: string
    faqIntelligenceA: string
    recoverLink: string
    monthly: string
    grpSecurity: string
    grpOps: string
    grpKnowledge: string
    grpLimits: string
    grpAllDayPass: string
    grpFeatureUnlocks: string
    grpIntelligence: string
    grpDeployment: string
    grpProExtras: string
    grpAllPro: string
    grpTeamCollab: string
    grpRoadmap: string
    grpEnterpriseUnlocks: string
    grpIntelFeedApi: string
    grpEnterpriseSupport: string
    newBadge: string
  }
  summon: {
    example_queries_items: string[]
    input_placeholder: string
    start_label: string
    analyzing_label: string
    attack_label: string
    attack_desc: string
    defense_label: string
    defense_desc: string
    recovery_label: string
    recovery_desc: string
    optimize_label: string
    optimize_desc: string
    voice_label: string
    voice_stop_label: string
    voice_lang: string
    voice_unsupported: string
    voice_no_speech: string
    voice_no_mic: string
    voice_perm_denied: string
    voice_error: string
    error_boundary_fallback: string
    free_limit_title: string
    free_limit_desc: string
    daypass_btn: string
    clawscore_label: string
    confidence_label: string
    eta_label: string
    view_link_label: string
    copy_label: string
    share_x_label: string
    share_linkedin_label: string
  }
  oracle: {
    title: string
    subtitle: string
    scope_label: string
    scope_placeholder: string
    add_scope: string
    remove: string
    predict_btn: string
    scope_hint: string
    risk_radar: string
    live_score: string
    cve_title: string
    runbook_label: string
    severity_low: string
    severity_medium: string
    severity_high: string
    severity_critical: string
    clawscore_label: string
    loading: string
    fetch_error: string
  }
  neuro: {
    title: string
    subtitle: string
    pick_stack: string
    add_stack: string
    input_placeholder: string
    recommend: string
    recommendations: string
    plan_title: string
    score_title: string
    confidence: string
    loading: string
    fetch_error: string
    available_label: string
    chosen_label: string
    runbook_label: string
    retry: string
  }
  intel: {
    hero_badge: string
    hero_title: string
    hero_subline: string
    cta_daypass: string
    upgrade_premium_label: string
    upgrade_title: string
    upgrade_text: string
    upgrade_button: string
    live_header: string
    live_loading: string
    live_error: string
    export_csv: string
    export_json: string
    export_pdf: string
    fix_link_label: string
    free_teaser_text: string
    free_teaser_button: string
    analyzer_header: string
    analyzer_input_placeholder: string
    analyzing_label: string
    analyze_btn: string
    feed_loading: string
    examples_label: string
    published_label: string
    recommended_runbook_label: string
    link_oracle: string
    link_mycelium: string
    link_neuro: string
    link_fix_page: string
    analyzer_error: string
    predictive_header: string
    predictive_loading: string
    predictive_more: string
    predictive_error: string
    myceliumPreview_header: string
    scope_all: string
    stats_header: string
    stats_loading: string
    stats_error: string
    tile_new_7d: string
    tile_with_runbooks: string
    tile_avg_cvss: string
    tile_top_services: string
    spark_title: string
  }
  vorstellung?: Record<string, unknown>
}

// Supported dictionary locales (JSON files that exist in /dictionaries)
const DICTIONARY_LOCALES = ["de", "en", "es", "fr", "pt", "it", "ru", "zh", "ja", "ar", "nl", "hi", "tr", "pl", "ko"] as const
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
  nl: () => import("@/dictionaries/nl.json").then((m) => m.default as unknown as Dictionary),
  hi: () => import("@/dictionaries/hi.json").then((m) => m.default as unknown as Dictionary),
  tr: () => import("@/dictionaries/tr.json").then((m) => m.default as unknown as Dictionary),
  pl: () => import("@/dictionaries/pl.json").then((m) => m.default as unknown as Dictionary),
  ko: () => import("@/dictionaries/ko.json").then((m) => m.default as unknown as Dictionary),
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
