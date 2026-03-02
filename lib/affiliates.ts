export type AffiliateEntry = {
  rank: number
  handle: string
  payouts: number
  referrals: number
  region: string
}

export function generateAffiliateLeaderboard(count = 60): AffiliateEntry[] {
  const adjectives = [
    "Silent", "Neon", "Iron", "Quantum", "Stealth", "Crimson", "Cyber",
    "Ghost", "Solar", "Binary", "Zero", "Root", "Lunar", "Arctic",
  ]
  const nouns = [
    "Wolf", "Falcon", "Tiger", "Raven", "Viper", "Lynx", "Jaguar",
    "Hawk", "Fox", "Cobra", "Panther", "Orca", "Puma", "Eagle",
  ]
  const regions = ["EU", "US", "APAC", "LATAM", "MEA"]

  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 11 + 7) % (adjectives.length * nouns.length)
    const adj = adjectives[seed % adjectives.length]
    const noun = nouns[Math.floor(seed / adjectives.length) % nouns.length]
    const referrals = Math.max(6, 140 - i * 2 - (i % 4) * 3)
    const payouts = Math.max(980, Math.round(18500 - i * 260 - (i % 5) * 110))
    return {
      rank: i + 1,
      handle: `${adj}${noun}${(i % 97) + 3}`,
      payouts,
      referrals,
      region: regions[i % regions.length],
    }
  })
}
