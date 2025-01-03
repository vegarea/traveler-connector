export interface BuddyBossConfigTable {
  Row: {
    id: string;
    sync_xprofile_fields: boolean | null;
    sync_groups: boolean | null;
    sync_activity: boolean | null;
    sync_friends: boolean | null;
    sync_interval: number | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    sync_xprofile_fields?: boolean | null;
    sync_groups?: boolean | null;
    sync_activity?: boolean | null;
    sync_friends?: boolean | null;
    sync_interval?: number | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    sync_xprofile_fields?: boolean | null;
    sync_groups?: boolean | null;
    sync_activity?: boolean | null;
    sync_friends?: boolean | null;
    sync_interval?: number | null;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [];
}