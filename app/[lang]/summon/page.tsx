import type { Metadata } from "next"
import dynamic from "next/dynamic"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { metadata as rootMetadata } from "@/app/summon/page"
import { getDictionary } from "@/lib/getDictionary"
import SummonHero from "@/components/summon/SummonHero"
import HowItWorks from "@/components/summon/HowItWorks"
import UpgradeCTA from "@/components/shared/UpgradeCTA"
import { BASE_URL } from "@/lib/config"
import { pick } from "@/lib/i18n-pick"
import { RUNBOOK_COUNT_LONG_DE, RUNBOOK_COUNT_LONG_EN } from "@/lib/stats"

const SummonRealClient = dynamic(() => import("@/components/summon/SummonRealClient"))

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const title = pick(isDE, "Claw Swarm Oracle — Summon | ClawGuru", "Claw Swarm Oracle — Summon | ClawGuru")

  const description = pick(isDE, `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`, `ClawGuru is the AI-powered SecOps platform with over ${RUNBOOK_COUNT_LONG_EN} executable runbooks – for incident response, hardening, and compliance in real-time. From problem to fix in under 30 seconds.`)

  return {
    title,
    description,
    keywords: [
      "ai security operations",
      "incident response automation",
      "security runbooks",
      "devops security",
      "cve remediation",
      "hardening automation",
      "compliance automation",
      "security orchestration",
      "automated incident response",
      "secops platform",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: SUPPORTED_LOCALES.map((l) => (l === "de" ? "de_DE" : "en_US")),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: buildLocalizedAlternates(locale, "/summon"),
  }
}

export default async function LocaleSummonPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const prefix = `/${locale}`
  const dict = await getDictionary(locale)
  const summon = dict.summon || {}
  const common = dict.common || {}
  const isDE = locale === "de"

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClawGuru",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon-512.png`,
    foundingDate: "2024",
    description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
    sameAs: [
      "https://github.com/clawguru",
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div className="space-y-6">
        <SummonHero prefix={prefix} dict={summon} />
        <section className="py-2">
          <div className="px-4 sm:px-6 lg:px-8">
            <SummonRealClient prefix={prefix} dict={summon} />
          </div>
        </section>
        <section className="py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <HowItWorks dict={summon} />
          </div>
        </section>
        <section className="py-2">
          <div className="px-4 sm:px-6 lg:px-8">
            <UpgradeCTA prefix={prefix} dict={summon} />
          </div>
        </section>
        {/* E-E-A-T Signals */}
        <section className="py-4">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6">Warum wir vertrauenswürdig sind</div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Experience",
                  desc: "15+ Jahre Incident Response Erfahrung. Wir haben Dutzende Produktions-Incidents nachts um 03:00 Uhr behoben.",
                  color: "text-cyan-400",
                },
                {
                  title: "Expertise",
                  desc: `${RUNBOOK_COUNT_LONG_DE} AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. Jeder Guide ist getestet und validiert.`,
                  color: "text-emerald-400",
                },
                {
                  title: "Authoritativeness",
                  desc: "Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.",
                  color: "text-fuchsia-400",
                },
                {
                  title: "Trustworthiness",
                  desc: "DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. Transparenz über Methodik und Limitationen.",
                  color: "text-yellow-400",
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className={`font-bold ${item.color} text-sm mb-2`}>{item.title}</div>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
