// WORLD BEAST: lib/i18n.ts
// NEXT-LEVEL UPGRADE 2026: 10-language system with RTL support
// de/en (primary) + es/fr/pt/it/ru/zh-CN/ja/ar
// Auto-detects language from URL prefix; Gemini auto-translates runbook metadata.

export type Locale = "de" | "en" | "es" | "fr" | "pt" | "it" | "ru" | "zh" | "ja" | "ar"

export const SUPPORTED_LOCALES: Locale[] = ["de", "en", "es", "fr", "pt", "it", "ru", "zh", "ja", "ar"]
export const DEFAULT_LOCALE: Locale = "de"

// NEXT-LEVEL UPGRADE 2026: RTL locales
export const RTL_LOCALES: Locale[] = ["ar"]

/** Returns true if the locale uses right-to-left text direction */
export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale)
}

/** Returns the HTML dir attribute value for a locale */
export function localeDir(locale: Locale): "rtl" | "ltr" {
  return isRTL(locale) ? "rtl" : "ltr"
}

/** Maps locale code to BCP-47 language tag for hreflang */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  de: "de",
  en: "en",
  es: "es",
  fr: "fr",
  pt: "pt",
  it: "it",
  ru: "ru",
  zh: "zh-CN",
  ja: "ja",
  ar: "ar",
}

// ---------------------------------------------------------------------------
// Locale UI strings
// ---------------------------------------------------------------------------

