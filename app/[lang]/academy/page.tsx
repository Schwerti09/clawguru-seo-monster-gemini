import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { EmailCapture } from "@/components/conversion/EmailCapture"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/academy`

  // MINI-ACADEMY FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: locale === "de" ? "Brauche ich Vorkenntnisse?" : "Do I need prior knowledge?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Nein. Der Beginner-Pfad startet bei Null. Intermediate setzt Linux-Grundkenntnisse voraus."
            : "No. The Beginner path starts at zero. Intermediate requires basic Linux knowledge."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Kostet die Academy etwas?" : "Does the Academy cost anything?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Die Lernpfade sind komplett kostenlos. Runbook-Ausführung erfordert Pro (49€/Mo)."
            : "The learning paths are completely free. Runbook execution requires Pro (49€/mo)."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Bekomme ich ein Zertifikat?" : "Do I get a certificate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Nach jedem Pfad gibt es einen herunterladbaren Completion-Badge."
            : "After each path you get a downloadable Completion Badge."
        }
      }
    ]
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "de" ? "Home" : "Home",
        item: `${SITE_URL}/${locale}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "de" ? "Academy" : "Academy",
        item: `${SITE_URL}/${locale}/academy`
      }
    ]
  }

  return {
    title: locale === "de" 
      ? "Security Academy — Lerne Self-Hosted Security | ClawGuru"
      : "Security Academy — Learn Self-Hosted Security | ClawGuru",
    description: locale === "de"
      ? "3 Lernpfade für Self-Hosted Security. Von Beginner bis Expert. Kostenlos starten — kein Vorwissen nötig."
      : "3 learning paths for self-hosted security. From beginner to expert. Start free — no prior knowledge needed.",
    openGraph: {
      title: locale === "de" 
        ? "Security Academy — Lerne Self-Hosted Security | ClawGuru"
        : "Security Academy — Learn Self-Hosted Security | ClawGuru",
      description: locale === "de"
        ? "3 Lernpfade für Self-Hosted Security. Von Beginner bis Expert. Kostenlos starten — kein Vorwissen nötig."
        : "3 learning paths for self-hosted security. From beginner to expert. Start free — no prior knowledge needed.",
      type: "website",
      url: pageUrl,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ClawGuru Academy" }],
    },
    alternates: buildLocalizedAlternates(locale, "/academy"),
    robots: "index, follow",
    other: {
      "application/ld+json": JSON.stringify([faqSchema, breadcrumbSchema])
    }
  }
}

