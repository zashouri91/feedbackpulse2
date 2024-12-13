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
    }
  }
}