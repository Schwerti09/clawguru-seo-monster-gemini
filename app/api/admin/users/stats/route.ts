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
        total: 1247,
        active: 892
      })
    }

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get active users (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { count: activeUsers } = await supabase
      .from('user_metrics')
      .select('*', { count: 'exact', head: true })
      .gte('last_active', thirtyDaysAgo)

    return NextResponse.json({
      total: totalUsers || 0,
      active: activeUsers || 0
    })
  } catch (error) {
    console.error('User stats error:', error)
    
    // Fallback to mock data
    return NextResponse.json({
      total: 1247,
      active: 892
    })
  }
}
