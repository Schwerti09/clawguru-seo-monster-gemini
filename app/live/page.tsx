import { cookies } from "next/headers"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import OpsWall from "@/components/live/OpsWall"
import LoginSaveBanner from "@/components/shared/LoginSaveBanner"
import { SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

export const metadata = {
  title: "Live Ops Wall | ClawGuru",
  description:
    "Live-Signale (synthetisch) + Trends aus der Runbook-Library. Für schnelle Entscheidungen: Incident → Fix → Verify.",
  alternates: { canonical: "/live" }
}

export default async function LivePage() {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get("cg_locale")?.value
  const locale: Locale = SUPPORTED_LOCALES.includes(localeCookie as Locale) ? (localeCookie as Locale) : "de"

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="LIVE"
          title={t(locale, "liveTitle")}
          subtitle={t(locale, "liveSubtitle")}
        />
        <div className="mt-10">
          <LoginSaveBanner />
          <OpsWall />
        </div>
      </div>
    </Container>
  )
}
