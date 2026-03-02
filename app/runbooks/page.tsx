import RunbooksPageContent from "@/components/pages/RunbooksPageContent"

export const dynamic = "force-static"

export const metadata = {
  title: "Runbooks | ClawGuru",
  description:
    "Runbooks für OpenClaw/Moltbot Ops: Security, Setup, Fixes, Incident Response. Score → Runbook → Fix → Re-Check.",
  alternates: { canonical: "/runbooks" }
}

export default function RunbooksPage() {
  return <RunbooksPageContent />
}
