import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { configSchema, ConfigFormValues } from './types';

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

  const onSubmit = async (values: ConfigFormValues) => {
    try {
      const { error } = await supabase
        .from('wordpress_config')
        .insert({
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
  };
};