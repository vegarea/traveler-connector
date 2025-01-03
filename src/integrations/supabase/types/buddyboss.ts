export interface BuddyBossConfigTable {
  Row: {
    id: string;
    sync_xprofile_fields: boolean;
    sync_groups: boolean;
    sync_activity: boolean;
    sync_friends: boolean;
    sync_interval: number;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    sync_xprofile_fields?: boolean;
    sync_groups?: boolean;
    sync_activity?: boolean;
    sync_friends?: boolean;
    sync_interval?: number;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    sync_xprofile_fields?: boolean;
    sync_groups?: boolean;
    sync_activity?: boolean;
    sync_friends?: boolean;
    sync_interval?: number;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [];
}