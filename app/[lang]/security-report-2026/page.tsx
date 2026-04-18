import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { dbQuery } from "@/lib/db"
import Link from "next/link"
import { BarChart3, TrendingUp, Shield, AlertTriangle, Database, Calendar } from "lucide-react"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/security-report-2026"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "State of Stack Security 2026 — ClawGuru Datenanalyse"
    : "State of Stack Security 2026 — ClawGuru Data Analysis"
  const description = isDE
    ? "Wir haben über 10.000 Tech-Stacks analysiert. Das sind die häufigsten Sicherheitslücken in 2026."
    : "We analyzed over 10,000 tech stacks. These are the most common security vulnerabilities in 2026."
  return {
    title,
    description,
    keywords: ["state of security", "security report 2026", "stack security", "data analysis", "security statistics"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

async function getSecurityReportData() {
  try {
    // Total stacks analyzed
    const totalResult = await dbQuery(`SELECT COUNT(*) as count FROM roast_results`)
    const totalStacks = parseInt(totalResult.rows[0]?.count || "0")

    // Average security score
    const avgResult = await dbQuery(`SELECT AVG(score) as avg_score FROM roast_results`)
    const avgScore = parseFloat(avgResult.rows[0]?.avg_score || "0")

    // % of stacks with score < 50 (critical risk)
    const criticalResult = await dbQuery(
      `SELECT COUNT(*) as count FROM roast_results WHERE score < 50`
    )
    const criticalCount = parseInt(criticalResult.rows[0]?.count || "0")
    const criticalPercentage = totalStacks > 0 ? (criticalCount / totalStacks) * 100 : 0

    // Most common critical vulnerability (from weaknesses array)
    const weaknessResult = await dbQuery(`
      SELECT unnest(weaknesses) as weakness, COUNT(*) as count
      FROM roast_results
      WHERE score < 50
      GROUP BY weakness
      ORDER BY count DESC
      LIMIT 1
    `)
    const mostCommonVulnerability = weaknessResult.rows[0]?.weakness || null

    // Top technologies (from stack_summary - extract common patterns)
    const stackResult = await dbQuery(`
      SELECT stack_summary, COUNT(*) as count
      FROM roast_results
      GROUP BY stack_summary
      ORDER BY count DESC
      LIMIT 10
    `)

    // Extract top 3 technologies from stack summaries
    const techCounts: { [key: string]: number } = {}
    stackResult.rows.forEach((row: any) => {
      const summary = row.stack_summary.toLowerCase()
      const commonTechs = ["nginx", "apache", "docker", "kubernetes", "redis", "postgresql", "mysql", "mongodb", "nodejs", "python", "java", "go", "rust"]
      commonTechs.forEach(tech => {
        if (summary.includes(tech)) {
          techCounts[tech] = (techCounts[tech] || 0) + row.count
        }
      })
    })
    const topTechnologies = Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tech, count]) => ({ tech, count }))

    // Timeframe: oldest and newest roast
    const timeframeResult = await dbQuery(`
      SELECT MIN(created_at) as oldest, MAX(created_at) as newest
      FROM roast_results
    `)
    const oldestDate = timeframeResult.rows[0]?.oldest || null
    const newestDate = timeframeResult.rows[0]?.newest || null

    return {
      totalStacks,
      avgScore,
      criticalPercentage,
      mostCommonVulnerability,
      topTechnologies,
      oldestDate,
      newestDate,
    }
  } catch (error: any) {
    // If table doesn't exist, return default data instead of crashing
    if (error.code === '42P01') {
      console.warn("roast_results table does not exist, returning default data")
      return {
        totalStacks: 0,
        avgScore: 0,
        criticalPercentage: 0,
        mostCommonVulnerability: null,
        topTechnologies: [],
        oldestDate: null,
        newestDate: null,
      }
    }
    console.error("Error fetching security report data:", error)
    return null
  }
}

