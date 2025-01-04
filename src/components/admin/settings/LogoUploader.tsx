import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Upload, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LogoUploaderProps {
  type: string;
  title: string;
  description: string;
  currentLogo?: {
    url: string;
    alt_text?: string;
  };
  onUploadSuccess: (logoData: {
    url: string;
    alt_text?: string;
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
  const [previewUrl, setPreviewUrl] = useState(currentLogo?.url || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (rolesError) {
        console.error('Error checking admin status:', rolesError);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!roles);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

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

      setPreviewUrl(publicUrl);
      setHasChanges(true);
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      setError(error.message || 'Error al subir el logo');
      toast({
        title: "Error",
        description: "No se pudo subir el logo. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!previewUrl) return;

    onUploadSuccess({
      url: previewUrl,
      alt_text: altText,
    });

    setHasChanges(false);
    toast({
      title: "Logo guardado",
      description: "El logo se ha guardado correctamente",
    });
  };

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No tienes permisos para gestionar los logos. Contacta con un administrador.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {previewUrl && (
        <div className="relative w-full max-w-md border rounded-lg p-4">
          <img
            src={previewUrl}
            alt={altText || title}
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
            onChange={(e) => {
              setAltText(e.target.value);
              setHasChanges(true);
            }}
            placeholder="Descripción del logo para accesibilidad"
          />
        </div>

        {hasChanges && (
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto"
            disabled={isUploading}
          >
            {isUploading ? (
              "Subiendo..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LogoUploader;