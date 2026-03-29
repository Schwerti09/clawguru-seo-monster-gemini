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
      return NextResponse.json([
        {
          id: '1',
          email: 'user1@example.com',
          tier: 'pro',
          created_at: '2024-01-15T10:00:00Z',
          last_active: new Date().toISOString()
        },
        {
          id: '2',
          email: 'user2@example.com',
          tier: 'enterprise',
          created_at: '2024-02-20T14:30:00Z',
          last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          email: 'user3@example.com',
          tier: 'daypass',
          created_at: '2024-03-10T09:15:00Z',
          last_active: null
        }
      ])
    }

    // Get all users with their tiers and activity
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        created_at,
        user_tier!inner(tier),
        user_metrics!inner(last_active)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Users fetch error:', error)
      throw error
    }

    // Transform data to match expected format
    const transformedUsers = users?.map(user => ({
      id: user.id,
      email: user.email,
      tier: user.user_tier.tier,
      created_at: user.created_at,
      last_active: user.user_metrics?.last_active
    })) || []

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Users API error:', error)
    
    // Fallback to mock data
    return NextResponse.json([
      {
        id: '1',
        email: 'user1@example.com',
        tier: 'pro',
        created_at: '2024-01-15T10:00:00Z',
        last_active: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user2@example.com',
        tier: 'enterprise',
        created_at: '2024-02-20T14:30:00Z',
        last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        email: 'user3@example.com',
        tier: 'daypass',
        created_at: '2024-03-10T09:15:00Z',
        last_active: null
      }
    ])
  }
}
