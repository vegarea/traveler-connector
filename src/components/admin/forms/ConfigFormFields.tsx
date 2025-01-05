import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
              La contraseña de tu usuario de WordPress
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
                placeholder="https://tuapp.com" 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              La URL base de tu aplicación Traveler
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
                placeholder="https://tuapp.com/auth/wordpress/callback" 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
            <FormDescription>
              La URL de callback para la autenticación de WordPress
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};