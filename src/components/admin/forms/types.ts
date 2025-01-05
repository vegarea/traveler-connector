import { z } from "zod";

export const configSchema = z.object({
  wp_url: z.string().url("Por favor ingresa una URL válida"),
  wp_username: z.string().min(1, "El nombre de usuario es requerido"),
  wp_token: z.string().min(1, "La contraseña es requerida"),
  wp_api_token: z.string().optional(),
  sync_users: z.boolean().optional().default(false),
  sync_interval: z.number().optional().default(15),
  auth_callback_url: z.string().optional(),
  app_url: z.string().optional(),
});

export type ConfigFormValues = z.infer<typeof configSchema>;