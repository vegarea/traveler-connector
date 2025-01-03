import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { buddyBossConfigSchema, BuddyBossConfigFormValues } from './types';
import { useEffect } from "react";

export const useBuddyBossConfigForm = () => {
  const { toast } = useToast();
  
  const form = useForm<BuddyBossConfigFormValues>({
    resolver: zodResolver(buddyBossConfigSchema),
    defaultValues: {
      sync_xprofile: true,
      sync_groups: true,
      sync_activity: true,
      sync_friends: true,
      sync_interval: 15,
    },
  });

  // Cargar configuración existente al montar el componente
  useEffect(() => {
    const loadConfig = async () => {
      const { data, error } = await supabase
        .from('buddypress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error loading BuddyBoss config:', error);
        return;
      }

      if (data) {
        form.reset({
          sync_xprofile: data.sync_xprofile_fields,
          sync_groups: data.sync_groups,
          sync_activity: data.sync_activity,
          sync_friends: data.sync_friends,
          sync_interval: data.sync_interval,
        });
      }
    };

    loadConfig();
  }, [form]);

  const testConnection = async () => {
    try {
      const wpConfig = await supabase
        .from('wordpress_config')
        .select('wp_url')
        .single();

      if (!wpConfig.data?.wp_url) {
        throw new Error('No se ha configurado la URL de WordPress');
      }

      const response = await fetch(`${wpConfig.data.wp_url}/wp-json/buddyboss/v1/members`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo conectar con la API de BuddyBoss');
      }

      toast({
        title: "Conexión exitosa",
        description: "Se ha conectado correctamente con BuddyBoss",
      });

      return true;
    } catch (error) {
      console.error('Error testing BuddyBoss connection:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con BuddyBoss. Verifica la configuración de WordPress.",
        variant: "destructive",
      });
      return false;
    }
  };

  const onSubmit = async (values: BuddyBossConfigFormValues) => {
    try {
      const { error } = await supabase
        .from('buddypress_config')
        .upsert({
          sync_xprofile_fields: values.sync_xprofile,
          sync_groups: values.sync_groups,
          sync_activity: values.sync_activity,
          sync_friends: values.sync_friends,
          sync_interval: values.sync_interval,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados correctamente.",
      });
    } catch (error) {
      console.error('Error saving BuddyBoss config:', error);
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
    testConnection,
  };
};