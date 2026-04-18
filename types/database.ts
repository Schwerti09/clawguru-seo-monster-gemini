// Database type definitions for Neon Postgres
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_metrics: {
        Row: {
          id: string
          user_id: string
          claw_score: number
          last_active: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          claw_score?: number
          last_active?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          claw_score?: number
          last_active?: string
          created_at?: string
          updated_at?: string
        }
      }
      threats: {
        Row: {
          id: string
          title: string
          description: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          status: 'active' | 'resolved'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'active' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'active' | 'resolved'
          created_at?: string
          updated_at?: string
        }
      }
      runbook_executions: {
        Row: {
          id: string
          user_id: string
          runbook_id: string
          status: 'pending' | 'running' | 'completed' | 'failed'
          started_at: string
          completed_at?: string
          result?: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          runbook_id: string
          status?: 'pending' | 'running' | 'completed' | 'failed'
          started_at?: string
          completed_at?: string
          result?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          runbook_id?: string
          status?: 'pending' | 'running' | 'completed' | 'failed'
          started_at?: string
          completed_at?: string
          result?: any
          created_at?: string
          updated_at?: string
        }
      }
      mycelium_nodes: {
        Row: {
          id: string
          type: 'threat' | 'runbook' | 'oracle' | 'neuro'
          status: 'active' | 'inactive'
          connections: string[]
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'threat' | 'runbook' | 'oracle' | 'neuro'
          status?: 'active' | 'inactive'
          connections?: string[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'threat' | 'runbook' | 'oracle' | 'neuro'
          status?: 'active' | 'inactive'
          connections?: string[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'explorer' | 'daypass' | 'pro' | 'enterprise'
          status: 'active' | 'canceled'
          stripe_subscription_id?: string
          expires_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: 'explorer' | 'daypass' | 'pro' | 'enterprise'
          status?: 'active' | 'canceled'
          stripe_subscription_id?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'explorer' | 'daypass' | 'pro' | 'enterprise'
          status?: 'active' | 'canceled'
          stripe_subscription_id?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed'
          stripe_payment_intent_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed'
          stripe_payment_intent_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed'
          stripe_payment_intent_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      roast_results: {
        Row: {
          id: string
          user_id: string | null
          stack_summary: string
          score: number
          roast_level: 'mild' | 'medium' | 'spicy'
          weaknesses: string[]
          fixes: string[]
          roast_text: string
          top_roasts: string[]
          locale: string
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          stack_summary: string
          score: number
          roast_level: 'mild' | 'medium' | 'spicy'
          weaknesses: string[]
          fixes: string[]
          roast_text: string
          top_roasts: string[]
          locale: string
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          stack_summary?: string
          score?: number
          roast_level?: 'mild' | 'medium' | 'spicy'
          weaknesses?: string[]
          fixes?: string[]
          roast_text?: string
          top_roasts?: string[]
          locale?: string
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
