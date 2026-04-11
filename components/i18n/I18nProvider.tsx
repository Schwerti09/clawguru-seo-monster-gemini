'use client'

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import type { Dictionary } from "@/lib/getDictionary"

type I18nContextValue = {
  locale: Locale
  dict: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

const dictionaryLoaders: Partial<Record<Locale, () => Promise<Dictionary>>> = {
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
  af: () => import("@/dictionaries/af.json").then((m) => m.default as unknown as Dictionary),
}

function loadDictionary(locale: Locale): Promise<Dictionary> {
  const load =
    dictionaryLoaders[locale] ??
    dictionaryLoaders.en ??
    dictionaryLoaders[DEFAULT_LOCALE]

  if (!load) {
    throw new Error("No dictionary loader configured")
  }

  return load()
}

function localeFromPathname(pathname: string | null): Locale {
  const first = pathname?.split("/").filter(Boolean)[0]?.toLowerCase() as Locale | undefined
  if (first && SUPPORTED_LOCALES.includes(first)) return first
  return DEFAULT_LOCALE
}

export function I18nProvider(props: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  const pathname = usePathname()
  const pathLocale = localeFromPathname(pathname)
  const [locale, setLocale] = useState<Locale>(props.locale)
  const [dict, setDict] = useState<Dictionary>(props.dict)

  useEffect(() => {
    setLocale(props.locale)
    setDict(props.dict)
  }, [props.locale, props.dict])

  useEffect(() => {
    if (pathLocale === locale) return

    let cancelled = false

    loadDictionary(pathLocale)
      .then((nextDict) => {
        if (cancelled) return
        setLocale(pathLocale)
        setDict(nextDict)
      })
      .catch(() => {
        if (cancelled) return
        setLocale(pathLocale)
      })

    return () => {
      cancelled = true
    }
  }, [locale, pathLocale])

  const value = useMemo(() => ({ locale, dict }), [locale, dict])

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within <I18nProvider>")
  }
  return ctx
}
