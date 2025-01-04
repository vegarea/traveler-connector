import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Upload, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LogoUploaderProps {
  type: string;
  title: string;
  description: string;
  currentLogo?: {
    url: string;
    alt_text?: string;
    width?: number;
    height?: number;
  };
  onUploadSuccess: (logoData: {
    url: string;
    alt_text?: string;
    width?: number;
    height?: number;
  }) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  type,
  title,
  description,
  currentLogo,
  onUploadSuccess,
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [altText, setAltText] = useState(currentLogo?.alt_text || '');
  const [width, setWidth] = useState(currentLogo?.width?.toString() || '');
  const [height, setHeight] = useState(currentLogo?.height?.toString() || '');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Call the success callback with the new logo data
      onUploadSuccess({
        url: publicUrl,
        alt_text: altText,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
      });

      toast({
        title: "Logo actualizado",
        description: "El logo se ha actualizado correctamente",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el logo. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {currentLogo?.url && (
        <div className="relative w-full max-w-md border rounded-lg p-4">
          <img
            src={currentLogo.url}
            alt={currentLogo.alt_text || title}
            className="max-w-full h-auto"
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor={`${type}-file`}>Subir nuevo logo</Label>
          <div className="mt-1">
            <Input
              id={`${type}-file`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`${type}-alt`}>Texto alternativo</Label>
          <Input
            id={`${type}-alt`}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descripción del logo para accesibilidad"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${type}-width`}>Ancho (px)</Label>
            <Input
              id={`${type}-width`}
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Auto"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-height`}>Alto (px)</Label>
            <Input
              id={`${type}-height`}
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoUploader;