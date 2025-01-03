import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useWordPressConfig = () => {
  return useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      console.log('Obteniendo configuración de WordPress desde Supabase...');
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error al cargar la configuración de WordPress:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No hay configuración de WordPress');
        throw new Error('WordPress no está configurado');
      }

      console.log('Configuración de WordPress cargada:', data[0]);
      return data[0];
    }
  });
};