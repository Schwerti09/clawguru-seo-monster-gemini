import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-my-moltbot/share-badge-gallery"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Share Badge Gallery: Moltbot Proof | ClawGuru", "Roast Share Badge Gallery: Moltbot Proof | ClawGuru")
  const description = pick(isDE, "Badge-Galerie fuer deinen Roast-Score: Trust-Siegel, Status-Page Snippets und Share-Assets fuer Moltbot Teams.", "Badge gallery for your roast score: trust seals, status page snippets, and share assets for Moltbot teams.")
  return {
    title,
    description,
    keywords: ["roast badge", "security badge", "moltbot score", "trust seal", "shareable report"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function ShareBadgeGalleryPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const badgeSnippet = `<a href="https://clawguru.org/${locale}/roast-my-moltbot" class="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-200">Secured by ClawGuru</a>`

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "Roast Share Badge Gallery", "Roast Share Badge Gallery")}</h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Gib deinem Moltbot-Score ein sichtbares Trust-Siegel. Badges sind die schnellste Social-Proof-Unit.", "Give your Moltbot score a visible trust seal. Badges are the fastest social proof unit.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Dieser Leitfaden dient zur Haertung Ihrer eigenen Systeme. Keine Angriffstools.", "This guide is for hardening your own systems. No attack tools.")}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Badge Tiers", "Badge tiers")}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">{pick(isDE, "90-100: Elite", "90-100: Elite")}</h3>
              <p className="text-sm text-green-200">{pick(isDE, "Hall-of-Fame Badge fuer Statuspages.", "Hall of Fame badge for status pages.")}</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">{pick(isDE, "80-89: Hardened", "80-89: Hardened")}</h3>
              <p className="text-sm text-blue-200">{pick(isDE, "Starkes Setup, ideal fuer Release Notes.", "Strong setup, perfect for release notes.")}</p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">{pick(isDE, "70-79: Fixable", "70-79: Fixable")}</h3>
              <p className="text-sm text-yellow-200">{pick(isDE, "Sicher, aber mit sichtbarem Next-Step.", "Secure, but with visible next step.")}</p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">{pick(isDE, "<70: In Recovery", "<70: In recovery")}</h3>
              <p className="text-sm text-red-200">{pick(isDE, "Badge zeigt, dass Fixes aktiv laufen.", "Badge shows fixes are actively running.")}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Embed Snippet", "Embed snippet")}</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 mb-4">
              {pick(isDE, "Nutze das Badge in Statuspages, Changelogs oder Security-Notes.", "Use the badge on status pages, changelogs, or security notes.")}
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre>{badgeSnippet}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Best Places to Share", "Best places to share")}</h2>
          <div className="space-y-4">
            {[
              [pick(isDE, "Status Page", "Status page"), pick(isDE, "Vertrauen direkt neben Uptime und SLA zeigen.", "Show trust next to uptime and SLA.")],
              [pick(isDE, "Changelog", "Changelog"), pick(isDE, "Release Notes mit Security-Signal kombinieren.", "Combine release notes with a security signal.")],
              [pick(isDE, "Sales Deck", "Sales deck"), pick(isDE, "Roast-Score als Proof fuer Enterprise Kunden.", "Use the roast score as proof for enterprise buyers.")],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Badge freischalten", "Unlock the badge")}</h2>
          <div className="space-y-6">
            {[
              [1, pick(isDE, "Roast laufen lassen", "Run the roast"), pick(isDE, "Score + Findings sichern.", "Capture score and findings.")],
              [2, pick(isDE, "Fixes anwenden", "Apply fixes"), pick(isDE, "Top Issues aus dem Report beheben.", "Fix top issues from the report.")],
              [3, pick(isDE, "Shareable Report", "Shareable report"), pick(isDE, "Report exportieren und Badge kopieren.", "Export the report and copy the badge.")],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div>
                  <div className="font-semibold text-gray-100 mb-2">{t}</div>
                  <div className="text-sm text-gray-300">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterfuehrende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/roast-my-moltbot/shareable-roast-report`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Shareable Roast Report</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Report exportieren", "Export your report")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot/roast-score-methodology`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Score Methodology</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Score verstehen", "Understand the score")}</div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Roast My Moltbot</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </a>
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Stack scannen", "Scan your stack")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
