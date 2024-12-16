export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'manager' | 'user'
          group_id: string | null
          location_id: string | null
          organization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          role?: 'admin' | 'manager' | 'user'
          group_id?: string | null
          location_id?: string | null
          organization_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'manager' | 'user'
          group_id?: string | null
          location_id?: string | null
          organization_id?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: Json
          created_at: string
          organization_id: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details: Json
          created_at?: string
          organization_id: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Json
          organization_id?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          organization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          organization_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          organization_id?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string | null
          organization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          organization_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          organization_id?: string
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
  }
}