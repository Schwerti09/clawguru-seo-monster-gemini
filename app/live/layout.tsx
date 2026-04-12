import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Live Ops Cockpit | ClawGuru",
  description: "Echtzeit-Überwachung deiner Systeme und Bedrohungslandschaft. Live Security Events, aktive Runbooks und Threat-Feeds auf einen Blick.",
}

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
