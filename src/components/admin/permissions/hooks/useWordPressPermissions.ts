import { useQuery } from '@tanstack/react-query';
import { checkEndpoint, fetchUserStructure } from '../utils/wordpressApi';
import { useWordPressConfig } from './useWordPressConfig';

interface Permission {
  endpoint: string;
  description: string;
  required: boolean;
}

const REQUIRED_PERMISSIONS: Permission[] = [
  {
    endpoint: "/wp/v2/users",
    description: "Lectura de usuarios",
    required: true,
  },
  {
    endpoint: "/wp/v2/users/me",
    description: "Información del usuario actual",
    required: true,
  },
  {
    endpoint: "/wp/v2/posts",
    description: "Lectura de publicaciones",
    required: false,
  }
];

export const useWordPressPermissions = () => {
  const { data: wpConfig, error: configError } = useWordPressConfig();

  const { data: permissions, isLoading: permissionsLoading, refetch } = useQuery({
    queryKey: ['wordpress-permissions', wpConfig],
    queryFn: async () => {
      if (!wpConfig?.wp_url || !wpConfig?.wp_token || !wpConfig?.wp_username) {
        console.error('Configuración de WordPress incompleta:', { 
          hasUrl: !!wpConfig?.wp_url, 
          hasToken: !!wpConfig?.wp_token,
          hasUsername: !!wpConfig?.wp_username
        });
        throw new Error('WordPress no está configurado');
      }

      console.log('Iniciando verificación de permisos con URL:', wpConfig.wp_url);

      const results = await Promise.all(
        REQUIRED_PERMISSIONS.map(async (permission) => ({
          ...permission,
          isAvailable: await checkEndpoint(
            permission.endpoint,
            wpConfig.wp_url,
            wpConfig.wp_username,
            wpConfig.wp_token
          )
        }))
      );

      console.log('Resultados de verificación de permisos:', results);
      return results;
    },
    enabled: !!wpConfig?.wp_url && !!wpConfig?.wp_token && !!wpConfig?.wp_username,
    retry: false
  });

  const { data: userStructure, isLoading: userStructureLoading } = useQuery({
    queryKey: ['wordpress-user-structure', wpConfig],
    queryFn: async () => {
      if (!wpConfig?.wp_url || !wpConfig?.wp_token || !wpConfig?.wp_username) {
        console.error('Configuración incompleta para estructura de usuario');
        throw new Error('WordPress no está configurado');
      }

      return fetchUserStructure(
        wpConfig.wp_url,
        wpConfig.wp_username,
        wpConfig.wp_token
      );
    },
    enabled: !!wpConfig?.wp_url && !!wpConfig?.wp_token && !!wpConfig?.wp_username,
    retry: false
  });

  return {
    permissions,
    permissionsLoading,
    userStructure,
    userStructureLoading,
    configError,
    refetch
  };
};