// app/admin/dashboard/page.tsx
// ClawGuru Universe – interactive admin cockpit.

import Container from "@/components/shared/Container"
import UniverseDashboard from "@/components/admin/UniverseDashboard"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export const runtime = "nodejs"

export const metadata = {
  title: "ClawGuru Universe | Admin",
  description: "Interaktives Admin-Cockpit – SEO, Revenue, Affiliate, Health & Kill-Switch.",
}

export default async function UniverseDashboardPage() {
  const token = cookies().get(adminCookieName())?.value || ""
  const session = token ? await verifyAdminToken(token) : null
  if (!session) redirect("/admin")

  return (
    <Container>
      <div className="py-10 max-w-6xl mx-auto">
        <UniverseDashboard />
      </div>
    </Container>
  )
}
