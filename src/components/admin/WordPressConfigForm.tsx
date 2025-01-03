import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ConfigFormFields } from './forms/ConfigFormFields';
import { useConfigForm } from './forms/useConfigForm';

export const WordPressConfigForm = () => {
  const { form, onSubmit } = useConfigForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexión con WordPress</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ConfigFormFields form={form} />
            <Button type="submit" className="w-full">
              Guardar configuración
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};