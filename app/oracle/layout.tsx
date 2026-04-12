import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Oracle – AI Threat Intelligence | ClawGuru",
  description: "KI-gestützte Bedrohungsanalyse über 1M+ Runbooks. Stell deine Security-Frage, erhalte sofort eine präzise Antwort mit Runbook-Referenzen.",
}

export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
