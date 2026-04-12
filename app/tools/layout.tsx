import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security Tools | ClawGuru",
  description: "Kostenlose Security-Tools: Config-Analyzer, Log-Parser, RBAC-Checker und mehr. Sofort nutzbar, kein Account erforderlich.",
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
