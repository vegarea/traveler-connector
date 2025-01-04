import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const testUserSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type TestUserFormValues = z.infer<typeof testUserSchema>;

export const TestUserCreationForm = () => {
  const { toast } = useToast();

  // Obtener la configuración de WordPress
  const { data: wpConfig } = useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0];
    }
  });

  const form = useForm<TestUserFormValues>({
    resolver: zodResolver(testUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const createWordPressUser = async (values: TestUserFormValues) => {
    if (!wpConfig?.wp_url || !wpConfig?.wp_username || !wpConfig?.wp_token) {
      throw new Error('WordPress configuration is missing');
    }

    try {
      console.log('Creando usuario en WordPress...');
      const response = await fetch(`${wpConfig.wp_url}/wp-json/wp/v2/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${wpConfig.wp_username}:${wpConfig.wp_token}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          roles: ['subscriber'],
        }),
      });

      const responseText = await response.text();
      console.log('Respuesta de WordPress:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Error creating WordPress user');
        } catch (e) {
          throw new Error(`Error creating WordPress user: ${responseText}`);
        }
      }

      const userData = JSON.parse(responseText);
      console.log('Usuario creado en WordPress:', userData);
      return userData;
    } catch (error) {
      console.error('Error detallado:', error);
      throw error;
    }
  };

  const createLocalUser = async (values: TestUserFormValues, wpUserId: number) => {
    console.log('Creando usuario local...');
    const { error } = await supabase
      .from('users')
      .insert({
        wordpress_user_id: wpUserId,
        username: values.username,
        email: values.email,
        account_status: 'active',
        email_verified: false,
      });

    if (error) {
      console.error('Error Supabase:', error);
      throw error;
    }
  };

  const onSubmit = async (values: TestUserFormValues) => {
    try {
      // 1. Crear usuario en WordPress
      const wpUser = await createWordPressUser(values);
      console.log('Usuario WordPress creado:', wpUser);

      // 2. Crear usuario en nuestra base de datos
      await createLocalUser(values, wpUser.id);

      toast({
        title: "Usuario creado exitosamente",
        description: `Usuario creado en WordPress (ID: ${wpUser.id}) y en la base de datos local`,
      });

      form.reset();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error al crear usuario",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Prueba de Creación de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Crear Usuario
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};