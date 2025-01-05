import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWordPressConfig = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      console.log('Iniciando búsqueda de configuración de WordPress...');
      
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error al obtener configuración de WordPress:', error);
        throw error;
      }

      console.log('Respuesta de Supabase:', { data, error });

      if (!data || data.length === 0) {
        console.error('No se encontró ninguna configuración de WordPress en la base de datos');
        throw new Error('No se encontró configuración de WordPress');
      }

      console.log('Configuración de WordPress encontrada:', data[0]);
      return data[0];
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Error en useWordPressConfig:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración de WordPress. ¿Has configurado WordPress en el panel de administración?",
          variant: "destructive",
        });
      }
    }
  });
};