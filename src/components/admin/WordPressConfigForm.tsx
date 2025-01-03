import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const configSchema = z.object({
  wp_url: z.string().url("Please enter a valid URL"),
  wp_token: z.string().min(1, "API Key is required"),
  sync_users: z.boolean().default(false),
  sync_interval: z.number().min(5).default(15),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export const WordPressConfigForm = () => {
  const { toast } = useToast();
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      wp_url: "",
      wp_token: "",
      sync_users: false,
      sync_interval: 15,
    },
  });

  const onSubmit = async (data: ConfigFormValues) => {
    try {
      // Insertar directamente el objeto data, no dentro de un array
      const { error } = await supabase
        .from('wordpress_config')
        .insert(data);

      if (error) throw error;

      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados correctamente.",
      });
    } catch (error) {
      console.error('Error saving WordPress config:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexión con WordPress</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="wp_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de WordPress</FormLabel>
                  <FormControl>
                    <Input placeholder="https://tuwordpress.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wp_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="wp_xxxxx..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sync_users"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Sincronización automática de usuarios</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sync_interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo de sincronización (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="5"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Guardar configuración
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};