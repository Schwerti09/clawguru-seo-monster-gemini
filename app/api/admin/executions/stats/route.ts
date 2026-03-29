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
        total: 15678
      })
    }

    // Get total executions count
    const { count: totalExecutions } = await supabase
      .from('runbook_executions')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      total: totalExecutions || 0
    })
  } catch (error) {
    console.error('Executions stats error:', error)
    
    // Fallback to mock data
    return NextResponse.json({
      total: 15678
    })
  }
}
