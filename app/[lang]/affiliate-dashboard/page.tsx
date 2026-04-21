import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/affiliate-dashboard"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Affiliate Dashboard | ClawGuru"
    : "Affiliate Dashboard | ClawGuru"
  const description = isDE
    ? "Verfolge deine Affiliate-Stats: Klicks, Conversions, Earnings. Echtzeit-Dashboard für ClawGuru Affiliates."
    : "Track your affiliate stats: clicks, conversions, earnings. Real-time dashboard for ClawGuru affiliates."
  return {
    title,
    description,
    keywords: ["affiliate dashboard", "affiliate stats", "commission tracking", "clawguru affiliate"],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "noindex, nofollow", // Dashboard should not be indexed
  }
}

// Mock data — replace with real data from database
const getMockStats = (isDE: boolean) => ({
  totalClicks: 1247,
  totalConversions: 38,
  totalEarnings: 558.60,
  currentTier: "Growth",
  commissionRate: 35,
  pendingPayout: 186.20,
  lastPayout: 372.40,
  lastPayoutDate: "2026-03-31",
})

const getRecentReferrals = (isDE: boolean) => [
  { id: 1, date: "2026-04-20", plan: isDE ? "Pro" : "Pro", commission: 17.15, status: isDE ? "Aktiv" : "Active" },
  { id: 2, date: "2026-04-19", plan: isDE ? "Team" : "Team", commission: 45.15, status: isDE ? "Aktiv" : "Active" },
  { id: 3, date: "2026-04-18", plan: isDE ? "Pro" : "Pro", commission: 17.15, status: isDE ? "Aktiv" : "Active" },
  { id: 4, date: "2026-04-17", plan: isDE ? "Pro" : "Pro", commission: 17.15, status: isDE ? "Aktiv" : "Active" },
  { id: 5, date: "2026-04-16", plan: isDE ? "Pro" : "Pro", commission: 17.15, status: isDE ? "Aktiv" : "Active" },
]

const getTopPerformers = (isDE: boolean) => [
  { rank: 1, name: isDE ? "Tech Security Blog" : "Tech Security Blog", clicks: 342, conversions: 12, earnings: 205.80 },
  { rank: 2, name: isDE ? "DevOps Weekly" : "DevOps Weekly", clicks: 289, conversions: 10, earnings: 171.50 },
  { rank: 3, name: isDE ? "Cloud Native News" : "Cloud Native News", clicks: 215, conversions: 8, earnings: 137.20 },
]

export default function AffiliateDashboardPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const stats = getMockStats(isDE)
  const recentReferrals = getRecentReferrals(isDE)
  const topPerformers = getTopPerformers(isDE)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2">
              {isDE ? "Affiliate Dashboard" : "Affiliate Dashboard"}
            </h1>
            <p className="text-gray-400">
              {isDE ? "Verfolge deine Performance und Earnings" : "Track your performance and earnings"}
            </p>
          </div>
          <Link
            href={`/${locale}/partners-apply`}
            className="px-4 py-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm"
          >
            {isDE ? "Partner-Programm" : "Partner Program"}
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">{isDE ? "Gesamt-Klicks" : "Total Clicks"}</div>
            <div className="text-3xl font-black text-cyan-400">{stats.totalClicks}</div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">{isDE ? "Conversions" : "Conversions"}</div>
            <div className="text-3xl font-black text-emerald-400">{stats.totalConversions}</div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">{isDE ? "Gesamt-Earnings" : "Total Earnings"}</div>
            <div className="text-3xl font-black text-cyan-400">€{stats.totalEarnings.toFixed(2)}</div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">{isDE ? "Aktuelle Rate" : "Current Rate"}</div>
            <div className="text-3xl font-black text-purple-400">{stats.commissionRate}%</div>
          </div>
        </div>

        {/* Commission Tier */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-6 rounded-xl border border-cyan-700/50 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">{isDE ? "Dein Tier" : "Your Tier"}</div>
              <div className="text-2xl font-black text-cyan-300">{stats.currentTier}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">{isDE ? "Provision" : "Commission"}</div>
              <div className="text-2xl font-black text-cyan-300">{stats.commissionRate}%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">{isDE ? "Nächstes Tier" : "Next Tier"}</div>
              <div className="text-2xl font-black text-gray-300">{isDE ? "Elite (40%)" : "Elite (40%)"}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{isDE ? "Fortschritt zum nächsten Tier" : "Progress to next tier"}</span>
              <span>{isDE ? "38/50 Referrals" : "38/50 referrals"}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "76%" }}></div>
            </div>
          </div>
        </div>

        {/* Payouts */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">{isDE ? "Ausstehende Auszahlung" : "Pending Payout"}</div>
            <div className="text-3xl font-black text-amber-400">€{stats.pendingPayout.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-2">{isDE ? "Auszahlung am 30.04.2026" : "Payout on 30.04.2026"}</div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">{isDE ? "Letzte Auszahlung" : "Last Payout"}</div>
            <div className="text-3xl font-black text-emerald-400">€{stats.lastPayout.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-2">{stats.lastPayoutDate}</div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">{isDE ? "Neue Referrals" : "Recent Referrals"}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="pb-3">{isDE ? "Datum" : "Date"}</th>
                  <th className="pb-3">{isDE ? "Plan" : "Plan"}</th>
                  <th className="pb-3">{isDE ? "Provision" : "Commission"}</th>
                  <th className="pb-3">{isDE ? "Status" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {recentReferrals.map((ref) => (
                  <tr key={ref.id} className="border-b border-gray-700/50">
                    <td className="py-3 text-sm">{ref.date}</td>
                    <td className="py-3 text-sm">{ref.plan}</td>
                    <td className="py-3 text-sm text-emerald-400">€{ref.commission.toFixed(2)}</td>
                    <td className="py-3 text-sm">
                      <span className="px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-300 text-xs">
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Links */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">{isDE ? "Top-Performer" : "Top Performers"}</h2>
          <div className="space-y-3">
            {topPerformers.map((perf) => (
              <div key={perf.rank} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900 text-cyan-300 font-black flex items-center justify-center text-sm">
                    {perf.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{perf.name}</div>
                    <div className="text-xs text-gray-400">{perf.clicks} clicks</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm text-emerald-400">€{perf.earnings.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">{perf.conversions} conv</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Assets */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">{isDE ? "Marketing-Assets" : "Marketing Assets"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
              <div className="font-semibold mb-2">{isDE ? "Dein Affiliate-Link" : "Your Affiliate Link"}</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://clawguru.org/?ref=affiliate-123"
                  className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300"
                />
                <button className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-sm font-semibold transition-colors">
                  {isDE ? "Kopieren" : "Copy"}
                </button>
              </div>
            </div>
            <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
              <div className="font-semibold mb-2">{isDE ? "Banners & Copy" : "Banners & Copy"}</div>
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-sm font-semibold transition-colors w-full">
                {isDE ? "Assets herunterladen" : "Download Assets"}
              </button>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-4">
            {isDE ? "Fragen? Kontaktiere deinen Partner-Manager" : "Questions? Contact your partner manager"}
          </p>
          <a
            href="mailto:affiliates@clawguru.org"
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            affiliates@clawguru.org
          </a>
        </div>
      </div>
    </main>
  )
}
