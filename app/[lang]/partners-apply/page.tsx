import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/partners-apply"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Affiliate Programm — 30% Provision | ClawGuru"
    : "Affiliate Program — 30% Commission | ClawGuru"
  const description = isDE
    ? "Verdiene 30% wiederkehrende Provision mit dem ClawGuru Affiliate Programm. Self-Hosted Security für DevOps und Security-Teams."
    : "Earn 30% recurring commission with the ClawGuru Affiliate Program. Self-hosted security for DevOps and security teams."
  return {
    title,
    description,
    keywords: ["affiliate program", "partner program", "recurring commission", "clawguru affiliate", "security affiliate"],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getTiers = (isDE: boolean) => [
  {
    name: isDE ? "Starter" : "Starter",
    range: isDE ? "1-10 Referrals / Monat" : "1-10 referrals / month",
    commission: "30%",
    highlight: false,
  },
  {
    name: isDE ? "Growth" : "Growth",
    range: isDE ? "11-50 Referrals / Monat" : "11-50 referrals / month",
    commission: "35%",
    highlight: true,
  },
  {
    name: isDE ? "Elite" : "Elite",
    range: isDE ? "50+ Referrals / Monat" : "50+ referrals / month",
    commission: "40%",
    highlight: false,
  },
]

const getBenefits = (isDE: boolean) => [
  isDE ? "30% wiederkehrende Provision (lebenslang)" : "30% recurring commission (lifetime)",
  isDE ? "Echtzeit-Dashboard mit Klicks & Conversions" : "Real-time dashboard with clicks & conversions",
  isDE ? "Monatliche Auszahlung (ab €50)" : "Monthly payout (from €50)",
  isDE ? "Fertige Marketing-Assets & Copy-Templates" : "Ready-made marketing assets & copy templates",
  isDE ? "Dedizierter Partner-Manager ab 10 Sales" : "Dedicated partner manager from 10 sales",
  isDE ? "Early Access zu neuen Features" : "Early access to new features",
]

const getSteps = (isDE: boolean) => [
  {
    n: "1",
    title: isDE ? "Bewerben" : "Apply",
    text: isDE ? "Sende uns eine E-Mail. Antwort innerhalb 48h." : "Send us an email. Reply within 48h.",
  },
  {
    n: "2",
    title: isDE ? "Link erhalten" : "Get your link",
    text: isDE ? "Persönlicher Affiliate-Link + Dashboard-Zugang." : "Personal affiliate link + dashboard access.",
  },
  {
    n: "3",
    title: isDE ? "Teilen" : "Share",
    text: isDE ? "Nutze Blog, Newsletter, Social Media, Community." : "Use blog, newsletter, social media, community.",
  },
  {
    n: "4",
    title: isDE ? "Verdienen" : "Earn",
    text: isDE ? "30% auf jeden Abschluss — wiederkehrend." : "30% on every sale — recurring.",
  },
]

const getFaq = (isDE: boolean) => [
  {
    q: isDE ? "Wie hoch ist die Provision?" : "How high is the commission?",
    a: isDE
      ? "30% wiederkehrend auf alle Pro- und Team-Abos. Je mehr du bringst, desto höher (bis 40%)."
      : "30% recurring on all Pro and Team subscriptions. The more you bring, the higher (up to 40%).",
  },
  {
    q: isDE ? "Wann wird ausgezahlt?" : "When are payouts?",
    a: isDE
      ? "Monatlich per SEPA oder PayPal. Mindestauszahlung €50."
      : "Monthly via SEPA or PayPal. Minimum payout €50.",
  },
  {
    q: isDE ? "Wie lange läuft die Provision?" : "How long does commission last?",
    a: isDE
      ? "Lebenslang — solange dein Referral zahlt, bekommst du Provision."
      : "Lifetime — as long as your referral pays, you earn commission.",
  },
  {
    q: isDE ? "Für wen ist das Programm?" : "Who is the program for?",
    a: isDE
      ? "Security-Creators, DevOps-Bloggers, Newsletter-Betreiber, MSPs und Community-Leader."
      : "Security creators, DevOps bloggers, newsletter operators, MSPs and community leaders.",
  },
]

export default function PartnersApplyPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const tiers = getTiers(isDE)
  const benefits = getBenefits(isDE)
  const steps = getSteps(isDE)
  const faq = getFaq(isDE)
  const mailtoHref = "mailto:affiliates@clawguru.org?subject=" + encodeURIComponent(isDE ? "Affiliate-Bewerbung" : "Affiliate Application")

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-xs font-mono text-cyan-300 mb-6">
          {isDE ? "PARTNER PROGRAMM 2026" : "PARTNER PROGRAM 2026"}
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          {isDE ? "Verdiene 30% Provision" : "Earn 30% Commission"}
          <br />
          <span className="text-cyan-400">{isDE ? "mit ClawGuru" : "with ClawGuru"}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          {isDE
            ? "Wiederkehrende Provision auf alle Abos. Lebenslang. Monatliche Auszahlung."
            : "Recurring commission on all subscriptions. Lifetime. Monthly payout."}
        </p>
        <a href={mailtoHref} className="inline-block px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg transition-colors">
          {isDE ? "Jetzt bewerben →" : "Apply now →"}
        </a>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">{isDE ? "Provisions-Stufen" : "Commission Tiers"}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "p-6 rounded-2xl border " +
                (t.highlight ? "border-cyan-500 bg-cyan-500/5" : "border-gray-800 bg-black/30")
              }
            >
              <div className="text-sm text-gray-400 mb-2">{t.name}</div>
              <div className="text-4xl font-black text-cyan-400 mb-2">{t.commission}</div>
              <div className="text-sm text-gray-300">{t.range}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">{isDE ? "Was du bekommst" : "What you get"}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3 p-4 rounded-xl border border-gray-800 bg-black/20">
              <span className="text-cyan-400 font-black text-xl leading-none">✓</span>
              <span className="text-gray-200">{b}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">{isDE ? "So funktioniert's" : "How it works"}</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="p-5 rounded-2xl border border-gray-800 bg-black/30">
              <div className="w-10 h-10 rounded-full bg-cyan-500 text-black font-black grid place-items-center mb-3">{s.n}</div>
              <div className="font-bold text-lg mb-1">{s.title}</div>
              <div className="text-sm text-gray-400">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">{isDE ? "Beispielrechnung" : "Example earnings"}</h2>
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-emerald-500/5">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400 mb-1">{isDE ? "10 Pro-Referrals" : "10 Pro referrals"}</div>
              <div className="text-3xl font-black text-cyan-400">€147</div>
              <div className="text-xs text-gray-500">{isDE ? "pro Monat" : "per month"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">{isDE ? "50 Pro-Referrals" : "50 Pro referrals"}</div>
              <div className="text-3xl font-black text-cyan-400">€735</div>
              <div className="text-xs text-gray-500">{isDE ? "pro Monat" : "per month"}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            {isDE ? "Bei €49/Monat Pro-Abo, 30% Provision, wiederkehrend." : "Based on €49/month Pro plan, 30% commission, recurring."}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">FAQ</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <div key={f.q} className="p-5 rounded-xl border border-gray-800 bg-black/20">
              <div className="font-bold text-gray-100 mb-2">{f.q}</div>
              <div className="text-sm text-gray-400">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          {isDE ? "Bereit zu verdienen?" : "Ready to earn?"}
        </h2>
        <p className="text-gray-400 mb-6">
          {isDE ? "Antwort innerhalb 48h. Keine Hürden." : "Reply within 48h. No hurdles."}
        </p>
        <a href={mailtoHref} className="inline-block px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg transition-colors">
          {isDE ? "Jetzt bewerben →" : "Apply now →"}
        </a>
        <div className="mt-6 flex flex-col gap-2">
          <Link href={`/${locale}/affiliate-dashboard`} className="text-sm text-cyan-400 hover:underline">
            {isDE ? "Affiliate Dashboard ansehen (Demo)" : "View Affiliate Dashboard (Demo)"}
          </Link>
          <Link href={`/${locale}/partners`} className="text-sm text-gray-500 hover:text-gray-400">
            {isDE ? "← Zurück zur Partner-Übersicht" : "← Back to partners overview"}
          </Link>
        </div>
      </section>
    </main>
  )
}
