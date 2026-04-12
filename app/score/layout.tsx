import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security Score | ClawGuru",
  description: "Dein ClawGuru Security Score: Echtzeit-Bewertung deiner Infrastruktursicherheit. Teile deinen Score und vergleiche mit anderen.",
}

export default function ScoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
