import { BuddyBossConfigTable } from './buddyboss';
import { Json } from './json';
import { 
  SyncLogsTable, 
  UserMetaTable, 
  UserRolesTable, 
  UsersTable, 
  WordPressConfigTable 
} from './tables';

export interface Database {
  public: {
    Tables: {
      sync_logs: SyncLogsTable;
      user_meta: UserMetaTable;
      user_roles: UserRolesTable;
      users: UsersTable;
      wordpress_config: WordPressConfigTable;
      buddypress_config: BuddyBossConfigTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}