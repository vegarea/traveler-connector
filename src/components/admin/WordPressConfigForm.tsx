import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ConfigFormFields } from './forms/ConfigFormFields';
import { useConfigForm } from './forms/useConfigForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, User, LogIn } from "lucide-react";
import { generateWordPressLoginUrl } from '@/utils/wordpressAuth';
import { useToast } from "@/hooks/use-toast";

export const WordPressConfigForm = () => {
  const { form, onSubmit, testConnection, isConnected, connectionInfo } = useConfigForm();
  const { toast } = useToast();

  const handleWordPressLogin = async () => {
    try {
      const loginUrl = await generateWordPressLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Error al iniciar sesión con WordPress:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el proceso de login con WordPress",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-white/50 shadow-lg border border-slate-200/60 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <CardTitle>Conexión con WordPress</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ConfigFormFields form={form} />
              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => testConnection()}
                  className="flex-1 bg-white hover:bg-slate-50 transition-colors duration-200"
                >
                  Probar conexión
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-[#F4007A] to-[#F4007A]/90 hover:from-[#F4007A]/90 hover:to-[#F4007A] transition-all duration-200"
                >
                  Guardar configuración
                </Button>
              </div>
            </form>
          </Form>

          {isConnected && (
            <div className="mt-6">
              <Button
                onClick={handleWordPressLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar sesión con WordPress
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && connectionInfo && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Conexión JWT establecida correctamente</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <User className="h-4 w-4" />
              <span>Usuario conectado: {connectionInfo.user_display_name}</span>
            </div>
            <div className="text-sm text-green-600">
              Email: {connectionInfo.user_email}
              <br />
              Nombre de usuario: {connectionInfo.user_nicename}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};