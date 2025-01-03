import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/admin/AdminLayout";

const Admin = () => {
  const { toast } = useToast();

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente.",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Configuración de WordPress</h1>
        
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

              <div className="space-y-2">
                <Label>Estado de BuddyPress</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span>BuddyPress detectado</span>
                    <span className="px-2 py-1 text-sm bg-green-500 text-white rounded">Activo</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Guardar configuración
              </Button>
            </form>
          </CardContent>
        </Card>

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
      </div>
    </AdminLayout>
  );
};

export default Admin;