import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ConfigFormValues } from './types';

interface ConfigFormFieldsProps {
  form: UseFormReturn<ConfigFormValues>;
}

export const ConfigFormFields = ({ form }: ConfigFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="wp_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">URL de WordPress</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://tuwordpress.com" 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              La URL base de tu sitio WordPress (sin /wp-json)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="wp_username"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Nombre de usuario de WordPress</FormLabel>
            <FormControl>
              <Input 
                placeholder="admin" 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              Usuario con permisos de administrador en WordPress
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="wp_token"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Contraseña de WordPress</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Tu contraseña de WordPress" 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              La contraseña de tu usuario de WordPress (para autenticación JWT)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="wp_api_token"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Token de API de WordPress</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Tu Application Password de WordPress" 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              Application Password generada en WordPress (para operaciones de API)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="auth_callback_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">URL de Callback</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              URL donde WordPress redirigirá después del login (automáticamente configurada)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="app_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">URL de la Aplicación</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              URL base de esta aplicación (automáticamente configurada)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sync_users"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-[#F4007A]"
              />
            </FormControl>
            <FormLabel className="text-slate-700">Sincronización automática de usuarios</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sync_interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Intervalo de sincronización (minutos)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="5"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};