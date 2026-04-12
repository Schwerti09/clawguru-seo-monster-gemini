import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vault – Secrets & Security Management | ClawGuru",
  description: "Zentrales Secrets Management, Key Rotation, Firewall Baseline und Security Score für deine Infrastruktur. GDPR-konform, audit-ready.",
}

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
