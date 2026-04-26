import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/test/viral-pages-demo"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Viral Pages Demo — Alle 12 Features im Test | ClawGuru", "Viral Pages Demo — All 12 Features Tested | ClawGuru")
  const description = pick(isDE, "Testseite mit allen 12 Features für maximales User-Mehrwert und SEO: Schema Markup, Checkliste, Code Snippets, TOC, Score, Badge, etc.", "Test page with all 12 features for maximum user value and SEO: Schema Markup, Checklist, Code Snippets, TOC, Score, Badge, etc.")
  return {
    title,
    description,
    keywords: [
      "viral pages demo", "seo features", "user value",
      "schema markup", "interactive checklist", "code snippets",
      "security score", "share badge", "table of contents"
    ],
    authors: [{ name: "Schwerti" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"]
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function ViralPagesDemoPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#1e1b4b] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_40%)] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_40%)] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div id="reading-progress" className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" style={{width: '0%'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10 flex gap-8">
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase">{pick(isDE, "Inhalt", "Contents")}</h3>
              <nav className="space-y-2 text-sm">
                <a href="#schema-markup" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Schema Markup", "Schema Markup")}</a>
                <a href="#checkliste" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Interaktive Checkliste", "Interactive Checklist")}</a>
                <a href="#code-snippets" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Code Snippets", "Code Snippets")}</a>
                <a href="#score-calculator" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Security Score", "Security Score")}</a>
                <a href="#share-badge" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Share Badge", "Share Badge")}</a>
                <a href="#difficulty" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Difficulty Level", "Difficulty Level")}</a>
                <a href="#ask-ai" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Ask AI", "Ask AI")}</a>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400">{pick(isDE, "Lesezeit:", "Reading time:")}</div>
                <div className="text-sm text-gray-300">5 min</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Viral Pages Demo · All 12 Features</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-900 text-green-300 text-xs font-semibold px-3 py-1 rounded-full border border-green-700">{pick(isDE, "Anfänger", "Beginner")}</span>
              <span className="text-gray-400 text-xs">{pick(isDE, "Zuletzt aktualisiert: 25.04.2026", "Last updated: 25.04.2026")}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              {pick(isDE, "Viral Pages Demo — Alle 12 Features im Test", "Viral Pages Demo — All 12 Features Tested")}
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {pick(isDE, "Diese Testseite demonstriert alle 12 Features für maximales User-Mehrwert und SEO. Jedes Feature ist produktions-ready und kann sofort auf den 99 Viral Pages implementiert werden.", "This test page demonstrates all 12 features for maximum user value and SEO. Each feature is production-ready and can be implemented immediately on the 99 viral pages.")}
            </p>
          </div>

          {/* Feature 1: Schema Markup */}
          <section id="schema-markup" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">1.</span> {pick(isDE, "Schema Markup — Rich Snippets für Google", "Schema Markup — Rich Snippets for Google")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Article-Schema, FAQPage-Schema und HowTo-Schema werden als JSON-LD in den Head der Seite eingefügt. Google zeigt diese als Rich Snippets in den Suchergebnissen an.", "Article-Schema, FAQPage-Schema and HowTo-Schema are inserted as JSON-LD in the page head. Google displays these as rich snippets in search results.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 mb-4">
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase">JSON-LD Example</div>
                <pre className="text-green-200 text-xs font-mono overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Moltbot IAM Hardening",
  "author": { "@type": "Person", "name": "Schwerti" },
  "datePublished": "2026-04-25",
  "dateModified": "2026-04-25"
}`}
                </pre>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-green-900 text-green-300 px-2 py-1 rounded">✓ {pick(isDE, "SEO: +15-25% CTR", "SEO: +15-25% CTR")}</span>
                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded">✓ {pick(isDE, "Rich Snippets", "Rich Snippets")}</span>
              </div>
            </div>
          </section>

          {/* Feature 2: Interactive Checklist */}
          <section id="checkliste" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">2.</span> {pick(isDE, "Interaktive Checkliste — Progress Tracking", "Interactive Checklist — Progress Tracking")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "LocalStorage-basiertes Progress Tracking. Checklisten werden automatisch gespeichert und beim nächsten Besuch wiederhergestellt.", "LocalStorage-based progress tracking. Checklists are automatically saved and restored on next visit.")}
              </p>
              <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{pick(isDE, "Dein Fortschritt:", "Your progress:")}</span>
                  <span className="text-sm font-semibold text-cyan-400">2/5 {pick(isDE, "erledigt", "completed")}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{width: '40%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { checked: true, text: {de: "STRIDE-Analyse durchführen", en: "Perform STRIDE analysis"} },
                  { checked: true, text: {de: "IAM-Rollen prüfen", en: "Review IAM roles"} },
                  { checked: false, text: {de: "API-Keys rotieren", en: "Rotate API keys"} },
                  { checked: false, text: {de: "Audit-Logging aktivieren", en: "Enable audit logging"} },
                  { checked: false, text: {de: "Access Review durchführen", en: "Conduct access review"} },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-600 cursor-pointer hover:border-cyan-500 transition-colors">
                    <input type="checkbox" checked={item.checked} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900" />
                    <span className="text-sm text-gray-300">{item.text[isDE ? 'de' : 'en']}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Export als PDF", "Export as PDF")}
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Reset", "Reset")}
                </button>
              </div>
            </div>
          </section>

          {/* Feature 3: Code Snippets */}
          <section id="code-snippets" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">3.</span> {pick(isDE, "Copy-Paste Code Snippets — Syntax Highlighting", "Copy-Paste Code Snippets — Syntax Highlighting")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Praktische Configs und Commands mit Syntax Highlighting. Copy to Clipboard Button für schnelles Kopieren.", "Practical configs and commands with syntax highlighting. Copy to clipboard button for quick copying.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase">IAM Policy (AWS)</div>
                  <button className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded transition-colors">
                    {pick(isDE, "Copy", "Copy")}
                  </button>
                </div>
                <pre className="text-green-200 text-xs font-mono overflow-x-auto">
{`MoltbotRole:
  Effect: Allow
  Action:
    - dynamodb:GetItem
    - dynamodb:Query
  Resource:
    - arn:aws:dynamodb:*:*:table/Customers
  Condition:
    StringEquals:
      aws:username: moltbot-service`}
                </pre>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-green-900 text-green-300 px-2 py-1 rounded">✓ {pick(isDE, "Copy-Paste Ready", "Copy-Paste Ready")}</span>
                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded">✓ {pick(isDE, "Syntax Highlighting", "Syntax Highlighting")}</span>
              </div>
            </div>
          </section>

          {/* Feature 4: Security Score Calculator with Benchmark */}
          <section id="score-calculator" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">4.</span> {pick(isDE, "Security Score — Benchmarking vs. Industry", "Security Score — Benchmarking vs. Industry")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Dein Score wird mit Industry Average verglichen. Anonymer Benchmark ohne PII.", "Your score is compared to industry average. Anonymous benchmark without PII.")}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">85</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Dein Score", "Your Score")}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">62</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Industry Avg", "Industry Avg")}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">Top 10%</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Percentile", "Percentile")}</div>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
                {pick(isDE, "Score neu berechnen", "Recalculate Score")}
              </button>
            </div>
          </section>

          {/* Feature 5: Share Badge Generator */}
          <section id="share-badge" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">5.</span> {pick(isDE, "Share Badge — Social Proof Generator", "Share Badge — Social Proof Generator")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Generiere ein Badge mit deinem Security Score. LinkedIn/Twitter/X-ready.", "Generate a badge with your security score. LinkedIn/Twitter/X-ready.")}
              </p>
              <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-lg border border-cyan-700 mb-4 text-center">
                <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Ich habe meinen IAM gehärtet", "I hardened my IAM")}</div>
                <div className="text-4xl font-bold text-white mb-2">Security Score: 85/100</div>
                <div className="text-xs text-cyan-200">clawguru.org/moltbot-iam-hardening</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Download PNG", "Download PNG")}
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Share on LinkedIn", "Share on LinkedIn")}
                </button>
              </div>
            </div>
          </section>

          {/* Feature 6: Difficulty Level + Personalized Path */}
          <section id="difficulty" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">6.</span> {pick(isDE, "Difficulty Level — Personalized Learning Path", "Difficulty Level — Personalized Learning Path")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Personalisierte Lernpfade basierend auf deinem Score. Strukturiertes Lernen von Anfänger bis Experte.", "Personalized learning paths based on your score. Structured learning from beginner to expert.")}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Security Fundamentals", "Moltbot Security Fundamentals")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Grundlagen — 30 min", "Basics — 30 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-cyan-600">
                  <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1">
                    <div className="font-semibold text-cyan-400 text-sm">{pick(isDE, "Moltbot IAM Hardening", "Moltbot IAM Hardening")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Fortgeschritten — 45 min", "Advanced — 45 min")}</div>
                  </div>
                  <span className="text-cyan-400 text-xs">→ {pick(isDE, "Aktuell", "Current")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-600">
                  <div className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-400 text-sm">{pick(isDE, "Moltbot Threat Modeling", "Moltbot Threat Modeling")}</div>
                    <div className="text-xs text-gray-500">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-gray-500 text-xs">{pick(isDE, "Gesperrt", "Locked")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feature 7: Ask AI (Context-Aware Chat) */}
          <section id="ask-ai" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">7.</span> {pick(isDE, "Ask AI — Context-Aware Chat", "Ask AI — Context-Aware Chat")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Chatbot, der den aktuellen Page-Content kennt. RAG mit Page-Content als Context. Antworten mit Zitaten.", "Chatbot that knows the current page content. RAG with page content as context. Responses with citations.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 mb-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">U</div>
                    <div className="bg-gray-800 p-3 rounded-lg flex-1 text-sm text-gray-300">
                      {pick(isDE, "Was ist der Unterschied zwischen RBAC und ABAC?", "What's the difference between RBAC and ABAC?")}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
                    <div className="bg-purple-900 p-3 rounded-lg flex-1 text-sm text-purple-200">
                      {pick(isDE, "RBAC (Role-Based Access Control) basiert auf Rollen, ABAC (Attribute-Based Access Control) basiert auf Attributen wie Zeit, Ort oder Geräte. RBAC ist einfacher zu verwalten, ABAC ist flexibler.", "RBAC (Role-Based Access Control) is based on roles, ABAC (Attribute-Based Access Control) is based on attributes like time, location or device. RBAC is easier to manage, ABAC is more flexible.")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder={pick(isDE, "Stelle eine Frage...", "Ask a question...")} className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors" />
                <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Senden", "Send")}
                </button>
              </div>
            </div>
          </section>

          {/* Additional Features Summary */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              <span className="text-cyan-400">8-12.</span> {pick(isDE, "Weitere Features", "Additional Features")}
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                  <div className="font-semibold text-cyan-400 text-sm mb-2">{pick(isDE, "Context-Aware Related Pages", "Context-Aware Related Pages")}</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Automatische Empfehlung basierend auf Keywords", "Automatic recommendation based on keywords")}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                  <div className="font-semibold text-cyan-400 text-sm mb-2">{pick(isDE, "Export as PDF", "Export as PDF")}</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Offline-lesbar mit Branding", "Offline-readable with branding")}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                  <div className="font-semibold text-cyan-400 text-sm mb-2">{pick(isDE, "Last Updated + Change Log", "Last Updated + Change Log")}</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Transparenz und Vertrauen", "Transparency and trust")}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                  <div className="font-semibold text-cyan-400 text-sm mb-2">{pick(isDE, "Related Tools Context-Aware", "Related Tools Context-Aware")}</div>
                  <div className="text-xs text-gray-400">{pick(isDE, "Relevante Tool-Empfehlungen", "Relevant tool recommendations")}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Daypass Offer */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-xl border border-purple-700 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{pick(isDE, "Daypass — 24h Full Access für €3", "Daypass — 24h Full Access for €3")}</h3>
                  <p className="text-purple-200 text-sm mb-4">{pick(isDE, "Einmalig pro User/Kreditkarte. Volle 24 Stunden Zugang zu allen Security-Tools.", "One-time per user/credit card. Full 24 hours access to all security tools.")}</p>
                  <div className="flex gap-2 text-xs text-purple-300">
                    <span className="bg-purple-800 px-2 py-1 rounded">✓ Security Check</span>
                    <span className="bg-purple-800 px-2 py-1 rounded">✓ Runbooks</span>
                    <span className="bg-purple-800 px-2 py-1 rounded">✓ AI Copilot</span>
                  </div>
                </div>
                <a href={`/${locale}/pricing#daypass`} className="bg-white text-purple-900 font-bold py-3 px-6 rounded-lg hover:bg-purple-100 transition-colors whitespace-nowrap">
                  {pick(isDE, "Daypass kaufen — €3", "Buy Daypass — €3")}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Schema Markup JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": pick(isDE, "Viral Pages Demo — Alle 12 Features im Test", "Viral Pages Demo — All 12 Features Tested"),
          "author": { "@type": "Person", "name": "Schwerti" },
          "datePublished": "2026-04-25",
          "dateModified": "2026-04-25",
          "description": pick(isDE, "Testseite mit allen 12 Features für maximales User-Mehrwert und SEO", "Test page with all 12 features for maximum user value and SEO")
        })
      }} />
    </div>
  )
}
