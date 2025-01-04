export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      buddypress_config: {
        Row: {
          created_at: string
          id: string
          sync_activity: boolean | null
          sync_friends: boolean | null
          sync_groups: boolean | null
          sync_interval: number | null
          sync_xprofile_fields: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          sync_activity?: boolean | null
          sync_friends?: boolean | null
          sync_groups?: boolean | null
          sync_interval?: number | null
          sync_xprofile_fields?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          sync_activity?: boolean | null
          sync_friends?: boolean | null
          sync_groups?: boolean | null
          sync_interval?: number | null
          sync_xprofile_fields?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      profile_components: {
        Row: {
          component_key: string
          component_name: string
          created_at: string
          description: string | null
          enabled: boolean | null
          id: string
          updated_at: string
        }
        Insert: {
          component_key: string
          component_name: string
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          id?: string
          updated_at?: string
        }
        Update: {
          component_key?: string
          component_name?: string
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_type_components: {
        Row: {
          component_id: string | null
          created_at: string
          enabled: boolean | null
          id: string
          profile_type: Database["public"]["Enums"]["profile_type"]
          updated_at: string
        }
        Insert: {
          component_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          profile_type: Database["public"]["Enums"]["profile_type"]
          updated_at?: string
        }
        Update: {
          component_id?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          profile_type?: Database["public"]["Enums"]["profile_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_type_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "profile_components"
            referencedColumns: ["id"]
          },
        ]
      }
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
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          cover_url: string | null
          created_at: string
          email: string
          id: string
          updated_at: string
          username: string
          wordpress_user_id: number
        }
        Insert: {
          avatar_url?: string | null
          cover_url?: string | null
          created_at?: string
          email: string
          id?: string
          updated_at?: string
          username: string
          wordpress_user_id: number
        }
        Update: {
          avatar_url?: string | null
          cover_url?: string | null
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          username?: string
          wordpress_user_id?: number
        }
        Relationships: []
      }
      wordpress_config: {
        Row: {
          created_at: string
          id: string
          sync_interval: number | null
          sync_users: boolean | null
          updated_at: string
          wp_token: string
          wp_url: string
          wp_username: string
        }
        Insert: {
          created_at?: string
          id?: string
          sync_interval?: number | null
          sync_users?: boolean | null
          updated_at?: string
          wp_token: string
          wp_url: string
          wp_username: string
        }
        Update: {
          created_at?: string
          id?: string
          sync_interval?: number | null
          sync_users?: boolean | null
          updated_at?: string
          wp_token?: string
          wp_url?: string
          wp_username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
      profile_type: "traveler" | "premium" | "agency" | "expert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
