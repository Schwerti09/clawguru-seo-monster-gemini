import type { Metadata } from "next"
import AffiliateLeaderboard from "@/components/affiliates/AffiliateLeaderboard"

export const metadata: Metadata = {
  title: "Affiliate War-Room | ClawGuru",
  description: "Die Top-Partner im Affiliate-Programm – anonymisiert, aber mit realen Auszahlungen.",
  alternates: { canonical: "/affiliates/top" },
}

export const runtime = "edge"
export const revalidate = 60 * 60

export default function AffiliateTopPage() {
  return <AffiliateLeaderboard locale="de" />
}
