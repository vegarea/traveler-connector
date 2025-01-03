import { Json } from './database';

export interface UserRolesTable {
  Row: {
    created_at: string
    id: string
    role: "admin" | "user"
    user_id: string
  }
  Insert: {
    created_at?: string
    id?: string
    role?: "admin" | "user"
    user_id: string
  }
  Update: {
    created_at?: string
    id?: string
    role?: "admin" | "user"
    user_id?: string
  }
  Relationships: []
}

export interface UsersTable {
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

export interface WordPressConfigTable {
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