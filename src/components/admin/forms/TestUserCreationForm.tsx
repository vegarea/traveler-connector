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

export const TestUserCreationForm = () => {
  const { toast } = useToast();
  const { createWordPressUser } = useWordPressUser();
  const { createLocalUser } = useLocalUser();

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