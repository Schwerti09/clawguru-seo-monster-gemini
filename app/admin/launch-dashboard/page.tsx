// File: app/admin/launch-dashboard/page.tsx
// 1M LIVE LAUNCH v2.0 – Overlord AI: Live launch dashboard (admin-only).
// Shows: runbooks generated, Quality Gate pass-rate, sitemap size, next 50k batch.

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import LaunchDashboard from "@/components/admin/LaunchDashboard"

export const runtime = "nodejs"

export const metadata = {
  title: "1M Live Launch Dashboard | ClawGuru",
  description: "Live stats for the ClawGuru 1M Runbook Launch – Quality Gate 2.0.",
  robots: "noindex, nofollow",
}

export default function LaunchDashboardPage() {
  const token = cookies().get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) redirect("/admin")

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="1M Live Launch"
          title="Launch Dashboard"
          subtitle="Live stats: Runbooks generated · Quality Gate 2.0 pass-rate · Sitemap size · Next batch"
        />
        <div className="mt-10">
          <LaunchDashboard />
        </div>
      </div>
    </Container>
  )
}