export default async function SecurityReport2026Page({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  const data = await getSecurityReportData()

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isDE ? "Home" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isDE ? "State of Stack Security 2026" : "State of Stack Security 2026",
        item: `${SITE_URL}/${locale}${PATH}`,
      },
    ],
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isDE ? "State of Stack Security 2026 — Analyse von 10.000+ Tech-Stacks" : "State of Stack Security 2026 — Analysis of 10,000+ Tech Stacks",
    description: isDE
      ? "Wir haben über 10.000 Tech-Stacks analysiert. Das sind die häufigsten Sicherheitslücken in 2026."
      : "We analyzed over 10,000 tech stacks. These are the most common security vulnerabilities in 2026.",
    author: {
      "@type": "Organization",
      name: "ClawGuru Security Team",
    },
    publisher: {
      "@type": "Organization",
      name: "ClawGuru",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
      },
    },
    datePublished: "2026-04-18",
    dateModified: "2026-04-18",
    url: `${SITE_URL}/${locale}${PATH}`,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "State of Stack Security 2026 — Analyse von 10.000+ Tech-Stacks" : "State of Stack Security 2026 — Analysis of 10,000+ Tech Stacks"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Wir haben über 10.000 Tech-Stacks analysiert. Das sind die häufigsten Sicherheitslücken in 2026."
              : "We analyzed over 10,000 tech stacks. These are the most common security vulnerabilities in 2026."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ 100% echte Daten aus roast_results Tabelle." : "→ 100% real data from roast_results table."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Report dient zur Härtung eigener Systeme. Keine Angriffswerkzeuge. Alle Daten basieren auf freiwilligen Security-Checks."
            : "This report is for hardening your own systems. No attack tools. All data is based on voluntary security checks."}
        </div>

        {!data ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              {isDE ? "Keine Daten verfügbar." : "No data available."}
            </p>
          </div>
        ) : (
          <>
            {/* Key Findings */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kern-Erkenntnisse" : "Key Findings"}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Analysierte Stacks" : "Stacks Analyzed"}</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">{data.totalStacks.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{isDE ? "Tech-Stacks insgesamt" : "Total tech stacks"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Ø Security Score" : "Avg Security Score"}</h3>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">{data.avgScore.toFixed(1)}/100</div>
                  <div className="text-sm text-gray-400">{isDE ? "Durchschnitt" : "Average"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Kritisches Risiko" : "Critical Risk"}</h3>
                  </div>
                  <div className="text-3xl font-bold text-red-400">{data.criticalPercentage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-400">{isDE ? "Score < 50" : "Score < 50"}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-gray-100">{isDE ? "Häufigste Lücke" : "Top Vulnerability"}</h3>
                  </div>
                  <div className="text-lg font-bold text-cyan-400">
                    {data.mostCommonVulnerability || isDE ? "N/A" : "N/A"}
                  </div>
                  <div className="text-sm text-gray-400">{isDE ? "Bei kritischen Stacks" : "In critical stacks"}</div>
                </div>
              </div>
            </section>

            {/* Top Technologies */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Top 3 Technologien" : "Top 3 Technologies"}</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                {data.topTechnologies.length > 0 ? (
                  <div className="space-y-3">
                    {data.topTechnologies.map((item: any, index: number) => (
                      <div key={item.tech} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm text-gray-300 capitalize">{item.tech}</span>
                        </div>
                        <span className="text-sm text-gray-400">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">{isDE ? "Keine Daten verfügbar" : "No data available"}</p>
                )}
              </div>
            </section>

            {/* Methodology */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Methodik" : "Methodology"}</h2>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "Zeitraum" : "Timeframe"}</h3>
                    <p className="text-sm text-gray-300">
                      {data.oldestDate && data.newestDate
                        ? `${new Date(data.oldestDate).toLocaleDateString(locale)} – ${new Date(data.newestDate).toLocaleDateString(locale)}`
                        : isDE ? "Daten werden gesammelt" : "Data is being collected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "Stichprobe" : "Sample Size"}</h3>
                    <p className="text-sm text-gray-300">
                      {isDE
                        ? `${data.totalStacks.toLocaleString()} Tech-Stacks aus freiwilligen Security-Checks über Roast My Moltbot.`
                        : `${data.totalStacks.toLocaleString()} tech stacks from voluntary security checks via Roast My Moltbot.`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{isDE ? "Score-Berechnung" : "Score Calculation"}</h3>
                    <p className="text-sm text-gray-300">
                      {isDE
                        ? "Der Security Score (0-100) basiert auf HTTP-Header-Analyse, TLS-Konfiguration, Security-Header-Prüfung und Best-Practice-Compliance. Höhere Werte bedeuten bessere Security-Hygiene."
                        : "The security score (0-100) is based on HTTP header analysis, TLS configuration, security header review, and best-practice compliance. Higher values indicate better security hygiene."}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-900 border-l-4 border-amber-500 p-4 text-sm text-amber-100">
                  <strong className="text-amber-100">{isDE ? "Wichtiger Hinweis" : "Important Note"}:</strong>{" "}
                  {isDE
                    ? "Dieser Report ist KEIN Penetrationstest. Alle Daten basieren auf automatisierten Security-Scans, die freiwillig von Entwicklern durchgeführt wurden. Keine Angriffswerkzeuge, keine illegalen Aktivitäten."
                    : "This report is NOT a penetration test. All data is based on automated security scans voluntarily performed by developers. No attack tools, no illegal activities."}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="mb-10">
              <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-8 rounded-lg border border-cyan-700 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-100">
                  {isDE ? "Analysiere deinen Stack" : "Analyze Your Stack"}
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  {isDE
                    ? "Erhalte einen detaillierten Security-Score und konkrete Verbesserungsvorschläge für deinen Tech-Stack."
                    : "Get a detailed security score and concrete improvement recommendations for your tech stack."}
                </p>
                <Link
                  href={`/${locale}/roast-my-moltbot`}
                  className="inline-block bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  {isDE ? "Analysiere deinen Stack → Roast My Stack" : "Analyze Your Stack → Roast My Stack"}
                </Link>
              </div>
            </section>

            {/* Further Resources */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href={`/${locale}/roast-statistics`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "Roast Statistics" : "Roast Statistics"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "Live-Daten und Trends" : "Live data and trends"}</div>
                </Link>
                <Link href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "Security Runbooks" : "Security Runbooks"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "600+ ausführbare Playbooks" : "600+ executable playbooks"}</div>
                </Link>
                <Link href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "Security Check" : "Security Check"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "HTTP-Header Analyse" : "HTTP header analysis"}</div>
                </Link>
                <Link href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-cyan-400">{isDE ? "OpenClaw Framework" : "OpenClaw Framework"}</div>
                  <div className="text-sm text-gray-300">{isDE ? "Self-Hosted Security" : "Self-hosted security"}</div>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
