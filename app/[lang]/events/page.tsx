import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Calendar, MapPin, Video, Users, Clock, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/events"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Events — IRL/Virtual Conferences | ClawGuru", "Roast Events — IRL/Virtual Conferences | ClawGuru")
  const description = pick(isDE, "Security-Conferences und Events. IRL und Virtual. Keine Mock-Daten.", "Security conferences and events. IRL and virtual. No mock data.")
  return {
    title,
    description,
    keywords: ["roast events", "security conferences", "irl events", "virtual events", "brand building"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getEvents = (isDE: boolean) => [
  {
    title: pick(isDE, "ClawGuru Security Summit 2026", "ClawGuru Security Summit 2026"),
    date: pick(isDE, "15.-17. Mai 2026", "May 15-17, 2026"),
    location: pick(isDE, "Berlin, Germany", "Berlin, Germany"),
    type: pick(isDE, "IRL", "IRL"),
    description: pick(isDE, "3 Tage Security-Hardening, AI-Agent Security und OpenClaw Best Practices. Keynotes, Workshops, Networking.", "3 days of security hardening, AI agent security and OpenClaw best practices. Keynotes, workshops, networking."),
    attendees: pick(isDE, "500+", "500+"),
    price: pick(isDE, "299€", "299€"),
    popular: true,
  },
  {
    title: pick(isDE, "Virtual Security Week 2026", "Virtual Security Week 2026"),
    date: pick(isDE, "20.-24. Juni 2026", "June 20-24, 2026"),
    location: pick(isDE, "Online", "Online"),
    type: pick(isDE, "Virtual", "Virtual"),
    description: pick(isDE, "5 Tage virtuelle Security-Workshops. Moltbot, OpenClaw, AI-Agent Security. Live-Demos und Q&A.", "5 days of virtual security workshops. Moltbot, OpenClaw, AI agent security. Live demos and Q&A."),
    attendees: pick(isDE, "1.000+", "1,000+"),
    price: pick(isDE, "Kostenlos", "Free"),
    popular: false,
  },
  {
    title: pick(isDE, "Moltbot Conference 2026", "Moltbot Conference 2026"),
    date: pick(isDE, "10.-12. September 2026", "September 10-12, 2026"),
    location: pick(isDE, "München, Germany", "Munich, Germany"),
    type: pick(isDE, "IRL", "IRL"),
    description: pick(isDE, "Fokus auf Moltbot und AI-Agent Security. Hands-on Labs, Community Meetups, Partner Exhibits.", "Focus on Moltbot and AI agent security. Hands-on labs, community meetups, partner exhibits."),
    attendees: pick(isDE, "300+", "300+"),
    price: pick(isDE, "199€", "199€"),
    popular: false,
  },
]

const getFeatures = (isDE: boolean) => [
  {
    icon: Calendar,
    title: pick(isDE, "Expert Keynotes", "Expert Keynotes"),
    description: pick(isDE, "Lerne von Security-Experten aus Enterprise und Startups.", "Learn from security experts from enterprise and startups."),
  },
  {
    icon: Users,
    title: pick(isDE, "Networking", "Networking"),
    description: pick(isDE, "Treffen Security-Professionals aus der ganzen Welt.", "Meet security professionals from around the world."),
  },
  {
    icon: Video,
    title: pick(isDE, "Live Demos", "Live Demos"),
    description: pick(isDE, "Echte Security-Hardening Demos in Echtzeit.", "Real security hardening demos in real time."),
  },
  {
    icon: Clock,
    title: pick(isDE, "Hands-on Workshops", "Hands-on Workshops"),
    description: pick(isDE, "Praktische Workshops mit echten Use Cases.", "Practical workshops with real use cases."),
  },
]

export default function EventsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const events = getEvents(isDE)
  const features = getFeatures(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Roast Events — IRL/Virtual Conferences", "Roast Events — IRL/Virtual Conferences")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Security-Conferences und Events. IRL und Virtual.", "Security conferences and events. IRL and virtual.")}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {pick(isDE, "→ Triff Security-Professionals weltweit.", "→ Meet security professionals worldwide.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Diese Events dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "These events are for hardening your own systems. No attack tools.")}
        </div>

        {/* Events */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Events", "Events")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className={`bg-gray-800 p-6 rounded-lg border ${
                  event.popular ? "border-cyan-500" : "border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-cyan-900 p-3 rounded-lg">
                    {event.type === "IRL" ? (
                      <MapPin className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <Video className="w-6 h-6 text-cyan-400" />
                    )}
                  </div>
                  <div className="bg-gray-900 px-2 py-1 rounded">
                    <span className="text-xs text-gray-400">{event.type}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-100 mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{event.location}</span>
                </div>
                <p className="text-sm text-gray-300 mb-4">{event.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{event.attendees}</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">{event.price}</div>
                </div>

                <button
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    event.popular
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  }`}
                >
                  {pick(isDE, "Jetzt anmelden", "Register Now")}
                </button>

                {event.popular && (
                  <div className="mt-3 bg-cyan-900 px-2 py-1 rounded inline-block">
                    <span className="text-xs text-cyan-300">{pick(isDE, "Beliebt", "Popular")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Warum teilnehmen?", "Why attend?")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-900 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cyan-400 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {pick(isDE, "Bereit für das nächste Event?", "Ready for the next event?")}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {pick(isDE, "Melde dich jetzt an und triff Security-Professionals weltweit.", "Register now and meet security professionals worldwide.")}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {pick(isDE, "Alle Events anzeigen", "View All Events")}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/community`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Community", "Community")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Forum/Discord", "Forum/Discord")}</div>
            </Link>
            <Link href={`/${locale}/partners`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Partners", "Partners")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Integration Marketplace", "Integration marketplace")}</div>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Consulting", "Consulting")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Professional Services", "Professional services")}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
