import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import OpsWall from "@/components/live/OpsWall"
import LoginSaveBanner from "@/components/shared/LoginSaveBanner"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"

export const runtime = "nodejs"
export const revalidate = 60
export const maxDuration = 180

export const metadata = {
  title: "Live Ops Wall | ClawGuru",
  description:
    "Live-Signale (synthetisch) + Trends aus der Runbook-Library. Für schnelle Entscheidungen: Incident → Fix → Verify.",
  alternates: { canonical: "/live" }
}

export default async function LivePage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="LIVE"
          title={dict.live.title}
          subtitle={dict.live.subtitle}
        />
        <div className="mt-10">
          <LoginSaveBanner />
          <OpsWall />
        </div>
        <div className="mt-10">
          <MyceliumShareCard
            locale={locale}
            title="Live Ops Wall · ClawGuru"
            pageUrl={`${prefix}/live`}
            className="max-w-2xl"
          />
        </div>
      </div>
    </Container>
  )
}
