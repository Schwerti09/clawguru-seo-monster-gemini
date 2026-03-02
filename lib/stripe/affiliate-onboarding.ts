import { stripe } from "@/lib/stripe"

export type AffiliateOnboardingInput = {
  affiliateId?: string
  accountId?: string
  email?: string
  country?: string
  refreshUrl?: string
  returnUrl?: string
}

export type AffiliateOnboardingResult = {
  accountId: string
  url: string
  expiresAt: number
}

const DEFAULT_COUNTRY = (process.env.AFFILIATE_DEFAULT_COUNTRY || "DE").toUpperCase()

function normalizeCountry(country?: string) {
  const value = (country || "").trim().toUpperCase()
  return value.length === 2 ? value : DEFAULT_COUNTRY
}

function parseAffiliateAccounts(): Record<string, string> {
  const raw = process.env.AFFILIATE_CONNECT_ACCOUNTS || "{}"
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

function resolveAccountId(affiliateId?: string, accountId?: string) {
  if (accountId) return accountId
  if (!affiliateId) return null
  const accounts = parseAffiliateAccounts()
  return accounts[affiliateId] ?? null
}

export async function createAffiliateAccountLink(
  input: AffiliateOnboardingInput
): Promise<AffiliateOnboardingResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY missing")
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const refreshUrl = input.refreshUrl || `${base}/dashboard?onboarding=refresh`
  const returnUrl = input.returnUrl || `${base}/dashboard?onboarding=return`

  let accountId = resolveAccountId(input.affiliateId, input.accountId)

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "standard",
      email: input.email,
      country: normalizeCountry(input.country),
      metadata: input.affiliateId ? { affiliate_id: input.affiliateId } : undefined,
    })
    accountId = account.id
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  })

  return { accountId, url: accountLink.url, expiresAt: accountLink.expires_at }
}
