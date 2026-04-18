import { SOCIAL_PROOF_CONFIG } from "@/lib/social-proof-config"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

interface SocialProofBlockProps {
  locale?: Locale
}

export default function SocialProofBlock({ locale = DEFAULT_LOCALE }: SocialProofBlockProps) {
  // Fallback to German for non-DE/EN locales, or use 'de' as default
  const trustSignals = SOCIAL_PROOF_CONFIG.trustSignals[locale as keyof typeof SOCIAL_PROOF_CONFIG.trustSignals] 
    || SOCIAL_PROOF_CONFIG.trustSignals.de

  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
      {trustSignals.map((signal: string, index: number) => (
        <div key={index} className="text-sm text-gray-300">
          {signal}
        </div>
      ))}
    </div>
  )
}
