const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export function buildCveOgImageUrl(cveId: string): string {
  const imgixBase = process.env.IMGIX_BASE_URL
  if (imgixBase) {
    const base = imgixBase.replace(/\/$/, "")
    const params = new URLSearchParams({
      txt: `CVE ${cveId}`,
      "txt-size": "64",
      "txt-color": "ffffff",
      "txt-align": "middle,center",
      "txt-font": "Inter Bold",
      "txt-pad": "80",
      "txt-fit": "max",
    })
    return `${base}/og/cve-template.png?${params.toString()}`
  }

  const cloudinary = process.env.CLOUDINARY_CLOUD_NAME
  if (cloudinary) {
    const template = process.env.CLOUDINARY_OG_TEMPLATE || "clawguru-og-template"
    const overlay = encodeURIComponent(`CVE ${cveId}`)
    return `https://res.cloudinary.com/${cloudinary}/image/upload/l_text:Arial_64_bold:${overlay},co_white,g_center/${template}.png`
  }

  return `${SITE_URL}/api/og/cve?cve=${encodeURIComponent(cveId)}`
}
