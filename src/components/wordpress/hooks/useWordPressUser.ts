import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const useWordPressUser = (wpConfig: any) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['wordpress-user', wpConfig?.wp_url],
    queryFn: async () => {
      if (!wpConfig?.wp_url || !wpConfig?.wp_token || !wpConfig?.wp_username) {
        throw new Error('WordPress configuration is incomplete');
      }

      console.log('Fetching WordPress user data...');
      const response = await fetch(`${wpConfig.wp_url}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Basic ${btoa(`${wpConfig.wp_username}:${wpConfig.wp_token}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WordPress API Error:', errorText);
        throw new Error('Failed to fetch WordPress user data');
      }

      const userData = await response.json();
      console.log('WordPress user data fetched:', userData);
      return userData;
    },
    enabled: !!wpConfig?.wp_url && !!wpConfig?.wp_token && !!wpConfig?.wp_username,
    retry: 1,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario de WordPress",
          variant: "destructive",
        });
      }
    }
  });
};