import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionItem } from './components/PermissionItem';
import { useWordPressPermissions } from './hooks/useWordPressPermissions';

export const PermissionsCheck = () => {
  const { toast } = useToast();
  const {
    permissions,
    permissionsLoading,
    userStructure,
    userStructureLoading,
    configError,
    refetch
  } = useWordPressPermissions();

  const handleRefresh = () => {
    console.log('Iniciando actualización de permisos...');
    refetch();
    toast({
      title: "Verificando permisos",
      description: "Comprobando acceso a los endpoints de WordPress..."
    });
  };

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
                    <PermissionItem
                      key={permission.endpoint}
                      endpoint={permission.endpoint}
                      description={permission.description}
                      isAvailable={permission.isAvailable}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  No se pudo verificar los permisos. Asegúrate de que WordPress esté correctamente configurado.
                  {configError && (
                    <span className="block mt-2 text-red-500">
                      Error: {configError.message}
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
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};