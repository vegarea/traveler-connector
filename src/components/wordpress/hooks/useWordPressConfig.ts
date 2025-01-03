import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWordPressConfig = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      console.log('Fetching WordPress config...');
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching WordPress config:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No WordPress configuration found');
      }

      console.log('WordPress config fetched:', data[0]);
      return data[0];
    },
    retry: 1,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración de WordPress",
          variant: "destructive",
        });
      }
    }
  });
};