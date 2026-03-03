import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import OutreachDashboard from "@/components/admin/OutreachDashboard"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export const runtime = "nodejs"

export const metadata = {
  title: "Outreach Invasion | ClawGuru",
  description: "Influencer-Bribe Templates, Global-Language Scripts und Affiliate Tracking.",
  robots: "noindex, nofollow",
}

export default async function OutreachDashboardPage() {
  const token = (await cookies()).get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) redirect("/admin")

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Influencer-Bribe"
          title="Outreach Invasion"
          subtitle="Templates, Links und Conversion-Tracker für das globale Partnernetz."
        />
        <div className="mt-10">
          <OutreachDashboard />
        </div>
      </div>
    </Container>
  )
}
