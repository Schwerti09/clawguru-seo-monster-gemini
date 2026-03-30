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
          runbook_name: 'SSH Hardening 2026',
          user_email: 'user1@example.com',
          status: 'completed',
          duration: '2m 34s',
          success_rate: 95,
          output: 'SSH configuration updated successfully',
          created_at: '2024-03-29T10:30:00Z'
        },
        {
          id: '2',
          runbook_name: 'Docker Security Scan',
          user_email: 'user2@example.com',
          status: 'running',
          duration: null,
          success_rate: 0,
          output: 'Scanning Docker containers...',
          created_at: '2024-03-29T09:15:00Z'
        },
        {
          id: '3',
          runbook_name: 'Nginx CSP Configuration',
          user_email: 'user3@example.com',
          status: 'failed',
          duration: '1m 12s',
          success_rate: 45,
          output: 'Failed to apply CSP headers',
          created_at: '2024-03-29T08:45:00Z'
        }
      ])
    }

    // Get recent executions with user and runbook details
    const { data: executions, error } = await supabase
      .from('runbook_executions')
      .select(`
        id,
        status,
        duration,
        success_rate,
        output,
        created_at,
        user_id,
        users!inner(email),
        runbooks!inner(name)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Executions fetch error:', error)
      throw error
    }

    // Transform data
    const transformedExecutions = executions?.map((execution: any) => ({
      id: execution.id,
      runbook_name: execution.runbooks.name,
      user_email: execution.users.email,
      status: execution.status,
      duration: execution.duration,
      success_rate: execution.success_rate,
      output: execution.output,
      created_at: execution.created_at
    })) || []

    return NextResponse.json(transformedExecutions)
  } catch (error) {
    console.error('Executions API error:', error)
    
    // Fallback to mock data
    return NextResponse.json([
      {
        id: '1',
        runbook_name: 'SSH Hardening 2026',
        user_email: 'user1@example.com',
        status: 'completed',
        duration: '2m 34s',
        success_rate: 95,
        output: 'SSH configuration updated successfully',
        created_at: '2024-03-29T10:30:00Z'
      },
      {
        id: '2',
        runbook_name: 'Docker Security Scan',
        user_email: 'user2@example.com',
        status: 'running',
        duration: null,
        success_rate: 0,
        output: 'Scanning Docker containers...',
        created_at: '2024-03-29T09:15:00Z'
      },
      {
        id: '3',
        runbook_name: 'Nginx CSP Configuration',
        user_email: 'user3@example.com',
        status: 'failed',
        duration: '1m 12s',
        success_rate: 45,
        output: 'Failed to apply CSP headers',
        created_at: '2024-03-29T08:45:00Z'
      }
    ])
  }
}
