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
          user_email: 'user1@example.com',
          tier: 'pro',
          amount: 49.00,
          status: 'completed',
          created_at: '2024-03-29T10:30:00Z'
        },
        {
          id: '2',
          user_email: 'user2@example.com',
          tier: 'enterprise',
          amount: 199.00,
          status: 'completed',
          created_at: '2024-03-29T09:15:00Z'
        },
        {
          id: '3',
          user_email: 'user3@example.com',
          tier: 'daypass',
          amount: 9.00,
          status: 'pending',
          created_at: '2024-03-29T08:45:00Z'
        }
      ])
    }

    // Get recent transactions
    const { data: transactions, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        status,
        created_at,
        user_id,
        users!inner(email),
        subscriptions!inner(tier)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Revenue fetch error:', error)
      throw error
    }

    // Transform data
    const transformedTransactions = transactions?.map(transaction => ({
      id: transaction.id,
      user_email: transaction.users.email,
      tier: transaction.subscriptions.tier,
      amount: transaction.amount,
      status: transaction.status,
      created_at: transaction.created_at
    })) || []

    return NextResponse.json(transformedTransactions)
  } catch (error) {
    console.error('Revenue API error:', error)
    
    // Fallback to mock data
    return NextResponse.json([
      {
        id: '1',
        user_email: 'user1@example.com',
        tier: 'pro',
        amount: 49.00,
        status: 'completed',
        created_at: '2024-03-29T10:30:00Z'
      },
      {
        id: '2',
        user_email: 'user2@example.com',
        tier: 'enterprise',
        amount: 199.00,
        status: 'completed',
        created_at: '2024-03-29T09:15:00Z'
      },
      {
        id: '3',
        user_email: 'user3@example.com',
        tier: 'daypass',
        amount: 9.00,
        status: 'pending',
        created_at: '2024-03-29T08:45:00Z'
      }
    ])
  }
}
