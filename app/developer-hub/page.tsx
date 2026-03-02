import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import DeveloperHub from "@/components/marketing/DeveloperHub"

export const metadata: Metadata = {
  title: "Developer Hub | ClawGuru Security API",
  description:
    "Integrate the ClawGuru Security API in minutes. Quick Start guide, copy-paste code snippets for Python, JavaScript, Go & cURL, error handling reference, and a live test mode — no registration required.",
  alternates: { canonical: "/developer-hub" },
}

export default function DeveloperHubPage() {
  return (
    <Container>
      <DeveloperHub />
    </Container>
  )
}
