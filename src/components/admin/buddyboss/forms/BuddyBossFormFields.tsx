import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { BuddyBossConfigFormValues } from './types';

interface BuddyBossFormFieldsProps {
  form: UseFormReturn<BuddyBossConfigFormValues>;
}

export const BuddyBossFormFields = ({ form }: BuddyBossFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="sync_xprofile"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Sincronizar campos de perfil (xProfile)</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sync_groups"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Sincronizar grupos</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sync_activity"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Sincronizar actividad</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sync_friends"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Sincronizar amigos</FormLabel>
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