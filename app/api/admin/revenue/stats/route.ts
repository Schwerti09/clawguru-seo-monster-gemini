import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get Supabase client
    const getSupabaseClient = () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return null
      }
      const { createClient } = require('@supabase/supabase-js')
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    }

    const supabase = getSupabaseClient()
    
    if (!supabase) {
      // Fallback mock data for development
      return NextResponse.json({
        today: 342.50,
        month: 12480.00
      })
    }

    // Get revenue today
    const today = new Date().toISOString().split('T')[0]
    const { data: todayRevenue } = await supabase
      .from('payments')
      .select('amount')
      .gte('created_at', today)
      .eq('status', 'completed')

    const revenueToday = todayRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0

    // Get revenue this month
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: monthRevenue } = await supabase
      .from('payments')
      .select('amount')
      .gte('created_at', thirtyDaysAgo)
      .eq('status', 'completed')

    const revenueMonth = monthRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0

    return NextResponse.json({
      today: revenueToday,
      month: revenueMonth
    })
  } catch (error) {
    console.error('Revenue stats error:', error)
    
    // Fallback to mock data
    return NextResponse.json({
      today: 342.50,
      month: 12480.00
    })
  }
}
