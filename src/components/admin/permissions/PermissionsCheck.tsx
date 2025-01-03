import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const response = await fetch(`${wpUrl}/wp-json${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${wpToken}`
    }
  });
  return response.ok;
};

export const PermissionsCheck = () => {
  const { toast } = useToast();

  const { data: wpConfig } = useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      const { data } = await fetch('/api/wordpress/config').then(res => res.json());
      return data;
    }
  });

  const { data: permissions, isLoading, refetch } = useQuery({
    queryKey: ['wordpress-permissions', wpConfig],
    queryFn: async () => {
      if (!wpConfig?.wp_url || !wpConfig?.wp_token) {
        throw new Error('WordPress no está configurado');
      }

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

      return results;
    },
    enabled: !!wpConfig?.wp_url && !!wpConfig?.wp_token,
    retry: false
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Verificando permisos",
      description: "Comprobando acceso a los endpoints de WordPress..."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permisos de WordPress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Verificación de acceso a endpoints necesarios
            </p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verificar permisos"
              )}
            </Button>
          </div>

          {isLoading ? (
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
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};