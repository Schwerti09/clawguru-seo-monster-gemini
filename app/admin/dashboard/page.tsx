// File: app/admin/dashboard/page.tsx
// Admin Management Cockpit – high-performance admin dashboard.
// Shows: Revenue, SEO Index Tracker, Affiliate Performance, System Sentinel & Kill-Switch.

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import ManagementCockpit from "@/components/admin/ManagementCockpit"

export const runtime = "nodejs"

export const metadata = {
  title: "Management Cockpit | ClawGuru Admin",
  description: "Admin Management Cockpit: Revenue, SEO Index, Affiliates, System Sentinel.",
  robots: "noindex, nofollow",
}

export default function AdminDashboardPage() {
  const token = cookies().get(adminCookieName())?.value ?? ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) redirect("/admin")

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Admin"
          title="Management Cockpit"
          subtitle="Revenue · SEO-Index · Affiliate-Performance · System-Sentinel & Kill-Switch"
        />
        <div className="mt-10">
          <ManagementCockpit />
        </div>
      </div>
    </Container>
  )
}
