import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { testUserSchema, TestUserFormValues } from './wordpress/types';
import { useWordPressUser } from './wordpress/useWordPressUser';
import { useLocalUser } from './wordpress/useLocalUser';
import { useWordPressConfig } from '@/components/wordpress/hooks/useWordPressConfig';
import { getJWTToken } from '@/components/admin/permissions/utils/wordpressApi';
import { Loader2 } from "lucide-react";

export const TestUserCreationForm = () => {
  const { toast } = useToast();
  const { createWordPressUser } = useWordPressUser();
  const { createLocalUser } = useLocalUser();
  const { data: wpConfig } = useWordPressConfig();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<TestUserFormValues>({
    resolver: zodResolver(testUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: TestUserFormValues) => {
    try {
      setIsLoading(true);
      
      // 1. Crear usuario en WordPress
      const wpUser = await createWordPressUser(values);
      console.log('Usuario WordPress creado:', wpUser);

      // 2. Crear usuario en nuestra base de datos
      await createLocalUser(values, wpUser.id);

      // 3. Obtener token JWT
      if (wpConfig?.wp_url) {
        const jwtResponse = await getJWTToken(
          wpConfig.wp_url,
          values.username,
          values.password
        );

        if (jwtResponse.token) {
          toast({
            title: "Usuario creado exitosamente",
            description: `Usuario ${values.username} creado correctamente`,
          });
          
          // Guardar token y redirigir a WordPress home
          localStorage.setItem('wp_token', jwtResponse.token);
          window.location.href = wpConfig.wp_url;
          return;
        }
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registro de Usuario</CardTitle>
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

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando usuario...
                </>
              ) : (
                'Crear Usuario'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};