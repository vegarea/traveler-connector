import { z } from "zod";

export const buddyBossConfigSchema = z.object({
  sync_xprofile: z.boolean().default(true),
  sync_groups: z.boolean().default(true),
  sync_activity: z.boolean().default(true),
  sync_friends: z.boolean().default(true),
  sync_interval: z.number().min(5).default(15),
});

export type BuddyBossConfigFormValues = z.infer<typeof buddyBossConfigSchema>;