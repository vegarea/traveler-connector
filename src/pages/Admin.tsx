import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";

// Función para obtener la estructura de WordPress
async function fetchWordPressStructure() {
  const response = await fetch(`${import.meta.env.VITE_WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('wp_token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch WordPress structure');
  }
  
  return response.json();
}

const Admin = () => {
  const { toast } = useToast();

  const { data: wpStructure, isLoading, error } = useQuery({
    queryKey: ['wordpress-structure'],
    queryFn: fetchWordPressStructure,
    retry: false,
    enabled: !!localStorage.getItem('wp_token')
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente.",
    });
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_WORDPRESS_URL}/wp-json`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wp_token')}`
        }
      });
      
      if (response.ok) {
        toast({
          title: "Conexión exitosa",
          description: "La conexión con WordPress está funcionando correctamente.",
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con WordPress. Verifica la URL y el token.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList>
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="sync">Sincronización</TabsTrigger>
          </TabsList>

          {/* Pestaña de Configuración */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Conexión con WordPress</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wp-url">URL de WordPress</Label>
                      <Input
                        id="wp-url"
                        placeholder="https://tuwordpress.com"
                        type="url"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        placeholder="wp_xxxxx..."
                        type="password"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="sync-users" />
                      <Label htmlFor="sync-users">Sincronización automática de usuarios</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sync-interval">Intervalo de sincronización (minutos)</Label>
                      <Input
                        id="sync-interval"
                        type="number"
                        min="5"
                        defaultValue="15"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Guardar configuración
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Permisos */}
          <TabsContent value="permissions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conexión con WordPress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button onClick={handleTestConnection}>
                      Probar Conexión
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      URL: {import.meta.env.VITE_WORDPRESS_URL || 'No configurada'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estructura de Usuarios WordPress</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading && (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 text-red-500">
                      Error al cargar la estructura. Verifica la conexión y los permisos.
                    </div>
                  )}
                  
                  {wpStructure && (
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                      {JSON.stringify(wpStructure, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Endpoints Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <code className="bg-muted px-1 rounded">/wp-json/wp/v2/users</code>
                      <span className="text-sm text-muted-foreground ml-2">
                        Lista de usuarios y sus roles
                      </span>
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">/wp-json/buddypress/v1/members</code>
                      <span className="text-sm text-muted-foreground ml-2">
                        Perfiles de BuddyPress (si está instalado)
                      </span>
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">/wp-json/wp/v2/users/me</code>
                      <span className="text-sm text-muted-foreground ml-2">
                        Información del usuario actual
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Sincronización */}
          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de sincronización</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-sm text-muted-foreground">Usuarios sincronizados</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-2xl font-bold">5 min</div>
                      <div className="text-sm text-muted-foreground">Última sincronización</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-2xl font-bold">99.9%</div>
                      <div className="text-sm text-muted-foreground">Tasa de éxito</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;