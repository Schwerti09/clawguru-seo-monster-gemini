import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

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
  const title = pick(isDE, "Affiliate Programm — 30% Provision | ClawGuru", "Affiliate Program — 30% Commission | ClawGuru")
  const description = pick(isDE, "Verdiene 30% wiederkehrende Provision mit dem ClawGuru Affiliate Programm. Self-Hosted Security für DevOps und Security-Teams.", "Earn 30% recurring commission with the ClawGuru Affiliate Program. Self-hosted security for DevOps and security teams.")
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
    name: pick(isDE, "Starter", "Starter"),
    range: pick(isDE, "1-10 Referrals / Monat", "1-10 referrals / month"),
    commission: "30%",
    highlight: false,
  },
  {
    name: pick(isDE, "Growth", "Growth"),
    range: pick(isDE, "11-50 Referrals / Monat", "11-50 referrals / month"),
    commission: "35%",
    highlight: true,
  },
  {
    name: pick(isDE, "Elite", "Elite"),
    range: pick(isDE, "50+ Referrals / Monat", "50+ referrals / month"),
    commission: "40%",
    highlight: false,
  },
]

const getBenefits = (isDE: boolean) => [
  pick(isDE, "30% wiederkehrende Provision (lebenslang)", "30% recurring commission (lifetime)"),
  pick(isDE, "Echtzeit-Dashboard mit Klicks & Conversions", "Real-time dashboard with clicks & conversions"),
  pick(isDE, "Monatliche Auszahlung (ab €50)", "Monthly payout (from €50)"),
  pick(isDE, "Fertige Marketing-Assets & Copy-Templates", "Ready-made marketing assets & copy templates"),
  pick(isDE, "Dedizierter Partner-Manager ab 10 Sales", "Dedicated partner manager from 10 sales"),
  pick(isDE, "Early Access zu neuen Features", "Early access to new features"),
]

const getSteps = (isDE: boolean) => [
  {
    n: "1",
    title: pick(isDE, "Bewerben", "Apply"),
    text: pick(isDE, "Sende uns eine E-Mail. Antwort innerhalb 48h.", "Send us an email. Reply within 48h."),
  },
  {
    n: "2",
    title: pick(isDE, "Link erhalten", "Get your link"),
    text: pick(isDE, "Persönlicher Affiliate-Link + Dashboard-Zugang.", "Personal affiliate link + dashboard access."),
  },
  {
    n: "3",
    title: pick(isDE, "Teilen", "Share"),
    text: pick(isDE, "Nutze Blog, Newsletter, Social Media, Community.", "Use blog, newsletter, social media, community."),
  },
  {
    n: "4",
    title: pick(isDE, "Verdienen", "Earn"),
    text: pick(isDE, "30% auf jeden Abschluss — wiederkehrend.", "30% on every sale — recurring."),
  },
]

const getFaq = (isDE: boolean) => [
  {
    q: pick(isDE, "Wie hoch ist die Provision?", "How high is the commission?"),
    a: pick(isDE, "30% wiederkehrend auf alle Pro- und Team-Abos. Je mehr du bringst, desto höher (bis 40%).", "30% recurring on all Pro and Team subscriptions. The more you bring, the higher (up to 40%)."),
  },
  {
    q: pick(isDE, "Wann wird ausgezahlt?", "When are payouts?"),
    a: pick(isDE, "Monatlich per SEPA oder PayPal. Mindestauszahlung €50.", "Monthly via SEPA or PayPal. Minimum payout €50."),
  },
  {
    q: pick(isDE, "Wie lange läuft die Provision?", "How long does commission last?"),
    a: pick(isDE, "Lebenslang — solange dein Referral zahlt, bekommst du Provision.", "Lifetime — as long as your referral pays, you earn commission."),
  },
  {
    q: pick(isDE, "Für wen ist das Programm?", "Who is the program for?"),
    a: pick(isDE, "Security-Creators, DevOps-Bloggers, Newsletter-Betreiber, MSPs und Community-Leader.", "Security creators, DevOps bloggers, newsletter operators, MSPs and community leaders."),
  },
]

export default function PartnersApplyPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const tiers = getTiers(isDE)
  const benefits = getBenefits(isDE)
  const steps = getSteps(isDE)
  const faq = getFaq(isDE)
  const mailtoHref = "mailto:affiliates@clawguru.org?subject=" + encodeURIComponent(pick(isDE, "Affiliate-Bewerbung", "Affiliate Application"))

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-xs font-mono text-cyan-300 mb-6">
          {pick(isDE, "PARTNER PROGRAMM 2026", "PARTNER PROGRAM 2026")}
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          {pick(isDE, "Verdiene 30% Provision", "Earn 30% Commission")}
          <br />
          <span className="text-cyan-400">{pick(isDE, "mit ClawGuru", "with ClawGuru")}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          {pick(isDE, "Wiederkehrende Provision auf alle Abos. Lebenslang. Monatliche Auszahlung.", "Recurring commission on all subscriptions. Lifetime. Monthly payout.")}
        </p>
        <a href={mailtoHref} className="inline-block px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg transition-colors">
          {pick(isDE, "Jetzt bewerben →", "Apply now →")}
        </a>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black mb-8 text-center">{pick(isDE, "Provisions-Stufen", "Commission Tiers")}</h2>
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
        <h2 className="text-3xl font-black mb-8 text-center">{pick(isDE, "Was du bekommst", "What you get")}</h2>
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
        <h2 className="text-3xl font-black mb-8 text-center">{pick(isDE, "So funktioniert's", "How it works")}</h2>
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
        <h2 className="text-3xl font-black mb-8 text-center">{pick(isDE, "Beispielrechnung", "Example earnings")}</h2>
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-emerald-500/5">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400 mb-1">{pick(isDE, "10 Pro-Referrals", "10 Pro referrals")}</div>
              <div className="text-3xl font-black text-cyan-400">€147</div>
              <div className="text-xs text-gray-500">{pick(isDE, "pro Monat", "per month")}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">{pick(isDE, "50 Pro-Referrals", "50 Pro referrals")}</div>
              <div className="text-3xl font-black text-cyan-400">€735</div>
              <div className="text-xs text-gray-500">{pick(isDE, "pro Monat", "per month")}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            {pick(isDE, "Bei €49/Monat Pro-Abo, 30% Provision, wiederkehrend.", "Based on €49/month Pro plan, 30% commission, recurring.")}
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
          {pick(isDE, "Bereit zu verdienen?", "Ready to earn?")}
        </h2>
        <p className="text-gray-400 mb-6">
          {pick(isDE, "Antwort innerhalb 48h. Keine Hürden.", "Reply within 48h. No hurdles.")}
        </p>
        <a href={mailtoHref} className="inline-block px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg transition-colors">
          {pick(isDE, "Jetzt bewerben →", "Apply now →")}
        </a>
        <div className="mt-6 flex flex-col gap-2">
          <Link href={`/${locale}/affiliate-dashboard`} className="text-sm text-cyan-400 hover:underline">
            {pick(isDE, "Affiliate Dashboard ansehen (Demo)", "View Affiliate Dashboard (Demo)")}
          </Link>
          <Link href={`/${locale}/partners`} className="text-sm text-gray-500 hover:text-gray-400">
            {pick(isDE, "← Zurück zur Partner-Übersicht", "← Back to partners overview")}
          </Link>
        </div>
      </section>
    </main>
  )
}
