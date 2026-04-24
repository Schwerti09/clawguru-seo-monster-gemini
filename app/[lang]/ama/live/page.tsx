import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Video, Calendar, Users, Clock, Play } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}/ama/live`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Me Live — AMA Series | ClawGuru", "Roast Me Live — AMA Series | ClawGuru")
  const description = pick(isDE, "Live-Roast Sessions — Roast deinen Stack in Echtzeit", "Live roast sessions — Roast your stack in real-time")
  return {
    title,
    description,
    keywords: ["ama", "live", "roast", "session", "moltbot"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, "/ama/live"),
    robots: "index, follow",
  }
}

const amaSessions = [
  {
    id: "1",
    title: "Roast My Kubernetes Cluster",
    host: "Security Ninja",
    guest: "Cloud Guardian",
    date: "2025-04-20",
    time: "18:00 UTC",
    status: "upcoming",
    attendees: 234,
    duration: "60 min",
    description: "Live roast of a production Kubernetes cluster with Istio",
  },
  {
    id: "2",
    title: "Roast My Python Monolith",
    host: "DevOps Pro",
    guest: "Stack Master",
    date: "2025-04-15",
    time: "17:00 UTC",
    status: "completed",
    attendees: 456,
    duration: "75 min",
    description: "Deep dive into a 500K line Python monolith and its security issues",
  },
  {
    id: "3",
    title: "Roast My Database Architecture",
    host: "AI Security",
    guest: "Database Wizard",
    date: "2025-04-10",
    time: "16:00 UTC",
    status: "completed",
    attendees: 312,
    duration: "90 min",
    description: "PostgreSQL vs MongoDB vs MySQL — live comparison",
  },
]

export default function AMALivePage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold text-gray-100">
              {pick(isDE, "Roast Me Live", "Roast Me Live")}
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            {pick(isDE, "Live-Roast Sessions — Roast deinen Stack in Echtzeit", "Live roast sessions — Roast your stack in real-time")}
          </p>
        </div>

        {/* AMA Sessions */}
        <div className="space-y-6">
          {amaSessions.map((session) => (
            <div key={session.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-semibold text-gray-100 mb-1">{session.title}</div>
                  <div className="text-sm text-zinc-500">
                    {session.host} {pick(isDE, "mit", "with")} {session.guest}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  session.status === "upcoming" ? "bg-green-900/50 text-green-400" : "bg-gray-700 text-zinc-400"
                }`}>
                  {session.status === "upcoming" ? pick(isDE, "Bevorstehend", "Upcoming") : pick(isDE, "Abgeschlossen", "Completed")}
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <div className="text-gray-300">{session.description}</div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{session.attendees} {pick(isDE, "Teilnehmer", "attendees")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{session.duration}</span>
                </div>
              </div>

              {/* Action */}
              {session.status === "upcoming" ? (
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium text-white transition-colors">
                  <Play className="w-4 h-4" />
                  {pick(isDE, "Registrieren", "Register")}
                </button>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-300 transition-colors">
                  <Play className="w-4 h-4" />
                  {pick(isDE, "Ansehen", "Watch")}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Upcoming Banner */}
        <div className="mt-8 bg-gradient-to-r from-red-900/30 to-gray-800 rounded-xl border border-red-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-900/50 rounded-full p-3">
              <Video className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-zinc-500 mb-1">
                {pick(isDE, "Nächste Session", "Next session")}
              </div>
              <div className="text-xl font-bold text-gray-100">
                {pick(isDE, "Roast My Kubernetes Cluster — 20. April 2025", "Roast My Kubernetes Cluster — April 20, 2025")}
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium text-white transition-colors">
              {pick(isDE, "Jetzt registrieren", "Register now")}
            </button>
          </div>
        </div>

        {/* Trust Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "AMA Sessions sind zum Härten eigener Systeme. Keine Angriffstools.", "AMA sessions are for hardening your own systems. No attack tools.")}
        </div>
      </div>
    </div>
  )
}
