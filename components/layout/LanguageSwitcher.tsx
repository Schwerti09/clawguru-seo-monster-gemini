'use client'

// NEXT-LEVEL UPGRADE 2026: Language Switcher with persistent cookie + URL prefix
// Supports all 10 locales with proper flag/name display and RTL indication.

import { useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Globe } from "lucide-react"
import { SUPPORTED_LOCALES, type Locale, isRTL } from "@/lib/i18n"

const LOCALE_META: Record<Locale, { flag: string; name: string; native: string }> = {
  de: { flag: "🇩🇪", name: "Deutsch", native: "Deutsch" },
  en: { flag: "🇺🇸", name: "English", native: "English" },
  es: { flag: "🇪🇸", name: "Spanish", native: "Español" },
  fr: { flag: "🇫🇷", name: "French", native: "Français" },
  pt: { flag: "🇧🇷", name: "Portuguese", native: "Português" },
  it: { flag: "🇮🇹", name: "Italian", native: "Italiano" },
  ru: { flag: "🇷🇺", name: "Russian", native: "Русский" },
  zh: { flag: "🇨🇳", name: "Chinese", native: "中文" },
  ja: { flag: "🇯🇵", name: "Japanese", native: "日本語" },
  ar: { flag: "🇸🇦", name: "Arabic", native: "العربية" },
}

interface LanguageSwitcherProps {
  currentLocale?: Locale
  /** Visual variant */
  variant?: "compact" | "full"
}

export default function LanguageSwitcher({
  currentLocale = "de",
  variant = "compact",
}: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = useCallback(
    (locale: Locale) => {
      if (locale === currentLocale) return

      // NEXT-LEVEL UPGRADE 2026: Persist in cookie (1 year)
      document.cookie = `cg_locale=${locale}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`

      // Build localized URL: strip existing locale prefix, add new one
      const segments = pathname.split("/").filter(Boolean)
      const firstSegment = segments[0] as Locale
      const hasLocalePrefix = SUPPORTED_LOCALES.includes(firstSegment)

      const restPath = hasLocalePrefix ? segments.slice(1).join("/") : segments.join("/")
      const newPath = locale === "de" ? `/${restPath}` : `/${locale}${restPath ? "/" + restPath : ""}`

      router.push(newPath)
    },
    [currentLocale, pathname, router]
  )

  if (variant === "full") {
    return (
      <div className="grid grid-cols-5 gap-2">
        {SUPPORTED_LOCALES.map((locale) => {
          const meta = LOCALE_META[locale]
          const isActive = locale === currentLocale
          return (
            <button
              key={locale}
              onClick={() => handleChange(locale)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                isActive
                  ? "bg-[#00ff9d]/10 border-[#00ff9d]/50 text-[#00ff9d]"
                  : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
              }`}
              title={meta.name}
            >
              <span className="text-lg">{meta.flag}</span>
              <span className="text-xs font-bold">{meta.native}</span>
              {isRTL(locale) && (
                <span className="text-[10px] text-gray-500">RTL</span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    // NEXT-LEVEL UPGRADE 2026: Compact language switcher
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors text-gray-400 hover:text-gray-200">
        <Globe className="w-3.5 h-3.5" />
        <span className="text-xs font-bold">{LOCALE_META[currentLocale].flag}</span>
        <span className="text-xs">{currentLocale.toUpperCase()}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
        {SUPPORTED_LOCALES.map((locale) => {
          const meta = LOCALE_META[locale]
          const isActive = locale === currentLocale
          return (
            <button
              key={locale}
              onClick={() => handleChange(locale)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/5 transition-colors ${
                isActive ? "bg-[#00ff9d]/5 text-[#00ff9d]" : "text-gray-300"
              }`}
            >
              <span className="text-base">{meta.flag}</span>
              <span className="text-sm">{meta.native}</span>
              {isRTL(locale) && (
                <span className="ml-auto text-[10px] text-gray-600 border border-gray-700 rounded px-1">RTL</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
