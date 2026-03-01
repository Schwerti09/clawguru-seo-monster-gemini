// app/admin/profit-dashboard/page.tsx
// Executive Profit & API Analytics Dashboard – admin-only page.

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import ProfitDashboard from "@/components/admin/ProfitDashboard"

export const runtime = "nodejs"

export const metadata = {
  title: "Profit & API Analytics | ClawGuru Admin",
  description: "Executive dashboard: MRR, API usage, Wall of Shame, Conversion Funnel.",
  robots: "noindex, nofollow"
}

export default function ProfitDashboardPage() {
  const token = cookies().get(adminCookieName())?.value ?? ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) redirect("/admin")

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Executive"
          title="Profit & API Analytics"
          subtitle="MRR · Net Revenue · API Margins · Wall of Shame · Conversion Funnel"
        />
        <div className="mt-10">
          <ProfitDashboard />
        </div>
      </div>
    </Container>
  )
}
