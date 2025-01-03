import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const checkEndpoint = async (endpoint: string, wpUrl: string, wpToken: string) => {
  console.log(`Verificando endpoint: ${endpoint}`);
  try {
    const response = await fetch(`${wpUrl}/wp-json${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${wpToken}`
      }
    });
    
    console.log(`Respuesta del endpoint ${endpoint}:`, {
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`Error en endpoint ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
    }

    return response.ok;
  } catch (error) {
    console.error(`Error al verificar endpoint ${endpoint}:`, error);
    return false;
  }
};

export const PermissionsCheck = () => {
  const { toast } = useToast();

  const { data: wpConfig, error: configError } = useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      try {
        const { data, error } = await fetch('/api/wordpress/config').then(res => res.json());
        if (error) {
          console.error('Error al cargar la configuración de WordPress:', error);
          throw error;
        }
        console.log('Configuración de WordPress cargada:', data);
        return data;
      } catch (error) {
        console.error('Error en la consulta de configuración:', error);
        throw error;
      }
    }
  });

  const { data: permissions, isLoading: permissionsLoading, refetch, error: permissionsError } = useQuery({
    queryKey: ['wordpress-permissions', wpConfig],
    queryFn: async () => {
      if (!wpConfig?.wp_url || !wpConfig?.wp_token) {
        console.error('Configuración de WordPress incompleta:', { 
          hasUrl: !!wpConfig?.wp_url, 
          hasToken: !!wpConfig?.wp_token 
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
            wpConfig.wp_token
          )
        }))
      );

      console.log('Resultados de verificación de permisos:', results);
      return results;
    },
    enabled: !!wpConfig?.wp_url && !!wpConfig?.wp_token,
    retry: false
  });

  const { data: userStructure, isLoading: userStructureLoading, error: userStructureError } = useQuery({
    queryKey: ['wordpress-user-structure', wpConfig],
    queryFn: async () => {
      if (!wpConfig?.wp_url || !wpConfig?.wp_token) {
        console.error('Configuración incompleta para estructura de usuario');
        throw new Error('WordPress no está configurado');
      }

      try {
        const response = await fetch(`${wpConfig.wp_url}/wp-json/wp/v2/users/me`, {
          headers: {
            'Authorization': `Bearer ${wpConfig.wp_token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error al obtener estructura de usuario:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          throw new Error('No se pudo obtener la estructura de usuarios');
        }

        const data = await response.json();
        console.log('Estructura de usuario obtenida:', data);
        return data;
      } catch (error) {
        console.error('Error al obtener estructura de usuario:', error);
        throw error;
      }
    },
    enabled: !!wpConfig?.wp_url && !!wpConfig?.wp_token
  });

  const handleRefresh = () => {
    console.log('Iniciando actualización de permisos...');
    refetch();
    toast({
      title: "Verificando permisos",
      description: "Comprobando acceso a los endpoints de WordPress..."
    });
  };

  // Si hay errores, mostrarlos en la consola
  React.useEffect(() => {
    if (configError) console.error('Error en la configuración:', configError);
    if (permissionsError) console.error('Error en los permisos:', permissionsError);
    if (userStructureError) console.error('Error en la estructura de usuario:', userStructureError);
  }, [configError, permissionsError, userStructureError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permisos y Estructura de WordPress</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="permissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="structure">Estructura de Usuario</TabsTrigger>
          </TabsList>

          <TabsContent value="permissions">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Verificación de acceso a endpoints necesarios
                </p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={permissionsLoading}
                >
                  {permissionsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verificar permisos"
                  )}
                </Button>
              </div>

              {permissionsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : permissions ? (
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div
                      key={permission.endpoint}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{permission.description}</p>
                        <code className="text-xs text-muted-foreground">
                          {permission.endpoint}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        {permission.isAvailable ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  No se pudo verificar los permisos. Asegúrate de que WordPress esté correctamente configurado.
                  {permissionsError && (
                    <span className="block mt-2 text-red-500">
                      Error: {permissionsError.message}
                    </span>
                  )}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="structure">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Estructura actual del usuario en WordPress
              </p>
              
              {userStructureLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : userStructure ? (
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(userStructure, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  No se pudo obtener la estructura del usuario. Verifica la conexión con WordPress.
                  {userStructureError && (
                    <span className="block mt-2 text-red-500">
                      Error: {userStructureError.message}
                    </span>
                  )}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};