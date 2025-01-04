import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const SettingsConfig = () => {
  const { toast } = useToast();

  const { data: buddyPressConfig, isLoading } = useQuery({
    queryKey: ['buddypress-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buddypress_config')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración",
          variant: "destructive",
        });
      }
    }
  });

  const updateConfig = async (key: string, value: boolean) => {
    const { error } = await supabase
      .from('buddypress_config')
      .update({ [key]: value })
      .eq('id', buddyPressConfig?.id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Éxito",
      description: "Configuración actualizada correctamente",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de TravelBuddys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="sync_xprofile_fields">Sincronizar campos de perfil</Label>
          <Switch
            id="sync_xprofile_fields"
            checked={buddyPressConfig?.sync_xprofile_fields}
            onCheckedChange={(checked) => updateConfig('sync_xprofile_fields', checked)}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="sync_groups">Sincronizar grupos</Label>
          <Switch
            id="sync_groups"
            checked={buddyPressConfig?.sync_groups}
            onCheckedChange={(checked) => updateConfig('sync_groups', checked)}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="sync_activity">Sincronizar actividad</Label>
          <Switch
            id="sync_activity"
            checked={buddyPressConfig?.sync_activity}
            onCheckedChange={(checked) => updateConfig('sync_activity', checked)}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="sync_friends">Sincronizar amigos</Label>
          <Switch
            id="sync_friends"
            checked={buddyPressConfig?.sync_friends}
            onCheckedChange={(checked) => updateConfig('sync_friends', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsConfig;