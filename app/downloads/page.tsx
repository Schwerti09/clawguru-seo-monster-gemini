import { redirect } from "next/navigation"

export const dynamic = "force-static"

// The real localized page lives at /[lang]/downloads.
// Root /downloads → canonical German landing page.
export default function DownloadsRedirectPage() {
  redirect("/de/downloads")
}
