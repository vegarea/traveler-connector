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
      wp_token: "",
      sync_users: false,
      sync_interval: 15,
    },
  });

  // Cargar configuración existente
  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading WordPress config:', error);
        return;
      }

      if (data) {
        form.reset({
          wp_url: data.wp_url,
          wp_token: data.wp_token,
          sync_users: data.sync_users || false,
          sync_interval: data.sync_interval || 15,
        });
      }
    };

    loadConfig();
  }, [form]);

  const testConnection = async (values: ConfigFormValues) => {
    try {
      const response = await fetch(`${values.wp_url}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Bearer ${values.wp_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error de conexión con WordPress');
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
        description: "No se pudo conectar con WordPress. Verifica la URL y el token.",
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
          wp_token: values.wp_token,
          sync_users: values.sync_users,
          sync_interval: values.sync_interval,
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