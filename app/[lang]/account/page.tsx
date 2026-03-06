import { cookies } from "next/headers"
import type { Metadata } from "next"
import LoginPage from "../../../components/pages/LoginPage"
import AccountPage from "../../../components/pages/AccountPage"
import { SUPPORTED_LOCALES, type Locale } from "../../../lib/i18n"
import { verifySessionToken, USER_SESSION_COOKIE } from "../../../lib/auth"


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
    de: "Dein ClawGuru Account – Gespeicherte Checks, Darwinian Feed, Runbook-Verlauf.",
    en: "Your ClawGuru account – Saved Checks, Darwinian Feed, Runbook History.",
    es: "Tu cuenta de ClawGuru – Checks guardados, Darwinian Feed, historial de Runbooks.",
    fr: "Votre compte ClawGuru – Vérifications enregistrées, Darwinian Feed, historique des Runbooks.",
    pt: "A sua conta ClawGuru – Verificações guardadas, Darwinian Feed, histórico de Runbooks.",
    it: "Il tuo account ClawGuru – Controlli salvati, Darwinian Feed, cronologia Runbook.",
    ru: "Ваш аккаунт ClawGuru – Сохранённые проверки, Darwinian Feed, история Runbook.",
    zh: "您的 ClawGuru 账户 – 已保存的检查、Darwinian Feed、Runbook 历史记录。",
    ja: "ClawGuru アカウント – 保存済みチェック、Darwinian Feed、Runbook 履歴。",
    ar: "حسابك في ClawGuru – الفحوصات المحفوظة، Darwinian Feed، سجل Runbook.",
  }

  return {
    title: titles[locale] ?? "Account | ClawGuru",
    description:
      descriptions[locale] ?? "Your ClawGuru account – Saved Checks, Darwinian Feed, Runbook History.",
    robots: { index: false, follow: false },
  }
}

export default async function LocaleAccountPage(props: {
  params: Promise<{ lang: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const jar = await cookies()
  const token = jar.get(USER_SESSION_COOKIE)?.value
  const session = token ? verifySessionToken(token) : null

  const error =
    typeof searchParams?.error === "string" ? searchParams.error : null

  if (!session) {
    return <LoginPage error={error} />
  }

  return <AccountPage email={session.email} />
}