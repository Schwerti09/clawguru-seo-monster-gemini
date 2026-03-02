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
  const referralBase = 140
  const referralDecay = 2
  const referralModulo = 4
  const referralModuloDecay = 3
  const referralFloor = 6
  const payoutBase = 18500
  const payoutDecay = 260
  const payoutModulo = 5
  const payoutModuloDecay = 110
  const payoutFloor = 980

  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 11 + 7) % (adjectives.length * nouns.length)
    const adj = adjectives[seed % adjectives.length]
    const noun = nouns[Math.floor(seed / adjectives.length) % nouns.length]
    const referrals = Math.max(
      referralFloor,
      referralBase - i * referralDecay - (i % referralModulo) * referralModuloDecay
    )
    const payouts = Math.max(
      payoutFloor,
      Math.round(payoutBase - i * payoutDecay - (i % payoutModulo) * payoutModuloDecay)
    )
    return {
      rank: i + 1,
      handle: `${adj}${noun}${(i % 97) + 3}`,
      payouts,
      referrals,
      region: regions[i % regions.length],
    }
  })
}
