import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hosting-Kosten Vergleich 2026 | ClawGuru",
  description: "Hetzner, DigitalOcean, Contabo, AWS, GCP – Hosting-Kostenvergleich für Self-Hosting. Finde den günstigsten Anbieter für deine Infrastruktur.",
}

export default function HostingKostenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
