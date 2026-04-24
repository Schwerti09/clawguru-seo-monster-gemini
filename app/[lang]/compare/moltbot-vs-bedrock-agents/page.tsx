import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/compare/moltbot-vs-bedrock-agents"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "Moltbot vs AWS Bedrock Agents: Vergleich | ClawGuru Compare", "Moltbot vs AWS Bedrock Agents: Comparison | ClawGuru Compare")
  const description = pick(isDE, "Moltbot vs AWS Bedrock Agents: Self-Hosted vs Cloud. Deployment, Security, Compliance, Pricing und Control vergleichen. Executable Runbooks für Self-Hosted AI-Agenten.", "Moltbot vs AWS Bedrock Agents: Self-Hosted vs Cloud. Compare deployment, security, compliance, pricing and control. Executable runbooks for self-hosted AI agents.")
  return {
    title, description,
    keywords: ["moltbot vs bedrock agents", "self-hosted ai agents", "aws bedrock agents", "ai agent comparison", "moltbot security", "bedrock pricing"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const COMPARISON = [
  { category: "Deployment", moltbot: "Self-Hosted on your infrastructure", bedrock: "AWS managed service" },
  { category: "Data Privacy", moltbot: "Data never leaves your infrastructure", bedrock: "Data processed in AWS regions" },
  { category: "Compliance", moltbot: "Full control over compliance (GDPR, SOC 2)", bedrock: "AWS compliance certifications" },
  { category: "Pricing", moltbot: "Infrastructure costs only (no per-token fees)", bedrock: "Per-token pricing + infrastructure costs" },
  { category: "Custom Models", moltbot: "Deploy any open-source or custom model", bedrock: "Limited to AWS Bedrock models" },
  { category: "Control", moltbot: "Full control over model weights and parameters", bedrock: "No access to model weights" },
  { category: "Security", moltbot: "Hardened by default with Moltbot security controls", bedrock: "AWS security controls" },
  { category: "Vendor Lock-in", moltbot: "No vendor lock-in (open-source)", bedrock: "AWS ecosystem lock-in" },
]

const FAQ = [
  { q: "Which is better for data privacy: Moltbot or Bedrock Agents?", a: "Moltbot is better for data privacy because data never leaves your infrastructure. You have full control over where your data is processed and stored. Bedrock Agents processes data in AWS regions, which may not meet your data residency requirements. For organisations with strict data privacy requirements (GDPR, healthcare, finance), Moltbot's self-hosted deployment provides the strongest data privacy guarantees." },
  { q: "How does pricing compare between Moltbot and Bedrock Agents?", a: "Moltbot has no per-token fees — you only pay for infrastructure. This makes Moltbot cost-effective for high-volume usage. Bedrock Agents charges per-token pricing on top of infrastructure costs. For organisations processing millions of tokens daily, Moltbot can be 10-100x cheaper than Bedrock. Moltbot's predictable infrastructure costs also make budgeting easier." },
  { q: "Can I use custom models with Moltbot?", a: "Yes, Moltbot supports any open-source or custom model. You can deploy models from Hugging Face, train your own models, or fine-tune existing models. Bedrock Agents is limited to the models available in the AWS Bedrock marketplace. If you need a custom model not available in Bedrock, Moltbot is the better choice." },
  { q: "Which is more secure: Moltbot or Bedrock Agents?", a: "Both are secure, but in different ways. Bedrock Agents leverages AWS security infrastructure (encryption, IAM, compliance). Moltbot provides hardened security controls specifically for AI agents (prompt injection defense, output filtering, audit logging). Moltbot also gives you full visibility into security controls, while Bedrock's controls are managed by AWS. For organisations that need to demonstrate security controls to auditors, Moltbot's transparency is advantageous." },
]

export default function MoltbotVsBedrockAgentsPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: "Moltbot vs Bedrock Agents", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Vergleich für eigene Architekturentscheidung.", "Comparison for your own architecture decision.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Compare · Batch 15</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "Moltbot vs AWS Bedrock Agents", "Moltbot vs AWS Bedrock Agents")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "Self-Hosted vs Cloud: Deployment, Security, Compliance, Pricing und Control vergleichen.", "Self-Hosted vs Cloud: Compare deployment, security, compliance, pricing and control.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Vergleichstabelle", "Comparison Table")}</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Kategorie", "Category")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Moltbot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Bedrock Agents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {COMPARISON.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-800/50"}>
                    <td className="px-6 py-4 text-sm text-gray-300 font-semibold">{c.category}</td>
                    <td className="px-6 py-4 text-sm text-green-400">{c.moltbot}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{c.bedrock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Moltbot-Security", "Moltbot security")}</div>
            </a>
            <a href={`/${locale}/solutions/soc2-ai-systems`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">SOC 2 for AI Systems</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Compliance", "Compliance")}</div>
            </a>
            <a href={`/${locale}/compare`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">All Comparisons</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Compare-Übersicht", "Compare overview")}</div>
            </a>
            <a href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Live-Check", "Live check")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
