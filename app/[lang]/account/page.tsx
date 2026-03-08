import type { Metadata } from "next"
import Link from "next/link"
import { getAccess } from "@/lib/access"
import AccountPage from "@/components/pages/AccountPage"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"

export const runtime = "nodejs"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const params = await props.params
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
  }

  return {
    title: titles[locale] ?? "Account | ClawGuru",
    description:
      descriptions[locale] ?? "Your ClawGuru access – Dashboard, reports, weekly digest, kits.",
    robots: { index: false, follow: false },
  }
}

function AccessRequired({ lang }: { lang: string }) {
  const pricingHref = "/pricing"
  const dashboardHref = "/dashboard"

  return (
    <Container>
      <div className="py-16 max-w-5xl mx-auto">
        <SectionTitle
          kicker="ClawGuru Access"
          title="Zugang aktivieren"
          subtitle="Kein klassischer Login nötig. Nach Kauf wird dein Zugang aktiviert und du kommst direkt ins Dashboard."
        />

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={pricingHref}
            className="px-6 py-3 rounded-2xl bg-white text-black font-semibold"
          >
            Preise ansehen
          </Link>

          <Link
            href={dashboardHref}
            className="px-6 py-3 rounded-2xl border border-gray-700 text-white font-semibold"
          >
            Zum Dashboard
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            ["Day Pass", "24h", "Ein Tag Zugriff für akute Incidents und schnelle Missionen."],
            ["Pro", "Abo", "Dashboard, Weekly Digest, Reports, Kits und tiefere Intel-Workflows."],
            ["Team", "Abo", "Mehr Projekte, Shared Ops, Team Alerts und kollaborative Einsätze."],
          ].map(([title, price, desc]) => (
            <div
              key={title}
              className="p-6 rounded-3xl border border-gray-800 bg-black/30"
            >
              <div className="text-2xl font-black">{title}</div>
              <div className="text-gray-400 mt-1">{price}</div>
              <div className="text-sm text-gray-300 mt-3">{desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-3xl border border-gray-800 bg-black/20 text-sm text-gray-300">
          Nach dem Checkout klickst du auf{" "}
          <span className="font-semibold text-white">„Zugang aktivieren“</span>.
          Dadurch wird dein sicherer Zugriff per Cookie freigeschaltet — ohne Benutzername-und-Passwort-Zirkus.
        </div>
      </div>
    </Container>
  )
}

export default async function LocaleAccountPage(props: {
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const lang = SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de"

  const access = await getAccess()

  if (!access.ok) {
    return <AccessRequired lang={lang} />
  }

  return <AccountPage email={access.customerId ?? "ClawGuru Access"} />
}