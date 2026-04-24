import { notFound } from "next/navigation"
import type { Locale } from "@/lib/i18n"
import { TRACKS } from "@/lib/academy/hubContent"
import { TrackShowcase } from "./TrackShowcase"

interface Props {
  locale: Locale
  slug: string
}

// Thin wrapper for not-yet-shipped tracks. Delegates all rendering to
// TrackShowcase with showWaitlist=true so the EmailCapture sits near the top.
export function TrackComingSoon({ locale, slug }: Props) {
  const track = TRACKS.find((t) => t.slug === slug)
  if (!track) notFound()
  return <TrackShowcase locale={locale} track={track} showWaitlist />
}
