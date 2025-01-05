import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ConnectionStatus = () => {
  const { toast } = useToast();

  const handleTestConnection = async () => {
    try {
      const token = localStorage.getItem('wp_token');
      const response = await fetch(`${import.meta.env.VITE_WORDPRESS_URL}/wp-json`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
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
    <Card>
      <CardHeader>
        <CardTitle>Estado de Conexión</CardTitle>
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
  );
};