export default async function AcademyPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const prefix = `/${locale}`

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* MINI-ACADEMY HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-[#0a0a0a] to-red-900/20" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-900/20 text-green-400 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>{locale === "de" ? "MINI-ACADEMY — KOSTENLOS" : "MINI-ACADEMY — FREE"}</span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              <span className="text-gray-100">
                {locale === "de" ? "Lerne Security. Wirklich." : "Learn Security. Really."}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                {locale === "de" ? "Schritt für Schritt." : "Step by step."}
              </span>
            </h1>

            {/* Sub - dulli-friendly */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              {locale === "de"
                ? "Egal ob du noch nie einen Server angefasst hast oder schon K8s-Cluster betreibst — hier findest du deinen Lernpfad. Keine Buzzwords. Echte Kommandos. Sofort umsetzbar."
                : "Whether you've never touched a server or you're already running K8s clusters — here you'll find your learning path. No buzzwords. Real commands. Immediately actionable."}
            </p>
          </div>
        </div>
      </section>

      {/* "NOT A PENTEST" NOTICE */}
      <section className="py-8 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-amber-900 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <p className="text-amber-100 text-sm leading-relaxed">
              <strong className="text-amber-100">NOT A PENTEST:</strong> {" "}
              {locale === "de"
                ? "Diese Academy lehrt Defensive Security — wie du deine eigenen Server schützt. Keine Angriffstechniken, keine Exploits. Nur Defense."
                : "This Academy teaches Defensive Security — how to protect your own servers. No attack techniques, no exploits. Just defense."}
            </p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-6 bg-[#0a0a0a] border-t border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="text-green-400">🌍</span> {locale === "de" ? "5 Sprachen" : "5 Languages"}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-cyan-400">📚</span> {locale === "de" ? "18 Lektionen total" : "18 Lessons total"}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-purple-400">💰</span> {locale === "de" ? "Kostenlos" : "Free"}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-amber-400">🔓</span> {locale === "de" ? "Kein Signup" : "No Signup"}
            </span>
          </div>
        </div>
      </section>

      {/* 3 PATH-CARDS */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Card 1 — BEGINNER */}
            <Link href={`${prefix}/academy/beginner`} className="group relative bg-green-900 border border-green-700 rounded-2xl p-8 hover:border-green-500 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-green-800 text-green-300 text-xs font-bold">
                  {locale === "de" ? "KEIN VORWISSEN NÖTIG" : "NO PRIOR KNOWLEDGE"}
                </span>
              </div>
              <div className="text-4xl mb-4">🟢</div>
              <h3 className="text-2xl font-black text-gray-100 mb-2">
                {locale === "de" ? "Security-Grundlagen" : "Security Fundamentals"}
              </h3>
              <p className="text-green-200 text-sm mb-4">
                {locale === "de" ? "Für alle die noch nie einen Server gehärtet haben" : "For anyone who has never hardened a server"}
              </p>
              <div className="flex items-center gap-4 text-sm text-green-300 mb-6">
                <span>⏱️ ~45 Min</span>
                <span>📚 5 Lektionen</span>
              </div>
              <div className="text-sm text-green-200 mb-6 space-y-2">
                <p>✓ {locale === "de" ? "Security-Headers verstehen" : "Understand Security Headers"}</p>
                <p>✓ {locale === "de" ? "TLS/HTTPS einrichten" : "Setup TLS/HTTPS"}</p>
                <p>✓ {locale === "de" ? "Firewall-Grundlagen (UFW)" : "Firewall Basics (UFW)"}</p>
                <p>✓ {locale === "de" ? "Security Check interpretieren" : "Interpret Security Check"}</p>
                <p>✓ {locale === "de" ? "Top 3 Misconfigs beheben" : "Fix Top 3 Misconfigs"}</p>
              </div>
              <div className="text-xs text-green-300 mb-4">
                {locale === "de"
                  ? "Für wen: Heimlabore, erste Server, alle die 'irgendwann mal Security machen wollen'"
                  : "For whom: Homelabs, first servers, anyone who wants to 'do security someday'"}
              </div>
              <div className="bg-green-800 border border-green-600 text-green-100 font-bold text-center py-3 rounded-lg group-hover:bg-green-700 transition-colors">
                {locale === "de" ? "Jetzt starten →" : "Start Now →"}
              </div>
            </Link>

            {/* Card 2 — INTERMEDIATE */}
            <Link href={`${prefix}/academy/intermediate`} className="group relative bg-blue-900 border border-blue-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-blue-800 text-blue-300 text-xs font-bold">
                  {locale === "de" ? "EMPFOHLEN FÜR TEAMS" : "RECOMMENDED FOR TEAMS"}
                </span>
              </div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-black text-gray-100 mb-2">
                {locale === "de" ? "Stack Hardening" : "Stack Hardening"}
              </h3>
              <p className="text-blue-200 text-sm mb-4">
                {locale === "de" ? "Für DevOps-Teams und Solo-Ops" : "For DevOps teams and solo ops"}
              </p>
              <div className="flex items-center gap-4 text-sm text-blue-300 mb-6">
                <span>⏱️ ~90 Min</span>
                <span>📚 7 Lektionen</span>
              </div>
              <div className="text-sm text-blue-200 mb-6 space-y-2">
                <p>✓ {locale === "de" ? "Docker Security — Container isolieren" : "Docker Security — Container isolation"}</p>
                <p>✓ {locale === "de" ? "Nginx Hardening — Headers, Rate Limiting" : "Nginx Hardening — Headers, Rate Limiting"}</p>
                <p>✓ {locale === "de" ? "Secrets Management mit Vault" : "Secrets Management with Vault"}</p>
                <p>✓ {locale === "de" ? "RBAC — wer darf was" : "RBAC — who can do what"}</p>
                <p>✓ {locale === "de" ? "Incident Response — was tun wenn's brennt" : "Incident Response — what to do when it burns"}</p>
                <p>✓ {locale === "de" ? "NIS2 Basics" : "NIS2 Basics"}</p>
                <p>✓ {locale === "de" ? "Automatisierter Security Check mit CI/CD" : "Automated Security Check with CI/CD"}</p>
              </div>
              <div className="text-xs text-blue-300 mb-4">
                {locale === "de"
                  ? "Für wen: Teams die self-hosten und wissen wollen ob sie es richtig machen"
                  : "For whom: Teams who self-host and want to know if they're doing it right"}
              </div>
              <div className="bg-blue-800 border border-blue-600 text-blue-100 font-bold text-center py-3 rounded-lg group-hover:bg-blue-700 transition-colors">
                {locale === "de" ? "Jetzt starten →" : "Start Now →"}
              </div>
            </Link>

            {/* Card 3 — ADVANCED */}
            <Link href={`${prefix}/academy/advanced`} className="group relative bg-red-900 border border-red-700 rounded-2xl p-8 hover:border-red-500 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-red-800 text-red-300 text-xs font-bold">
                  {locale === "de" ? "NEU — AI SECURITY" : "NEW — AI SECURITY"}
                </span>
              </div>
              <div className="text-4xl mb-4">🔴</div>
              <h3 className="text-2xl font-black text-gray-100 mb-2">
                {locale === "de" ? "AI Agent Security" : "AI Agent Security"}
              </h3>
              <p className="text-red-200 text-sm mb-4">
                {locale === "de" ? "Für Security-Engineers und AI-Builders" : "For Security Engineers and AI Builders"}
              </p>
              <div className="flex items-center gap-4 text-sm text-red-300 mb-6">
                <span>⏱️ ~120 Min</span>
                <span>📚 6 Lektionen</span>
              </div>
              <div className="text-sm text-red-200 mb-6 space-y-2">
                <p>✓ {locale === "de" ? "Prompt Injection — wie Angreifer AI-Agents kapern" : "Prompt Injection — how attackers hijack AI agents"}</p>
                <p>✓ {locale === "de" ? "LLM Gateway Hardening" : "LLM Gateway Hardening"}</p>
                <p>✓ {locale === "de" ? "AI Agent Sandboxing" : "AI Agent Sandboxing"}</p>
                <p>✓ {locale === "de" ? "Threat Modeling für AI-Systeme" : "Threat Modeling for AI Systems"}</p>
                <p>✓ {locale === "de" ? "OWASP Top 10 für LLMs" : "OWASP Top 10 for LLMs"}</p>
                <p>✓ {locale === "de" ? "Compliance (EU AI Act)" : "Compliance (EU AI Act)"}</p>
              </div>
              <div className="text-xs text-red-300 mb-4">
                {locale === "de"
                  ? "Für wen: Alle die AI-Agents produktiv einsetzen und nicht gehackt werden wollen"
                  : "For whom: Anyone who deploys AI agents in production and doesn't want to get hacked"}
              </div>
              <div className="bg-red-800 border border-red-600 text-red-100 font-bold text-center py-3 rounded-lg group-hover:bg-red-700 transition-colors">
                {locale === "de" ? "Jetzt starten →" : "Start Now →"}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-cyan-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-6">
              {locale === "de" ? "Lieber Hands-on statt Self-Learning?" : "Prefer hands-on instead of self-learning?"}
            </h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Unser Team härtet deinen Stack direkt — Fixed-Fee ab 5.000€"
                : "Our team hardens your stack directly — Fixed-fee from €5,000"}
            </p>
            <Link
              href={`${prefix}/consulting`}
              className="inline-block bg-white text-purple-900 font-black text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {locale === "de" ? "Strategy Call buchen" : "Book Strategy Call"}
            </Link>
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <EmailCapture locale={locale} source="academy_page" variant="card" />
          </div>
        </div>
      </section>
    </div>
  )
}
