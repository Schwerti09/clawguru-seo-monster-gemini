// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Locale-aware page: /[lang]/summon – e.g. /de/summon, /en/summon, /fr/summon

import type { Metadata } from "next";
import CosmicSummon from "@/components/visual/CosmicSummon";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

export const revalidate = false;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const params = await props.params;
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  return {
    title: "COSMIC INTER-AI SUMMON | ClawGuru",
    description:
      "Open a direct line to the OpenAI Core. Powered by ClawGuru's Mycelium Network and Gemini AI. Theatrical simulation.",
    alternates: { canonical: `/${locale}/summon` },
    robots: { index: false, follow: false },
  };
}

export default async function LocaleSummonPage(
  props: { params: Promise<{ lang: string }> },
) {
  const params = await props.params;
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;
  return <CosmicSummon locale={locale} />;
}
