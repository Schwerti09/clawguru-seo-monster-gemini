import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const health = {
      // CPU: not reliably measurable in a single serverless invocation (no time interval baseline)
      cpu: 0,
      memory: getMemoryUsage(),
      // Storage: requires OS-level disk access unavailable in serverless environments
      storage: 0,
      // Uptime in seconds, capped at 100 for progress-bar display (100 = stable, running > 100s)
      uptime: Math.min(100, Math.round(process.uptime()))
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error('System health error:', error)
    return NextResponse.json({ error: 'Failed to retrieve system health' }, { status: 500 })
  }
}

function getMemoryUsage(): number {
  const memUsage = process.memoryUsage()
  return Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
}
