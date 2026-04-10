import type { Metadata } from "next"
import Link from "next/link"

// Relative Imports – funktionieren garantiert im Recovery-Branch + CI
import { getAccess } from "../../../lib/access"
import Container from "../../../components/shared/Container"
import SectionTitle from "../../../components/shared/SectionTitle"
import { SUPPORTED_LOCALES, type Locale } from "../../../lib/i18n"

export const runtime = "nodejs"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: { lang: string } }
): Promise<Metadata> {
  const params = props.params

  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale

  const titles: Record<Locale, string> = {
    de: "Account | ClawGuru",
    en: "Account | ClawGuru",
    es: "Cuenta | ClawGuru",
    fr: "Compte | ClawGuru",
    pt: "Conta | ClawGuru",
    it: "Account | ClawGuru",
    ru: "Аккаунт | ClawGuru",
    zh: "账户 | ClawGuru",
    ja: "アカウント | ClawGuru",
    ar: "الحساب | ClawGuru",
    nl: "Account | ClawGuru",
    hi: "अकाउंट | ClawGuru",
    tr: "Hesap | ClawGuru",
    pl: "Konto | ClawGuru",
    ko: "계정 | ClawGuru",
    af: "Rekening | ClawGuru",
  }

  const descriptions: Record<Locale, string> = {
    de: "Dein ClawGuru Zugang – Dashboard, Reports, Weekly Digest, Kits.",
    en: "Your ClawGuru access – Dashboard, reports, weekly digest, kits.",
    es: "Tu acceso a ClawGuru – Dashboard, informes, weekly digest, kits.",
    fr: "Votre accès ClawGuru – Dashboard, rapports, weekly digest, kits.",
    pt: "O seu acesso ClawGuru – Dashboard, relatórios, weekly digest, kits.",
    it: "Il tuo accesso ClawGuru – Dashboard, report, weekly digest, kits.",
    ru: "Ваш доступ ClawGuru – Dashboard, отчёты, weekly digest, kits.",
    zh: "您的 ClawGuru 访问权限 – Dashboard、报告、weekly digest、kits。",
    ja: "ClawGuru アクセス – Dashboard、レポート、weekly digest、kits。",
    ar: "وصولك إلى ClawGuru – لوحة التحكم، التقارير، weekly digest، kits.",
    nl: "Je ClawGuru toegang – Dashboard, rapporten, weekly digest, kits.",
    hi: "आपका ClawGuru एक्सेस – Dashboard, रिपोर्ट, weekly digest, kits.",
    tr: "ClawGuru erişiminiz – Dashboard, raporlar, weekly digest, kitler.",
    pl: "Twój dostęp do ClawGuru – Dashboard, raporty, weekly digest, zestawy.",
    ko: "ClawGuru 접근 권한 – Dashboard, 리포트, weekly digest, kits.",
    af: "Jou ClawGuru toegang – Dashboard, verslae, weekly digest, kits.",
  }

  return {
    title: titles[locale] ?? "Account | ClawGuru",
    description: descriptions[locale] ?? descriptions.de,
    robots: { index: false, follow: false },
  }
}

/* ============================================= */
/*               ACCESS REQUIRED                 */
/* ============================================= */
function AccessRequired({ locale }: { locale: Locale }) {
  const prefix = `/${locale}`
  return (
    <Container>
      <div className="py-16 max-w-5xl mx-auto text-center">
        <SectionTitle
          kicker="ClawGuru Access"
          title="Zugang aktivieren"
          subtitle="Kein Login. Kein Passwort. Einfach kaufen → aktivieren → loslegen."
        />

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href={`${prefix}/pricing`}
            className="px-8 py-4 rounded-2xl bg-gray-800 text-black font-semibold text-lg hover:bg-gray-700 transition"
          >
            Preise ansehen & kaufen
          </Link>

          <Link
            href={`${prefix}/dashboard`}
            className="px-8 py-4 rounded-2xl border border-gray-700 text-white font-semibold text-lg hover:bg-white/10 transition"
          >
            Zum Dashboard
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            ["Day Pass", "24h", "Ein Tag voller Power für akute Einsätze"],
            ["Pro", "Monatlich", "Vollzugriff auf alle Tools & Intel"],
            ["Team", "Monatlich", "Mehrere Projekte + Team-Funktionen"],
          ].map(([title, price, desc]) => (
            <div
              key={title}
              className="p-8 rounded-3xl border border-gray-800 bg-black/30"
            >
              <div className="text-3xl font-black">{title}</div>
              <div className="text-gray-400 mt-1 text-xl">{price}</div>
              <div className="mt-6 text-sm text-gray-300 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

/* ============================================= */
/*               ACCESS GRANTED                  */
/* ============================================= */
function AccessGranted({ customerId, plan, locale }: { customerId?: string; plan?: string; locale: Locale }) {
  const prefix = `/${locale}`
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle
          kicker="Willkommen zurück"
          title="Dein ClawGuru Account"
          subtitle={`Plan: ${plan?.toUpperCase() || "Pro"} • Kunde: ${customerId || "ClawGuru User"}`}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href={`${prefix}/dashboard`}
            className="block p-8 rounded-3xl border border-white/10 hover:border-white/30 bg-black/30 transition group"
          >
            <div className="text-2xl font-bold group-hover:text-[#c9a84c]">→ Dashboard öffnen</div>
            <p className="mt-3 text-gray-400">Reports, Weekly Digest, Kits & Mission Mode</p>
          </Link>

          <Link
            href={`${prefix}/pricing`}
            className="block p-8 rounded-3xl border border-white/10 hover:border-white/30 bg-black/30 transition group"
          >
            <div className="text-2xl font-bold group-hover:text-[#c9a84c]">→ Upgrade oder verlängern</div>
            <p className="mt-3 text-gray-400">Team, Enterprise oder längere Day-Pässe</p>
          </Link>
        </div>
      </div>
    </Container>
  )
}

/* ============================================= */
/*               MAIN PAGE                       */
/* ============================================= */
export default async function LocaleAccountPage(props: {
  params: { lang: string }
}) {
  const params = props.params

  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? params.lang
    : "de") as Locale

  const access = await getAccess()

  if (!access.ok) {
    return <AccessRequired locale={locale} />
  }

  return (
    <AccessGranted
      customerId={access.customerId}
      plan={access.plan}
      locale={locale}
    />
  )
}