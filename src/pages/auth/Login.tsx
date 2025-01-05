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
  const { data: wpConfig, isLoading: isConfigLoading, error: configError } = useWordPressConfig();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log('Iniciando proceso de login...');
    console.log('Valores del formulario:', { username: values.username, password: '***' });
    
    if (!wpConfig?.wp_url) {
      console.error('No se encontró la configuración de WordPress:', wpConfig);
      toast({
        title: "Error de configuración",
        description: "No se encontró la configuración de WordPress. Por favor, configura WordPress en el panel de administración.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      console.log('Intentando obtener token JWT de WordPress...');
      console.log('URL de WordPress:', wpConfig.wp_url);
      
      const response = await getJWTToken(
        wpConfig.wp_url,
        values.username,
        values.password
      );

      console.log('Respuesta del token JWT:', response);

      if (response.token) {
        console.log('Token JWT obtenido exitosamente');
        // Guardar el token para futuras peticiones a la API
        localStorage.setItem('wp_token', response.token);
        
        console.log('Preparando formulario para login en WordPress...');
        // Redirigir a WordPress con el token
        const wpLoginUrl = `${wpConfig.wp_url}/wp-login.php`;
        console.log('URL de login de WordPress:', wpLoginUrl);
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = wpLoginUrl;
        form.style.display = 'none';

        // Agregar los campos necesarios
        const usernameInput = document.createElement('input');
        usernameInput.type = 'hidden';
        usernameInput.name = 'log';
        usernameInput.value = values.username;
        form.appendChild(usernameInput);

        const passwordInput = document.createElement('input');
        passwordInput.type = 'hidden';
        passwordInput.name = 'pwd';
        passwordInput.value = values.password;
        form.appendChild(passwordInput);

        const redirectInput = document.createElement('input');
        redirectInput.type = 'hidden';
        redirectInput.name = 'redirect_to';
        redirectInput.value = wpConfig.wp_url; // Cambiado para redirigir al home en lugar de wp-admin
        form.appendChild(redirectInput);

        console.log('Formulario preparado, enviando...');
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error('Error detallado en login:', error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        console.error('Stack trace:', error.stack);
      }
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