// NEXT-LEVEL UPGRADE 2026: Extended to 10 languages
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
    faq: "Häufige Fragen",
    lastUpdated: "Zuletzt aktualisiert",
    sourcesStandards: "Quellen & Standards",
    runbooksSubtitle: "Jede Seite ist ein Einstiegspunkt: Problem → Fix → Verifikation.",
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
    faq: "Frequently Asked Questions",
    lastUpdated: "Last updated",
    sourcesStandards: "Sources & Standards",
    runbooksSubtitle: "Every page is an entry point: Problem → Fix → Verification.",
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
    faq: "Preguntas Frecuentes",
    lastUpdated: "Última actualización",
    sourcesStandards: "Fuentes y Estándares",
    runbooksSubtitle: "Cada página es un punto de entrada: Problema → Solución → Verificación.",
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
    faq: "Foire Aux Questions",
    lastUpdated: "Dernière mise à jour",
    sourcesStandards: "Sources & Normes",
    runbooksSubtitle: "Chaque page est un point d'entrée : Problème → Correction → Vérification.",
  },
  // NEXT-LEVEL UPGRADE 2026: Portuguese
  pt: {
    runbooks: "Runbooks",
    providers: "Provedores",
    dashboard: "Painel",
    share: "Compartilhar",
    leaderboard: "Classificação",
    pricing: "Preços",
    check: "Verificar Score",
    tagline: "A Plataforma de Ops Intelligence #1 Global 2026",
    runbookFor: "Runbook para",
    steps: "Passos",
    related: "Runbooks Relacionados",
    copyLink: "Copiar link",
    shareTwitter: "Thread no Twitter",
    shareLinkedin: "Post no LinkedIn",
    shareReddit: "Thread no Reddit",
    freeBadge: "Grátis",
    proBadge: "Pro",
    worldbeastScore: "Pontuação WorldBeast",
    healCycles: "Ciclos de cura hoje",
    revenueToday: "Receita hoje",
    globalRank: "Classificação Global",
    activateAll: "Dominação Mundial com Um Clique",
    faq: "Perguntas Frequentes",
    lastUpdated: "Última atualização",
    sourcesStandards: "Fontes & Padrões",
    runbooksSubtitle: "Cada página é um ponto de entrada: Problema → Correção → Verificação.",
  },
  // NEXT-LEVEL UPGRADE 2026: Italian
  it: {
    runbooks: "Runbooks",
    providers: "Provider",
    dashboard: "Dashboard",
    share: "Condividi",
    leaderboard: "Classifica",
    pricing: "Prezzi",
    check: "Controlla Score",
    tagline: "La Piattaforma Ops Intelligence #1 Globale 2026",
    runbookFor: "Runbook per",
    steps: "Passi",
    related: "Runbooks Correlati",
    copyLink: "Copia link",
    shareTwitter: "Thread Twitter",
    shareLinkedin: "Post LinkedIn",
    shareReddit: "Thread Reddit",
    freeBadge: "Gratis",
    proBadge: "Pro",
    worldbeastScore: "Punteggio WorldBeast",
    healCycles: "Cicli di guarigione oggi",
    revenueToday: "Entrate oggi",
    globalRank: "Classifica Globale",
    activateAll: "Dominazione Mondiale in Un Click",
    faq: "Domande Frequenti",
    lastUpdated: "Ultimo aggiornamento",
    sourcesStandards: "Fonti & Standard",
    runbooksSubtitle: "Ogni pagina è un punto di ingresso: Problema → Soluzione → Verifica.",
  },
  // NEXT-LEVEL UPGRADE 2026: Russian
  ru: {
    runbooks: "Runbooks",
    providers: "Провайдеры",
    dashboard: "Панель",
    share: "Поделиться",
    leaderboard: "Рейтинг",
    pricing: "Цены",
    check: "Проверить Score",
    tagline: "Платформа Ops Intelligence #1 в Мире 2026",
    runbookFor: "Runbook для",
    steps: "Шаги",
    related: "Похожие Runbooks",
    copyLink: "Копировать ссылку",
    shareTwitter: "Тред в Twitter",
    shareLinkedin: "Пост в LinkedIn",
    shareReddit: "Тред в Reddit",
    freeBadge: "Бесплатно",
    proBadge: "Pro",
    worldbeastScore: "Рейтинг WorldBeast",
    healCycles: "Циклов восстановления сегодня",
    revenueToday: "Доход сегодня",
    globalRank: "Глобальный рейтинг",
    activateAll: "Мировое господство в один клик",
    faq: "Часто задаваемые вопросы",
    lastUpdated: "Последнее обновление",
    sourcesStandards: "Источники & Стандарты",
    runbooksSubtitle: "Каждая страница — точка входа: Проблема → Исправление → Верификация.",
  },
  // NEXT-LEVEL UPGRADE 2026: Chinese (Simplified)
  zh: {
    runbooks: "运维手册",
    providers: "服务商",
    dashboard: "仪表板",
    share: "分享",
    leaderboard: "排行榜",
    pricing: "价格",
    check: "检查评分",
    tagline: "2026年全球顶级运维智能平台",
    runbookFor: "运维手册：",
    steps: "步骤",
    related: "相关运维手册",
    copyLink: "复制链接",
    shareTwitter: "Twitter话题",
    shareLinkedin: "LinkedIn帖子",
    shareReddit: "Reddit话题",
    freeBadge: "免费",
    proBadge: "专业版",
    worldbeastScore: "WorldBeast评分",
    healCycles: "今日修复周期",
    revenueToday: "今日收益",
    globalRank: "全球排名",
    activateAll: "一键全球主导",
    faq: "常见问题",
    lastUpdated: "最后更新",
    sourcesStandards: "来源与标准",
    runbooksSubtitle: "每个页面都是入口点：问题 → 修复 → 验证。",
  },
  // NEXT-LEVEL UPGRADE 2026: Japanese
  ja: {
    runbooks: "ランブック",
    providers: "プロバイダー",
    dashboard: "ダッシュボード",
    share: "シェア",
    leaderboard: "ランキング",
    pricing: "料金",
    check: "スコア確認",
    tagline: "2026年グローバルNo.1 Opsインテリジェンスプラットフォーム",
    runbookFor: "ランブック：",
    steps: "手順",
    related: "関連ランブック",
    copyLink: "リンクをコピー",
    shareTwitter: "Twitterスレッド",
    shareLinkedin: "LinkedInポスト",
    shareReddit: "Redditスレッド",
    freeBadge: "無料",
    proBadge: "プロ",
    worldbeastScore: "WorldBeastスコア",
    healCycles: "本日の修復サイクル",
    revenueToday: "本日の収益",
    globalRank: "グローバルランキング",
    activateAll: "ワンクリック世界制覇",
    faq: "よくある質問",
    lastUpdated: "最終更新",
    sourcesStandards: "ソース & 標準",
    runbooksSubtitle: "すべてのページがエントリーポイント：問題 → 修正 → 検証。",
  },
  // NEXT-LEVEL UPGRADE 2026: Arabic (RTL)
  ar: {
    runbooks: "الدفاتر التشغيلية",
    providers: "مزودو الخدمة",
    dashboard: "لوحة التحكم",
    share: "مشاركة",
    leaderboard: "لوحة الصدارة",
    pricing: "الأسعار",
    check: "فحص النقاط",
    tagline: "المنصة العالمية الأولى للذكاء التشغيلي 2026",
    runbookFor: "دفتر تشغيلي لـ",
    steps: "الخطوات",
    related: "دفاتر تشغيلية ذات صلة",
    copyLink: "نسخ الرابط",
    shareTwitter: "موضوع تويتر",
    shareLinkedin: "منشور لينكدإن",
    shareReddit: "موضوع ريديت",
    freeBadge: "مجاني",
    proBadge: "احترافي",
    worldbeastScore: "نقاط WorldBeast",
    healCycles: "دورات الإصلاح اليوم",
    revenueToday: "الإيرادات اليوم",
    globalRank: "الترتيب العالمي",
    activateAll: "الهيمنة العالمية بنقرة واحدة",
    faq: "الأسئلة الشائعة",
    lastUpdated: "آخر تحديث",
    sourcesStandards: "المصادر والمعايير",
    runbooksSubtitle: "كل صفحة هي نقطة دخول: المشكلة → الإصلاح → التحقق.",
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
  // NEXT-LEVEL UPGRADE 2026: Use proper BCP-47 hreflang tags for all 10 locales
  return SUPPORTED_LOCALES.map((locale) => ({
    hreflang: LOCALE_HREFLANG[locale],
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

  // NEXT-LEVEL UPGRADE 2026: All 10 locale names for Gemini translation
  const localeNames: Record<Locale, string> = {
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
