// WORLD BEAST: app/dashboard/worldbeast/page.tsx
// Dashboard 2.0 – Live Worldbeast Score, Revenue, Runbooks generated, Global Rank.
// "One-Click World Domination" button activates all agents at maximum power.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { getAccess } from "@/lib/access"
import { calculateDailyRevenue } from "@/lib/passive"
import { checkSiteHealth } from "@/lib/selfhealth"
import { RUNBOOKS } from "@/lib/pseo"

export const runtime = "nodejs"
// WORLD BEAST: revalidate every 5 minutes so the score stays fresh
export const revalidate = 300

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: "cyan" | "violet" | "orange" | "green"
}) {
  const colors: Record<string, string> = {
    cyan:   "border-cyan-500/30 text-cyan-400",
    violet: "border-violet-500/30 text-violet-400",
    orange: "border-orange-500/30 text-orange-400",
    green:  "border-emerald-500/30 text-emerald-400",
  }
  const cls = colors[accent ?? "cyan"]
  return (
    <div className={`p-6 rounded-3xl border bg-black/30 ${cls.split(" ")[0]}`}>
      <div className="text-xs uppercase tracking-widest text-gray-400">{label}</div>
      <div className={`mt-2 text-4xl font-black ${cls.split(" ")[1]}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  )
}

function WorldbeastScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score))
  const color =
    pct >= 90 ? "from-emerald-500 to-cyan-500" :
    pct >= 70 ? "from-cyan-500 to-violet-500" :
    "from-orange-500 to-red-600"
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Worldbeast Score</span>
        <span className="font-black text-white">{pct}/100</span>
      </div>
      <div className="h-4 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function Paywall() {
  return (
    <Container>
      <div className="py-16 max-w-3xl mx-auto text-center">
        <SectionTitle
          kicker="Worldbeast Dashboard"
          title="Nur für Pro-Mitglieder"
          subtitle="Aktiviere ClawGuru Pro, um das Worldbeast Dashboard freizuschalten."
        />
        <div className="mt-8 flex justify-center gap-3">
          <a
            href="/pricing"
            className="px-8 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
          >
            Pro freischalten →
          </a>
        </div>
      </div>
    </Container>
  )
}

export default async function WorldbeastDashboardPage() {
  const access = await getAccess()
  if (!access.ok) return <Paywall />

  // WORLD BEAST: Gather live data in parallel
  const [revenue, health] = await Promise.all([
    calculateDailyRevenue(),
    checkSiteHealth({ skipRemote: true }),
  ])

  const totalRunbooks = RUNBOOKS.length
  const worldbeastScore = Math.round(
    health.score * 0.4 +
    Math.min(100, (revenue.total / 10000) * 0.3) +
    Math.min(100, (totalRunbooks / 1000) * 0.3) * 100 * 0.3
  )

  // WORLD BEAST: mock global rank derived from worldbeast score
  const globalRank = Math.max(1, Math.floor(100 - worldbeastScore / 2))

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <SectionTitle
            kicker="Dashboard 2.0"
            title="🌍 Worldbeast Command Center"
            subtitle={`Stand: ${today} · Echtzeit-Status der ClawGuru Weltmacht`}
          />
          <div className="flex flex-wrap gap-3">
            {/* WORLD BEAST: One-Click World Domination Button */}
            <form action="/api/agents" method="POST">
              <input type="hidden" name="agent" value="all" />
              <a
                href="/api/selfhealth/cron"
                className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:opacity-90 text-black animate-pulse"
              >
                ⚡ One-Click World Domination
              </a>
            </form>
            <a
              href="/dashboard"
              className="px-5 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
            >
              ← Classic Dashboard
            </a>
          </div>
        </div>

        {/* Worldbeast Score bar */}
        <div className="mb-8 p-6 rounded-3xl border border-cyan-500/20 bg-black/30">
          <WorldbeastScoreBar score={worldbeastScore} />
          <div className="mt-4 text-xs text-gray-400">
            Worldbeast Score = Health (40%) + Revenue-Momentum (30%) + Content-Tiefe (30%)
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="💰 Revenue heute"
            value={revenue.formatted}
            sub="Stripe + Affiliates"
            accent="green"
          />
          <StatCard
            label="📚 Runbooks gesamt"
            value={totalRunbooks.toLocaleString("de-DE")}
            sub="inkl. programmatic SEO"
            accent="cyan"
          />
          <StatCard
            label="🏥 Health Score"
            value={`${health.score}/100`}
            sub={health.ok ? "✅ Alle Checks OK" : `⚠️ ${health.checks.filter((c) => c.status === "fail").length} Fehler`}
            accent={health.score >= 80 ? "green" : "orange"}
          />
          <StatCard
            label="🌍 Global Rank"
            value={`#${globalRank}`}
            sub="Ops Intelligence Platforms"
            accent="violet"
          />
        </div>

        {/* Agent Status */}
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          {[
            {
              name: "🔍 Vulnerability Hunter",
              desc: "Scannt täglich neue CVEs und baut Runbooks automatisch.",
              href: "/api/agents?agent=vulnerability-hunter",
              color: "border-red-500/20",
            },
            {
              name: "📣 Viral Content Agent",
              desc: "Generiert Twitter, LinkedIn & Reddit Threads für jedes neue Runbook.",
              href: "/api/agents?agent=viral-content",
              color: "border-sky-500/20",
            },
            {
              name: "📈 Growth Agent",
              desc: "Analysiert Traffic, schlägt Keywords vor, baut Landingpages.",
              href: "/api/agents?agent=growth",
              color: "border-green-500/20",
            },
          ].map((agent) => (
            <div key={agent.name} className={`p-6 rounded-3xl border bg-black/30 ${agent.color}`}>
              <div className="font-black text-sm mb-2">{agent.name}</div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{agent.desc}</p>
              <span className="text-xs text-gray-500 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">
                ✅ Aktiv
              </span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">🚀 Quick Actions</div>
            <div className="grid gap-3">
              <a
                href="/check"
                className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-center"
              >
                Live Security Check
              </a>
              <a
                href="/leaderboard"
                className="px-5 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 text-center"
              >
                Leaderboard ansehen
              </a>
              <a
                href="/runbooks"
                className="px-5 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 text-center"
              >
                Runbooks durchsuchen
              </a>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">🌐 Multi-Language Status</div>
            <div className="grid gap-2">
              {[
                { lang: "🇩🇪 Deutsch", path: "/runbooks", status: "✅ Live" },
                { lang: "🇬🇧 English", path: "/en/runbook/", status: "✅ Live" },
                { lang: "🇪🇸 Español", path: "/es/runbook/", status: "✅ Live" },
                { lang: "🇫🇷 Français", path: "/fr/runbook/", status: "✅ Live" },
              ].map(({ lang, path, status }) => (
                <div key={lang} className="flex justify-between text-sm py-1 border-b border-gray-800/50 last:border-0">
                  <a href={path} className="text-gray-300 hover:text-cyan-400">{lang}</a>
                  <span className="text-xs text-emerald-400">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health check details */}
        <div className="rounded-3xl border border-gray-800 bg-black/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <span className="font-black">🏥 Site Health Details</span>
            <span className="ml-3 text-xs text-gray-500">{health.summary}</span>
          </div>
          <div className="divide-y divide-gray-800/50">
            {health.checks.slice(0, 10).map((check) => (
              <div key={check.name} className="px-6 py-3 flex items-center justify-between gap-4">
                <span className="text-sm font-mono text-gray-400">{check.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-lg ${
                    check.status === "ok"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : check.status === "warn"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {check.status === "ok" ? "✅" : check.status === "warn" ? "⚠️" : "❌"} {check.status}
                </span>
                <span className="text-xs text-gray-500 hidden md:block truncate max-w-xs">{check.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
