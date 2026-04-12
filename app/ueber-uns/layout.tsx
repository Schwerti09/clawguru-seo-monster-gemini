import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Über uns | ClawGuru",
  description: "Das Team hinter ClawGuru: Security-Engineers, DevOps-Experten und Open-Source-Enthusiasten die Security-Runbooks für die echte Welt bauen.",
}

export default function UeberUnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
