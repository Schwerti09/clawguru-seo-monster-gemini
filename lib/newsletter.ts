import Stripe from "stripe"
import { stripe } from "@/lib/stripe"

export type SubscriberInfo = {
  subscriptionId: string
  customerId: string
  email: string
  name: string
  status: Stripe.Subscription.Status
  planName: string
  currentPeriodEnd: number
}

/**
 * Fetches all Stripe subscribers with the given status, paginating through
 * all pages and expanding the customer object on each subscription.
 *
 * @param status - Stripe subscription status filter (e.g. "active", "canceled")
 * @returns Array of subscriber info objects
 */
export async function getSubscribers(
  status: Stripe.Subscription.Status | "all" = "active"
): Promise<SubscriberInfo[]> {
  const subscribers: SubscriberInfo[] = []
  let hasMore = true
  let startingAfter: string | undefined = undefined

  while (hasMore) {
    const page: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({
      limit: 100,
      status,
      expand: ["data.customer"],
      ...(startingAfter ? { starting_after: startingAfter } : {})
    })

    for (const sub of page.data) {
      const customer = sub.customer as Stripe.Customer | Stripe.DeletedCustomer
      if (customer.deleted) continue

      const activeCustomer = customer as Stripe.Customer
      if (!activeCustomer.email) continue
      const email = activeCustomer.email

      const subscriptionItem = sub.items?.data?.[0]
      const planName = subscriptionItem?.price?.nickname || subscriptionItem?.price?.id || "unknown"

      subscribers.push({
        subscriptionId: sub.id,
        customerId: activeCustomer.id,
        email,
        name: activeCustomer.name ?? "",
        status: sub.status,
        planName,
        currentPeriodEnd: sub.current_period_end
      })
    }

    hasMore = page.has_more
    if (page.data.length > 0) {
      startingAfter = page.data[page.data.length - 1].id
    } else {
      hasMore = false
    }
  }

  return subscribers
}

/**
 * Returns email addresses of all active and trialing subscribers.
 */
export async function getNewsletterRecipients(): Promise<string[]> {
  const [active, trialing] = await Promise.all([
    getSubscribers("active"),
    getSubscribers("trialing")
  ])

  const seen = new Set<string>()
  const emails: string[] = []

  for (const sub of [...active, ...trialing]) {
    if (!seen.has(sub.email)) {
      seen.add(sub.email)
      emails.push(sub.email)
    }
  }

  return emails
}
