import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoUploader from '@/components/admin/settings/LogoUploader';
import { supabase } from "@/integrations/supabase/client";

interface LogoConfig {
  id: string;
  type: string;
  url: string;
  alt_text?: string;
}

const StyleConfig = () => {
  const [logos, setLogos] = useState<Record<string, LogoConfig>>({});

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    const { data, error } = await supabase
      .from('logo_config')
      .select('*');

    if (error) {
      console.error('Error fetching logos:', error);
      return;
    }

    const logosMap = data.reduce((acc, logo) => {
      acc[logo.type] = logo;
      return acc;
    }, {} as Record<string, LogoConfig>);

    setLogos(logosMap);
  };

  const handleLogoUpdate = async (type: string, logoData: Omit<LogoConfig, 'id' | 'type'>) => {
    const existingLogo = logos[type];
    
    if (existingLogo) {
      // Update existing logo
      const { error } = await supabase
        .from('logo_config')
        .update({
          url: logoData.url,
          alt_text: logoData.alt_text,
        })
        .eq('id', existingLogo.id);

      if (error) {
        console.error('Error updating logo:', error);
        return;
      }
    } else {
      // Insert new logo
      const { error } = await supabase
        .from('logo_config')
        .insert({
          type,
          url: logoData.url,
          alt_text: logoData.alt_text,
        });

      if (error) {
        console.error('Error inserting logo:', error);
        return;
      }
    }

    // Refresh logos after update
    fetchLogos();
  };

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
                  <div className="space-y-2">
                    <div className="h-20 rounded-md" style={{ backgroundColor: '#FEC6A1' }}></div>
                    <p className="text-sm text-center">Naranja Pastel (#FEC6A1)</p>
                    <p className="text-xs text-center text-muted-foreground">Notificaciones Warning</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-md" style={{ backgroundColor: '#D3E4FD' }}></div>
                    <p className="text-sm text-center">Azul Claro Pastel (#D3E4FD)</p>
                    <p className="text-xs text-center text-muted-foreground">Estados Inactivos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Logos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <LogoUploader
                type="header_desktop"
                title="Logo Header (Escritorio)"
                description="Logo principal para la cabecera en versión escritorio"
                currentLogo={logos['header_desktop']}
                onUploadSuccess={(logoData) => handleLogoUpdate('header_desktop', logoData)}
              />

              <LogoUploader
                type="header_mobile"
                title="Logo Header (Móvil)"
                description="Versión del logo optimizada para dispositivos móviles"
                currentLogo={logos['header_mobile']}
                onUploadSuccess={(logoData) => handleLogoUpdate('header_mobile', logoData)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleConfig;