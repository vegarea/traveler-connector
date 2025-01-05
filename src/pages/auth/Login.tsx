import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useWordPressConfig } from '@/components/wordpress/hooks/useWordPressConfig';
import { getJWTToken } from '@/components/admin/permissions/utils/wordpressApi';
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const { data: wpConfig, isLoading: isConfigLoading } = useWordPressConfig();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!wpConfig?.wp_url) {
      toast({
        title: "Error de configuración",
        description: "No se encontró la configuración de WordPress",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      console.log('Iniciando proceso de login con JWT...');
      
      // Obtener token JWT
      const response = await getJWTToken(
        wpConfig.wp_url,
        values.username,
        values.password
      );

      if (response.token) {
        console.log('Token JWT obtenido, redirigiendo a WordPress...');
        
        // Redirigir a WordPress con el token en el header de Authorization
        const redirectUrl = `${wpConfig.wp_url}/wp-admin/admin-ajax.php`;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = redirectUrl;
        
        // Agregar el token como campo oculto
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'jwt_token';
        tokenInput.value = response.token;
        form.appendChild(tokenInput);
        
        // Agregar la acción de WordPress
        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'jwt_auth_login';
        form.appendChild(actionInput);
        
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast({
        title: "Error de autenticación",
        description: error instanceof Error ? error.message : "Error al intentar iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isConfigLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión en WordPress</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;