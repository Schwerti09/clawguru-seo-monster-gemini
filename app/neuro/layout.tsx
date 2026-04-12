import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Neuro – Pattern Analysis & Anomaly Detection | ClawGuru",
  description: "Mustererkennung und Anomalie-Detection für Security-Events. Neuro analysiert Logs, Metriken und Verhaltensabweichungen in Echtzeit.",
}

export default function NeuroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
