import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useWordPressConfig } from '@/components/wordpress/hooks/useWordPressConfig';
import { getJWTToken, validateJWTToken } from '@/components/admin/permissions/utils/wordpressApi';
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginFormValues } from '@/components/admin/forms/types';

const Login = () => {
  const { toast } = useToast();
  const { data: wpConfig, isLoading: isConfigLoading } = useWordPressConfig();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_login: "",
      user_password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!wpConfig?.wp_url || !wpConfig?.wp_username || !wpConfig?.wp_token) {
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
      console.log('Usuario intentando login:', values.user_login);
      
      // Usar credenciales del ADMIN para obtener el token JWT
      const response = await getJWTToken(
        wpConfig.wp_url,
        wpConfig.wp_username,  // Credencial del ADMIN
        wpConfig.wp_token,     // Credencial del ADMIN
        values.user_login,     // Usuario que intenta login
        values.user_password   // Contraseña del usuario
      );

      if (response.token) {
        console.log('Token JWT obtenido para usuario:', values.user_login);
        
        // Validar el token antes de redirigir
        const validationResponse = await validateJWTToken(wpConfig.wp_url, response.token);
        
        if (validationResponse.data?.status === 200) {
          console.log('Token JWT validado, redirigiendo al home de WordPress...');
          window.location.href = wpConfig.wp_url;
        } else {
          throw new Error('Token JWT inválido');
        }
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
                name="user_login"
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
                name="user_password"
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