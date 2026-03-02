// app/admin/manual/page.tsx
// The 'Universal-Manual' – Bento-Grid overview of every ClawGuru technical module.
// A new developer should understand the 100k-page machine in under 2 minutes.

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import Container from "@/components/shared/Container"
import UniverseManual from "@/components/admin/UniverseManual"

export const runtime = "nodejs"

export const metadata = {
  title: "Universe Manual | ClawGuru Admin",
  description: "Das Handbuch des ClawGuru-Universums – alle technischen Module auf einen Blick.",
}

export default function UniverseManualPage() {
  const token = cookies().get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) redirect("/admin")

  return (
    <Container>
      <div className="py-10 max-w-6xl mx-auto">
        <UniverseManual />
      </div>
    </Container>
  )
}
