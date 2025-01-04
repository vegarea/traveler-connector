import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ConfigFormFields } from './forms/ConfigFormFields';
import { useConfigForm } from './forms/useConfigForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const WordPressConfigForm = () => {
  const { form, onSubmit, testConnection, isConnected } = useConfigForm();

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
        </CardContent>
      </Card>

      {isConnected && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Conexión establecida correctamente</AlertTitle>
          <AlertDescription className="mt-2">
            La conexión con WordPress está configurada. Ahora puedes{' '}
            <Link to="/admin/settings/permissions" className="font-medium text-green-700 hover:text-green-800">
              verificar los permisos necesarios
            </Link>{' '}
            para sincronizar los datos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};