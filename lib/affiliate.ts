/**
 * Affiliate system – core utilities
 *
 * Cookie-based tracking → Stripe metadata → invoice.paid commission calc.
 * No external database required: Stripe Customer/Subscription metadata is the
 * source of truth for affiliate-to-customer associations.
 */

export const AFFILIATE_COOKIE = "cg_aff"
/** 60 days in seconds */
export const AFFILIATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 60

/** Stripe metadata key where we store the affiliate code on a customer */
export const META_AFF_CODE = "aff_code"
/** Stripe metadata key where we store the referring affiliate's Stripe Connect account ID */
export const META_AFF_CONNECT_ID = "aff_connect_id"
/** Metadata key stored on each transfer/commission record */
export const META_AFF_HOLD_UNTIL = "aff_hold_until"

/** Commission rates */
export const COMMISSION = {
  /** 30% one-time commission on Day Pass */
  daypass: 0.30,
  /** 20% lifetime recurring commission on Pro/Team subscriptions */
  recurring: 0.20,
} as const

/**
 * Validate an affiliate code.
 * Allowed: 3–30 alphanumeric characters plus hyphens and underscores.
 */
export function isValidAffCode(code: unknown): code is string {
  if (typeof code !== "string") return false
  return /^[a-zA-Z0-9_-]{3,30}$/.test(code)
}

/**
 * Calculate the commission amount (in cents) for a given payment.
 *
 * @param amountPaid  – Amount paid in cents (e.g. Stripe `invoice.amount_paid`)
 * @param productType – "daypass" | "recurring"
 */
export function calcCommission(amountPaid: number, productType: "daypass" | "recurring"): number {
  const rate = productType === "daypass" ? COMMISSION.daypass : COMMISSION.recurring
  return Math.floor(amountPaid * rate)
}

/**
 * Return the Unix timestamp (seconds) after which a commission may be paid out.
 * Default: 30 days from now (to cover Stripe's refund / chargeback window).
 */
export function holdUntilTimestamp(holdDays = 30): number {
  return Math.floor(Date.now() / 1000) + holdDays * 24 * 60 * 60
}
