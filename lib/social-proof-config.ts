/**
 * Social proof configuration for conversion optimization
 * Update these numbers periodically to reflect current metrics
 */

export const SOCIAL_PROOF_CONFIG = {
  // Number of security checks this month - update monthly
  monthlyChecks: 3847,
  
  // Trust signals for purchase CTAs
  trustSignals: {
    de: [
      "✅ 3.847 Checks diesen Monat",
      "✅ Sofortiger Zugriff nach Zahlung",
      "✅ Refund wenn nicht hilfreich",
    ],
    en: [
      "✅ 3,847 checks this month",
      "✅ Instant access after payment",
      "✅ Refund if not helpful",
    ],
  },
  
  // Pro personas for pricing page
  proPersonas: {
    de: [
      {
        title: "DevOps Engineers",
        description: "die täglich Security-Checks brauchen",
      },
      {
        title: "SaaS-Gründer",
        description: "die GDPR/NIS2 nachweisen müssen",
      },
      {
        title: "IT-Dienstleister",
        description: "die Kunden-Infrastruktur absichern",
      },
    ],
    en: [
      {
        title: "DevOps Engineers",
        description: "who need daily security checks",
      },
      {
        title: "SaaS Founders",
        description: "who must prove GDPR/NIS2 compliance",
      },
      {
        title: "IT Service Providers",
        description: "securing customer infrastructure",
      },
    ],
  },
} as const

export type SocialProofConfig = typeof SOCIAL_PROOF_CONFIG
