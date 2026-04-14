import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stack MRI | ClawGuru Predictive Security Cortex",
  description: "Scan your tech stack for vulnerabilities, CVEs, and security issues. Live threat intelligence, automated runbook recommendations, and voice control.",
}

export default function NeuroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
