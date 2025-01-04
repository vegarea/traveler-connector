import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="wp_token"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">API Key</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="wp_xxxxx..." 
                {...field} 
                className="bg-white/70 border-slate-200 focus:border-[#F4007A]/30 focus:ring-[#F4007A]/10 transition-all duration-200"
              />
            </FormControl>
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