import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { configSchema, ConfigFormValues } from './types';
import { useEffect } from "react";

export const useConfigForm = () => {
  const { toast } = useToast();
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      wp_url: "",
      wp_username: "",
      wp_token: "",
      sync_users: false,
      sync_interval: 15,
      auth_callback_url: 'https://preview--traveler-connector.lovable.app/auth/wordpress/callback',
      app_url: 'https://preview--traveler-connector.lovable.app',
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
          auth_callback_url: config.auth_callback_url || 'https://preview--traveler-connector.lovable.app/auth/wordpress/callback',
          app_url: config.app_url || 'https://preview--traveler-connector.lovable.app',
        });
      }
    };

    loadConfig();
  }, [form]);

  const testConnection = async (values: ConfigFormValues) => {
    try {
      // Eliminar espacios en blanco del token
      const cleanToken = values.wp_token.replace(/\s+/g, '');
      
      // First try to get the nonce
      const baseResponse = await fetch(`${values.wp_url}/wp-json`);
      if (!baseResponse.ok) {
        throw new Error('No se pudo conectar con WordPress');
      }

      // Then try to authenticate with username:password
      const response = await fetch(`${values.wp_url}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Basic ${btoa(`${values.wp_username}:${cleanToken}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error de conexión con WordPress');
      }

      const data = await response.json();
      
      toast({
        title: "Conexión exitosa",
        description: `Conectado como: ${data.name}`,
      });

      return true;
    } catch (error) {
      console.error('Error testing WordPress connection:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con WordPress. Verifica el usuario y el token de aplicación.",
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
  };
};