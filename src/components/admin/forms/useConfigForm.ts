import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { configSchema, ConfigFormValues } from './types';
import { useEffect, useState } from "react";
import { getJWTToken, validateJWTToken } from "../permissions/utils/wordpressApi";

export const useConfigForm = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      wp_url: "",
      wp_username: "",
      wp_token: "",
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
        form.reset({
          wp_url: config.wp_url,
          wp_username: config.wp_username,
          wp_token: config.wp_token,
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
      
      // Eliminar espacios en blanco del token
      const cleanToken = configToTest.wp_token.replace(/\s+/g, '');
      
      console.log('Iniciando prueba de conexión con WordPress usando JWT...');

      // Obtener token JWT
      const jwtResponse = await getJWTToken(
        configToTest.wp_url,
        configToTest.wp_username,
        cleanToken
      );

      // Validar el token JWT
      await validateJWTToken(configToTest.wp_url, jwtResponse.token);

      setIsConnected(true);
      
      toast({
        title: "Conexión exitosa",
        description: `Conectado como: ${jwtResponse.user_display_name}`,
      });

      return true;
    } catch (error) {
      console.error('Error testing WordPress connection:', error);
      setIsConnected(false);
      toast({
        title: "Error de conexión",
        description: error instanceof Error ? error.message : "Error al conectar con WordPress. Verifica las credenciales y que el plugin JWT Auth esté activo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const onSubmit = async (values: ConfigFormValues) => {
    try {
      // Eliminar espacios en blanco del token antes de guardar
      const cleanValues = {
        ...values,
        wp_token: values.wp_token.replace(/\s+/g, '')
      };
      
      // Primero probar la conexión
      const isConnected = await testConnection(cleanValues);
      
      if (!isConnected) {
        return;
      }

      const { error } = await supabase
        .from('wordpress_config')
        .upsert({
          wp_url: cleanValues.wp_url,
          wp_username: cleanValues.wp_username,
          wp_token: cleanValues.wp_token,
          sync_users: cleanValues.sync_users,
          sync_interval: cleanValues.sync_interval,
          auth_callback_url: cleanValues.auth_callback_url,
          app_url: cleanValues.app_url,
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
  };
};