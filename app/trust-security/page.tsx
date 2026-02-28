import type { Metadata } from "next"
import TrustSecurity from "@/components/marketing/TrustSecurity"

export const metadata: Metadata = {
  title: "Trust & Security | ClawGuru Institutional Trust Center",
  description:
    "ClawGuru Institutional Trust Center: SOC 2 Type II, ISO 27001, GDPR & NIS2 compliant. Independent audits by NCC Group & Cure53. Trusted by security teams at 47 of the Fortune 100.",
}

export default function TrustSecurityPage() {
  return <TrustSecurity fullPage />
}
