import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TestUserFormValues } from "./types";

export const useWordPressUser = () => {
  const { data: wpConfig, isLoading: isConfigLoading } = useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      console.log('Obteniendo configuración de WordPress...');
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error al obtener configuración:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.error('No hay configuración de WordPress');
        throw new Error('No hay configuración de WordPress guardada');
      }

      console.log('Configuración obtenida:', data[0]);
      return data[0];
    }
  });

  const createWordPressUser = async (values: TestUserFormValues) => {
    if (isConfigLoading) {
      throw new Error('Cargando configuración de WordPress...');
    }

    if (!wpConfig?.wp_url || !wpConfig?.wp_username || !wpConfig?.wp_api_token) {
      console.error('Configuración faltante:', wpConfig);
      throw new Error('Configuración de WordPress incompleta. Asegúrate de haber guardado la URL, usuario y Application Password.');
    }

    try {
      console.log('Creando usuario en WordPress usando API token...');
      console.log('URL:', wpConfig.wp_url);
      console.log('Usuario admin:', wpConfig.wp_username);
      
      const response = await fetch(`${wpConfig.wp_url}/wp-json/wp/v2/users`, {
        method: 'POST',
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
          throw new Error(errorData.message || 'Error al crear usuario en WordPress');
        } catch (e) {
          throw new Error(`Error al crear usuario en WordPress: ${responseText}`);
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

  return { createWordPressUser, wpConfig, isConfigLoading };
};