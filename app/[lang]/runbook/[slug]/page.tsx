import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"

export const dynamic = "force-static"
export const revalidate = 86400
export const dynamicParams = false // CRITICAL: Prevent 50k+ placeholder pages from being indexed
export const runtime = "nodejs"
export const maxDuration = 180
export const preferredRegion = "iad1"

export async function generateStaticParams() {
  const { RUNBOOKS } = await import("@/lib/pseo")
  const topSlugs = RUNBOOKS.slice(0, 200).map((r) => r.slug)
  const key100kSlugs = [
    "aws-ssh-hardening-2026",
    "aws-nginx-csp-2026",
    "aws-kubernetes-zero-trust-2026",
    "cloudflare-nginx-waf-2026",
    "hetzner-ssh-hardening-2026",
    "gcp-kubernetes-rbac-misconfig-2026",
    "azure-docker-hardening-2026",
    "digitalocean-nginx-rate-limiting-2026",
    "kubernetes-docker-supply-chain-attack-2026",
    "aws-github-actions-secrets-management-2026",
    "cloudflare-nginx-hsts-2026",
    "aws-kubernetes-sbom-2026",
    "hetzner-nginx-firewall-rules-2026",
    "gcp-docker-image-signing-2026",
    "azure-kubernetes-mfa-enforcement-2026",
  ]
  const slugs = Array.from(new Set([...topSlugs, ...key100kSlugs]))
  const allowed = (process.env.SITEMAP_100K_LOCALES ?? "de,en").split(",").map((s) => s.trim()).filter(Boolean)
  return allowed.flatMap((lang) => slugs.map((slug) => ({ lang, slug })))
}

export async function generateMetadata(props: {
  params: { lang: string; slug: string }
}): Promise<Metadata> {
  const { lang, slug } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/runbook/${slug}` },
  }
}

export default async function LocaleRunbookPage(props: {
  params: { lang: string; slug: string }
}) {
  const { lang, slug } = props.params
  const allowed = (process.env.SITEMAP_100K_LOCALES ?? "de,en").split(",").map((s) => s.trim()).filter(Boolean)
  if (!allowed.includes(lang)) return notFound()
  
  // PHASE 1 Fix #1: Graceful error handling for broken runbook generation
  try {
    const Mod = await import("@/app/runbook/[slug]/page")
    const RootRunbookPage = Mod.default
    return <RootRunbookPage params={{ slug }} />
  } catch (err) {
    console.error(`[sitemap-health] locale runbook generation failed for lang=${lang}, slug=${slug}:`, err instanceof Error ? err.message : String(err))
    return notFound()
  }
}

