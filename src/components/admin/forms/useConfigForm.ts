import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { configSchema, ConfigFormValues } from './types';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useConfigForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      wp_url: "",
      wp_username: "",
      wp_token: "",
      sync_users: false,
      sync_interval: 15,
    },
  });

  // Cargar configuración existente usando React Query
  const { data: config } = useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading WordPress config:', error);
        return null;
      }

      return data;
    },
  });

  // Actualizar el formulario cuando se cargan los datos
  React.useEffect(() => {
    if (config) {
      form.reset({
        wp_url: config.wp_url,
        wp_username: config.wp_username,
        wp_token: config.wp_token,
        sync_users: config.sync_users || false,
        sync_interval: config.sync_interval || 15,
      });
    }
  }, [config, form]);

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

  // Usar React Query mutation para guardar la configuración
  const mutation = useMutation({
    mutationFn: async (values: ConfigFormValues) => {
      const cleanValues = {
        ...values,
        wp_token: values.wp_token.replace(/\s+/g, '')
      };
      
      const { error } = await supabase
        .from('wordpress_config')
        .upsert({
          wp_url: cleanValues.wp_url,
          wp_username: cleanValues.wp_username,
          wp_token: cleanValues.wp_token,
          sync_users: cleanValues.sync_users,
          sync_interval: cleanValues.sync_interval,
        });

      if (error) throw error;
      return cleanValues;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress-config'] });
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error saving WordPress config:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (values: ConfigFormValues) => {
    // Primero probar la conexión
    const isConnected = await testConnection(values);
    
    if (!isConnected) {
      return;
    }

    // Si la conexión es exitosa, guardar la configuración
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    testConnection: () => testConnection(form.getValues()),
  };
};