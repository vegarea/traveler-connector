import { z } from "zod";

export const configSchema = z.object({
  wp_url: z.string().url("Por favor ingresa una URL válida"),
  wp_token: z.string().min(1, "La API Key es requerida"),
  sync_users: z.boolean().default(false),
  sync_interval: z.number().min(5).default(15),
});

export type ConfigFormValues = z.infer<typeof configSchema>;