import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StyleConfig = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Estilo y Marca</h1>
      
      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="colors">Colores</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Paleta de Colores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Colors */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Colores Principales</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-20 bg-black rounded-md"></div>
                    <p className="text-sm text-center">Negro (#000000)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-white border border-gray-200 rounded-md"></div>
                    <p className="text-sm text-center">Blanco (#FFFFFF)</p>
                  </div>
                </div>
              </div>

              {/* Secondary Color */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Color Secundario</Label>
                <div className="space-y-2">
                  <div className="h-20 rounded-md" style={{ backgroundColor: '#F4007A' }}></div>
                  <p className="text-sm text-center">Magenta (#F4007A)</p>
                </div>
              </div>

              {/* Pastel Colors */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Colores Pastel</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="h-20 rounded-md" style={{ backgroundColor: '#E2F3FD' }}></div>
                    <p className="text-sm text-center">Azul Pastel (#E2F3FD)</p>
                    <p className="text-xs text-center text-muted-foreground">Notificaciones Info</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-md" style={{ backgroundColor: '#E1F6EB' }}></div>
                    <p className="text-sm text-center">Verde Pastel (#E1F6EB)</p>
                    <p className="text-xs text-center text-muted-foreground">Notificaciones Éxito</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-md" style={{ backgroundColor: '#FEEAF1' }}></div>
                    <p className="text-sm text-center">Rosa Pastel (#FEEAF1)</p>
                    <p className="text-xs text-center text-muted-foreground">Notificaciones Error</p>
                  </div>
                </div>
              </div>

              {/* Usage Examples */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Ejemplos de Uso</Label>
                <div className="space-y-4">
                  <button className="px-4 py-2 bg-[#F4007A] text-white rounded-md hover:bg-[#d1006a] transition-colors">
                    Botón de Ejemplo
                  </button>
                  <div className="p-4 bg-[#E2F3FD] rounded-md">
                    Notificación de Información
                  </div>
                  <div className="p-4 bg-[#E1F6EB] rounded-md">
                    Notificación de Éxito
                  </div>
                  <div className="p-4 bg-[#FEEAF1] rounded-md">
                    Notificación de Error
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  El logo principal está diseñado en blanco y negro para mantener la consistencia con la paleta principal del sitio.
                </p>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Área para previsualización del logo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleConfig;