import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TestUserFormValues } from "./types";

export const useWordPressUser = () => {
  const { data: wpConfig } = useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0];
    }
  });

  const createWordPressUser = async (values: TestUserFormValues) => {
    if (!wpConfig?.wp_url || !wpConfig?.wp_username || !wpConfig?.wp_api_token) {
      throw new Error('WordPress configuration is missing');
    }

    try {
      console.log('Creando usuario en WordPress usando API token...');
      
      const response = await fetch(`${wpConfig.wp_url}/wp-json/wp/v2/users`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Basic ${btoa(`${wpConfig.wp_username}:${wpConfig.wp_api_token}`)}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          roles: ['subscriber'],
        }),
      });

      const responseText = await response.text();
      console.log('Respuesta de WordPress:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Error creating WordPress user');
        } catch (e) {
          throw new Error(`Error creating WordPress user: ${responseText}`);
        }
      }

      const userData = JSON.parse(responseText);
      console.log('Usuario creado en WordPress:', userData);
      return userData;
    } catch (error) {
      console.error('Error detallado:', error);
      throw error;
    }
  };

  return { createWordPressUser, wpConfig };
};