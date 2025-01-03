import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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

const Permissions = () => {
  const { toast } = useToast();

  const { data: wpStructure, isLoading, error } = useQuery({
    queryKey: ['wordpress-structure'],
    queryFn: fetchWordPressStructure,
    retry: false,
    enabled: !!localStorage.getItem('wp_token')
  });

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Diagnóstico de Permisos</h1>
      
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
  );
};

export default Permissions;