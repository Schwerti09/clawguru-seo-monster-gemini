// Locale runbooks listing pages: /en/runbooks, /es/runbooks, etc.
// Renders the same runbooks listing so locale navigation doesn't 404.

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import RunbooksPageContent from "@/components/pages/RunbooksPageContent"
import { getDictionary } from "@/lib/getDictionary"

export const dynamic = "force-static"
export const revalidate = 3600
export const dynamicParams = false
export const runtime = "nodejs"
export const maxDuration = 180

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }) {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const pageUrl = `${base}/${locale}/runbooks`
  const titles: Partial<Record<Locale, string>> = {
    de: "Security Runbooks | ClawGuru – Automatisierte Playbooks",
    en: "Security Runbooks | ClawGuru – Automated Playbooks",
    es: "Runbooks de Seguridad | ClawGuru – Playbooks Automatizados",
    fr: "Runbooks Sécurité | ClawGuru – Playbooks Automatisés",
    pt: "Runbooks de Segurança | ClawGuru – Playbooks Automatizados",
    it: "Runbook di Sicurezza | ClawGuru – Playbook Automatizzati",
    ru: "Security Runbooks | ClawGuru – Автоматизированные Плейбуки",
    zh: "安全运行手册 | ClawGuru – 自动化操作手册",
    ja: "セキュリティRunbooks | ClawGuru – 自動化プレイブック",
    ko: "보안 런북 | ClawGuru – 자동화 플레이북",
    ar: "دليل تشغيل الأمان | ClawGuru – كتيبات آلية",
    hi: "सुरक्षा रनबुक | ClawGuru – स्वचालित प्लेबुक",
    tr: "Güvenlik Runbooks | ClawGuru – Otomatik Playbook'lar",
    pl: "Security Runbooks | ClawGuru – Zautomatyzowane Playbooki",
    nl: "Security Runbooks | ClawGuru – Geautomatiseerde Playbooks",
  }
  const descriptions: Partial<Record<Locale, string>> = {
    de: "600+ ausführbare Security-Playbooks für OpenClaw/Moltbot: SSH Hardening, Kubernetes Zero-Trust, WAF Setup, Incident Response. Score → Runbook → Fix → Re-Check.",
    en: "600+ executable security playbooks for OpenClaw/Moltbot: SSH hardening, Kubernetes zero-trust, WAF setup, incident response. Score → Runbook → Fix → Re-Check.",
  }
  const title = titles[locale] ?? titles.en!
  const description = descriptions[locale] ?? descriptions.en!
  const alternates = buildLocalizedAlternates(locale, "/runbooks")
  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "article" as const,
      url: pageUrl,
      title,
      description,
      locale: locale === "zh" ? "zh_CN" : locale === "hi" ? "hi_IN" : `${locale}_${locale.toUpperCase()}`,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  }
}

export default async function LocaleRunbooksPage(props: { params: { lang: string } }) {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  return <RunbooksPageContent locale={locale} subtitle={dict.runbooks.subtitle} />
}
