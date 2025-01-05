import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { configSchema, ConfigFormValues } from './types';
import { useEffect, useState } from "react";
import { getJWTTokenWithAdminCredentials, validateJWTToken } from "../permissions/utils/wordpressApi";

interface ConnectionInfo {
  user_display_name: string;
  user_email: string;
  user_nicename: string;
}

export const useConfigForm = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      wp_url: "",
      wp_username: "",
      wp_token: "",
      wp_api_token: "",
      sync_users: false,
      sync_interval: 15,
      auth_callback_url: window.location.origin + '/auth/wordpress/callback',
      app_url: window.location.origin,
    },
  });

  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading WordPress config:', error);
        return;
      }

      if (data && data.length > 0) {
        const config = data[0];
        console.log('Configuración de WordPress cargada:', {
          ...config,
          wp_token: '[REDACTED]',
          wp_api_token: '[REDACTED]'
        });
        
        form.reset({
          wp_url: config.wp_url,
          wp_username: config.wp_username,
          wp_token: config.wp_token,
          wp_api_token: config.wp_api_token || "",
          sync_users: config.sync_users || false,
          sync_interval: config.sync_interval || 15,
          auth_callback_url: config.auth_callback_url || window.location.origin + '/auth/wordpress/callback',
          app_url: config.app_url || window.location.origin,
        });
        
        // Test connection when config is loaded
        testConnection(config);
      }
    };

    loadConfig();
  }, [form]);

  const testConnection = async (values?: ConfigFormValues) => {
    try {
      const configToTest = values || form.getValues();
      
      console.log('Iniciando prueba de conexión con WordPress usando JWT...');
      console.log('URL:', configToTest.wp_url);
      console.log('Usuario:', configToTest.wp_username);
      console.log('Usando contraseña normal para JWT (no contraseña de aplicación)');

      const jwtResponse = await getJWTTokenWithAdminCredentials(
        configToTest.wp_url,
        configToTest.wp_username,
        configToTest.wp_token
      );

      console.log('Token JWT obtenido exitosamente');

      // Validar el token JWT
      await validateJWTToken(configToTest.wp_url, jwtResponse.token);

      setIsConnected(true);
      setConnectionInfo({
        user_display_name: jwtResponse.user_display_name,
        user_email: jwtResponse.user_email,
        user_nicename: jwtResponse.user_nicename
      });
      
      toast({
        title: "Conexión JWT exitosa",
        description: `Conectado como: ${jwtResponse.user_display_name}`,
      });

      return true;
    } catch (error) {
      console.error('Error testing WordPress connection:', error);
      setIsConnected(false);
      setConnectionInfo(null);
      toast({
        title: "Error de conexión",
        description: error instanceof Error ? error.message : "Error al conectar con WordPress. Verifica las credenciales.",
        variant: "destructive",
      });
      return false;
    }
  };

  const onSubmit = async (values: ConfigFormValues) => {
    try {
      // Primero probar la conexión
      const isConnected = await testConnection(values);
      
      if (!isConnected) {
        return;
      }

      const { error } = await supabase
        .from('wordpress_config')
        .upsert({
          wp_url: values.wp_url,
          wp_username: values.wp_username,
          wp_token: values.wp_token,
          wp_api_token: values.wp_api_token,
          sync_users: values.sync_users,
          sync_interval: values.sync_interval,
          auth_callback_url: values.auth_callback_url,
          app_url: values.app_url,
        });

      if (error) {
        console.error('Error saving WordPress config:', error);
        throw error;
      }

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

  return {
    form,
    onSubmit,
    testConnection: () => testConnection(form.getValues()),
    isConnected,
    connectionInfo,
  };
};