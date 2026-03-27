import React, { Suspense } from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"

const IntelNexusClient = dynamic(() => import("@/components/intel/IntelNexusClient"))

// Client-only visualizations are hosted inside IntelClientBlock

export const revalidate = 300

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return { alternates: { canonical: `/${locale}/intel` } }
}

export default async function LocaleIntelPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  await getDictionary(locale)
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Lade Mycelium...</div>}>
      <IntelNexusClient />
    </Suspense>
  )
}
