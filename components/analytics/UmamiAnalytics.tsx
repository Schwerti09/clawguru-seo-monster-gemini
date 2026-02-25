// WORLD BEAST FINAL LAUNCH: components/analytics/UmamiAnalytics.tsx
// Injects the Umami analytics script — privacy-first, no cookies by default.

export default function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL

  // WORLD BEAST FINAL LAUNCH: only render if both env vars are configured
  if (!websiteId || !scriptUrl) return null

  return (
    <script
      defer
      src={scriptUrl}
      data-website-id={websiteId}
    />
  )
}
