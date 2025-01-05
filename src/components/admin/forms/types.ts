import { z } from "zod";

export const configSchema = z.object({
  wp_url: z.string().url("Por favor ingresa una URL válida"),
  wp_username: z.string().min(1, "El nombre de usuario es requerido"),
  wp_token: z.string().min(1, "La contraseña es requerida"),
});

export type ConfigFormValues = z.infer<typeof configSchema>;