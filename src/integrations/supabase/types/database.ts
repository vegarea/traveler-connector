export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

import { UserRolesTable, UsersTable, WordPressConfigTable } from './tables';

export interface Database {
  public: {
    Tables: {
      sync_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          source: string
          status: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          source?: string
          status?: string
        }
        Relationships: []
      }
      user_meta: {
        Row: {
          id: string
          meta_key: string
          meta_value: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          meta_key: string
          meta_value?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          meta_key?: string
          meta_value?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: UserRolesTable
      users: UsersTable
      wordpress_config: WordPressConfigTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}