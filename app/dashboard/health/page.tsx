// FULL PASSIVE WELTMACHT: app/dashboard/health/page.tsx
// Health dashboard: shows site health + activates Full Passive Mode.
// "ACTIVATE FULL PASSIVE MODE" button only visible for Pro/Team subscribers.

import { getAccess } from "@/lib/access"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import PassiveModePanel from "./PassiveModePanel"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function Paywall() {
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto text-center">
        <SectionTitle
          kicker="Full Passive Mode"
          title="Pro oder Team nötig"
          subtitle="Upgrade auf Pro oder Team, um den Full Passive Mode zu aktivieren."
        />
        <a
          href="/pricing"
          className="mt-8 inline-flex px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
        >
          Jetzt upgraden →
        </a>
      </div>
    </Container>
  )
}

export default async function DashboardHealthPage() {
  const access = await getAccess()

  // FULL PASSIVE WELTMACHT: Day Pass can view health but cannot activate passive mode
  const canActivate = access.ok && (access.plan === "pro" || access.plan === "team")

  if (!access.ok) return <Paywall />

  return (
    <Container>
      <div className="py-16 max-w-5xl mx-auto">
        <SectionTitle
          kicker="Full Passive Mode"
          title="ClawGuru läuft von allein"
          subtitle="Aktiviere den vollautomatischen Modus – ClawGuru heilt sich selbst, generiert Runbooks und du kassierst."
        />

        {/* FULL PASSIVE WELTMACHT: interactive panel with client-side state */}
        <PassiveModePanel canActivate={canActivate} plan={access.plan ?? "daypass"} />

        {/* Back link */}
        <div className="mt-8">
          <a
            href="/dashboard"
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            ← Zurück zum Dashboard
          </a>
        </div>
      </div>
    </Container>
  )
}
