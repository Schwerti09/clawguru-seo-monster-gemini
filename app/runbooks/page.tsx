import RunbooksPageContent from "@/components/pages/RunbooksPageContent"
import { SEO_TARGET_KEYWORDS_2026 } from "@/lib/seo/targets"

export const dynamic = "force-static"

export const metadata = {
  title: "Runbooks | ClawGuru",
  description:
    "Runbooks für OpenClaw/Moltbot Ops: Security, Setup, Fixes, Incident Response. Score → Runbook → Fix → Re-Check.",
  keywords: SEO_TARGET_KEYWORDS_2026,
  alternates: { canonical: "/runbooks" }
}

export default function RunbooksPage() {
  return <RunbooksPageContent />
}
