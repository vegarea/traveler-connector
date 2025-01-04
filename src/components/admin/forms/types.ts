import { z } from "zod";

export const configSchema = z.object({
  wp_url: z.string().url("Por favor ingresa una URL válida"),
  wp_username: z.string().min(1, "El nombre de usuario es requerido"),
  wp_token: z.string().min(1, "La API Key es requerida"),
  sync_users: z.boolean().default(false),
  sync_interval: z.number().min(5).default(15),
  auth_callback_url: z.string().url("Por favor ingresa una URL válida").default('https://preview--traveler-connector.lovable.app/auth/wordpress/callback'),
  app_url: z.string().url("Por favor ingresa una URL válida").default('https://preview--traveler-connector.lovable.app'),
});

export type ConfigFormValues = z.infer<typeof configSchema>;