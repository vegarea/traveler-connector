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
            <FormLabel>URL de WordPress</FormLabel>
            <FormControl>
              <Input placeholder="https://tuwordpress.com" {...field} />
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
            <FormLabel>API Key</FormLabel>
            <FormControl>
              <Input type="password" placeholder="wp_xxxxx..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sync_users"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Sincronización automática de usuarios</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sync_interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intervalo de sincronización (minutos)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="5"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};