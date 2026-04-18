/**
 * Industry Benchmarks for Roast Comparison
 * Compare user scores against industry averages
 */

export interface Benchmark {
  industry: string
  avgScore: number
  top10Score: number
  bottom10Score: number
  sampleSize: number
}

// Industry benchmark data (mock data based on realistic security postures)
export const industryBenchmarks: Benchmark[] = [
  { industry: "Fintech", avgScore: 68, top10Score: 91, bottom10Score: 34, sampleSize: 1247 },
  { industry: "HealthTech", avgScore: 62, top10Score: 88, bottom10Score: 28, sampleSize: 892 },
  { industry: "SaaS", avgScore: 58, top10Score: 85, bottom10Score: 31, sampleSize: 3421 },
  { industry: "E-Commerce", avgScore: 52, top10Score: 79, bottom10Score: 24, sampleSize: 2156 },
  { industry: "AI/ML", avgScore: 49, top10Score: 82, bottom10Score: 22, sampleSize: 1567 },
  { industry: "Gaming", avgScore: 45, top10Score: 76, bottom10Score: 19, sampleSize: 983 },
  { industry: "Media", avgScore: 42, top10Score: 74, bottom10Score: 18, sampleSize: 654 },
  { industry: "Crypto/Web3", avgScore: 71, top10Score: 94, bottom10Score: 38, sampleSize: 1876 },
]

export function getBenchmarkForIndustry(industry: string): Benchmark | undefined {
  return industryBenchmarks.find(b => 
    b.industry.toLowerCase() === industry.toLowerCase()
  )
}

export function getBenchmarkComparison(userScore: number, industry: string): {
  percentile: number
  aboveAverage: boolean
  message: string
} {
  const benchmark = getBenchmarkForIndustry(industry)
  
  if (!benchmark) {
    // Generic comparison across all industries
    const allAvg = industryBenchmarks.reduce((sum, b) => sum + b.avgScore, 0) / industryBenchmarks.length
    const aboveAvg = userScore > allAvg
    return {
      percentile: aboveAvg ? 65 : 35,
      aboveAverage: aboveAvg,
      message: aboveAvg 
        ? `Your score is ${userScore - Math.round(allAvg)} points above cross-industry average`
        : `Your score is ${Math.round(allAvg) - userScore} points below cross-industry average`,
    }
  }

  // Calculate percentile based on score distribution
  let percentile = 50
  if (userScore >= benchmark.top10Score) {
    percentile = 95
  } else if (userScore >= benchmark.avgScore + 10) {
    percentile = 80
  } else if (userScore >= benchmark.avgScore) {
    percentile = 65
  } else if (userScore >= benchmark.avgScore - 10) {
    percentile = 35
  } else if (userScore >= benchmark.bottom10Score) {
    percentile = 15
  } else {
    percentile = 5
  }

  const aboveAverage = userScore > benchmark.avgScore
  const diff = Math.abs(userScore - benchmark.avgScore)

  return {
    percentile,
    aboveAverage,
    message: aboveAverage
      ? `Top ${100 - percentile}% in ${industry} — ${diff} points above average`
      : `Bottom ${percentile}% in ${industry} — ${diff} points below average`,
  }
}

export function getAllBenchmarks(): Benchmark[] {
  return industryBenchmarks
}

export function getBestPerformingIndustry(): Benchmark {
  return industryBenchmarks.reduce((best, current) => 
    current.avgScore > best.avgScore ? current : best
  )
}

export function getWorstPerformingIndustry(): Benchmark {
  return industryBenchmarks.reduce((worst, current) => 
    current.avgScore < worst.avgScore ? current : worst
  )
}
