import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Shield, Heart, Zap } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/manifesto"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"

  const title = pick(isDE, "Das ClawGuru Manifesto — Security für alle | ClawGuru", "The ClawGuru Manifesto — Security for Everyone | ClawGuru")

  const description = pick(isDE, "Wir glauben, dass Security für alle gebaut sein muss. Executable Runbooks statt PDFs. Compliance in Stunden statt Monaten. Das Manifesto für Self-Hosted-Teams.", "We believe that security must be built for everyone. Executable runbooks instead of PDFs. Compliance in hours instead of months. The manifesto for self-hosted teams.")

  return {
    title,
    description,
    keywords: ["security manifesto", "self-hosted security", "executable runbooks", "dsgvo", "ai agent security", "open source security"],
    authors: [{ name: "ClawGuru Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function ManifestoPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const statements = isDE
    ? [
        "Jeder self-hosted Stack verdient Enterprise-grade Security — unabhängig vom Budget.",
        "Security-Runbooks müssen ausführbar sein — keine PDFs, keine statischen Blogs.",
        "DSGVO-Compliance sollte Stunden dauern, nicht Monate.",
        "AI-Agents brauchen Security-Frameworks JETZT — nicht in 2027.",
        "Open-Source-Security schlägt Closed-Source-Obskurität.",
      ]
    : [
        "Every self-hosted stack deserves enterprise-grade security — regardless of budget.",
        "Security runbooks must be executable — no PDFs, no static blogs.",
        "GDPR compliance should take hours, not months.",
        "AI agents need security frameworks NOW — not in 2027.",
        "Open-source security beats closed-source obscurity.",
      ]

  const headline = pick(isDE, "Wir glauben, dass Security für alle gebaut sein muss.", "We believe that security must be built for everyone.")

  const subheadline = pick(isDE, "Das ist unser Manifesto. Das ist unsere Mission.", "This is our manifesto. This is our mission.")

  const shareText = pick(isDE, "Das ClawGuru Manifesto: Security für alle. Executable Runbooks statt PDFs.", "The ClawGuru Manifesto: Security for everyone. Executable runbooks instead of PDFs.")

  const shareUrl = `${SITE_URL}/${locale}${PATH}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": pick(isDE, "Startseite", "Home"), "item": `${SITE_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": "Manifesto", "item": shareUrl },
        ],
      },
      {
        "@type": "WebPage",
        "name": headline,
        "description": subheadline,
        "url": shareUrl,
        "isPartOf": { "@type": "WebSite", "name": "ClawGuru", "url": SITE_URL },
      },
      {
        "@type": "Organization",
        "name": "ClawGuru",
        "url": SITE_URL,
        "logo": `${SITE_URL}/favicon-512.png`,
        "description": pick(isDE, "Ops Intelligence Platform — Security Copilot, Runbooks, Intel Feed, Threatmap.", "Ops Intelligence Platform — Security Copilot, Runbooks, Intel Feed, Threatmap."),
        "sameAs": ["https://github.com/clawguru"],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Headline */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full mb-6">
            <Heart className="w-3 h-3" />
            {pick(isDE, "UNSERE MISSION", "OUR MISSION")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-100 leading-tight mb-6">
            {headline}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {subheadline}
          </p>
        </div>

        {/* Statements */}
        <div className="space-y-8 mb-16">
          {statements.map((statement, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-900 border border-cyan-500 flex items-center justify-center">
                <span className="text-xl font-black text-cyan-300">{i + 1}</span>
              </div>
              <div className="flex-1 pl-6 border-l-4 border-cyan-500">
                <p className="text-2xl md:text-3xl text-cyan-300 leading-relaxed font-semibold">
                  {pick(isDE, "Wir glauben: ", "We believe: ")}
                  <span className="text-gray-100">{statement}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-16">
          <div className="flex items-start gap-4">
            <div className="bg-amber-900 p-3 rounded-lg flex-shrink-0">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-3">
                {pick(isDE, "Warum das wichtig ist", "Why this matters")}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {pick(isDE, "Die meisten Security-Tools sind für Enterprise-Budgets gebaut. Self-Hosted-Teams, kleine Studios, unabhängige Entwickler — sie alle verdienen den gleichen Schutz. Wir bauen ClawGuru, damit Security nicht länger ein Privileg ist.", "Most security tools are built for enterprise budgets. Self-hosted teams, small studios, independent developers — they all deserve the same protection. We're building ClawGuru so security is no longer a privilege.")}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {pick(isDE, "Wir beweisen jeden Tag, dass High-End-Security ohne High-End-Preise möglich ist. Mit 4.200+ ausführbaren Runbooks, Live-CVE-Feeds und einer API, die Entwickler tatsächlich nutzen wollen.", "Every day we prove that high-end security is possible without high-end prices. With 4,200+ executable runbooks, live CVE feeds, and an API that developers actually want to use.")}
              </p>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="bg-gradient-to-r from-cyan-900 to-purple-900 border border-cyan-700 rounded-xl p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold text-gray-100 mb-4">
            {pick(isDE, "Teile das Manifesto", "Share the Manifesto")}
          </h3>
          <p className="text-gray-300 mb-6">
            {pick(isDE, "Wenn du das teilst, wird Security für mehr Teams zugänglich.", "When you share this, security becomes accessible to more teams.")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {pick(isDE, "Auf X teilen", "Share on X")}
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {pick(isDE, "Auf LinkedIn teilen", "Share on LinkedIn")}
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}/check`}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-900/50"
          >
            <Shield className="w-6 h-6" />
            {pick(isDE, "Security Check starten — kostenlos", "Start Security Check — free")}
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            {pick(isDE, "Kein Account nötig. Kein Tracking. Sofort verfügbar.", "No account needed. No tracking. Instant access.")}
          </p>
        </div>
      </div>
    </div>
  )
}
