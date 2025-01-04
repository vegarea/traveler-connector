import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type ProfileType = 'traveler' | 'premium' | 'agency' | 'expert';

interface ProfileComponent {
  id: string;
  component_key: string;
  component_name: string;
  description: string | null;
  enabled: boolean;
}

interface ProfileTypeComponent {
  id: string;
  profile_type: ProfileType;
  component_id: string;
  enabled: boolean;
}

const ProfilesConfig = () => {
  const { toast } = useToast();

  const { data: components, isLoading: componentsLoading } = useQuery({
    queryKey: ['profile-components'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_components')
        .select('*')
        .order('component_name');
      
      if (error) throw error;
      return data as ProfileComponent[];
    },
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudieron cargar los componentes del perfil",
          variant: "destructive",
        });
      }
    }
  });

  const { data: typeComponents, isLoading: typeComponentsLoading } = useQuery({
    queryKey: ['profile-type-components'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_type_components')
        .select('*');
      
      if (error) throw error;
      return data as ProfileTypeComponent[];
    },
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración de los perfiles",
          variant: "destructive",
        });
      }
    }
  });

  const handleToggleComponent = async (componentId: string, profileType: ProfileType, currentState: boolean) => {
    const { error } = await supabase
      .from('profile_type_components')
      .upsert({
        component_id: componentId,
        profile_type: profileType,
        enabled: !currentState
      }, {
        onConflict: 'profile_type,component_id'
      });

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

  const isComponentEnabled = (componentId: string, profileType: ProfileType) => {
    const config = typeComponents?.find(
      tc => tc.component_id === componentId && tc.profile_type === profileType
    );
    return config?.enabled ?? true;
  };

  if (componentsLoading || typeComponentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const profileTypes: ProfileType[] = ['traveler', 'premium', 'agency', 'expert'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Componentes del Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Componente</TableHead>
                {profileTypes.map((type) => (
                  <TableHead key={type} className="text-center">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {components?.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{component.component_name}</p>
                      {component.description && (
                        <p className="text-sm text-muted-foreground">
                          {component.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  {profileTypes.map((type) => (
                    <TableCell key={type} className="text-center">
                      <Switch
                        checked={isComponentEnabled(component.id, type)}
                        onCheckedChange={() => 
                          handleToggleComponent(
                            component.id,
                            type,
                            isComponentEnabled(component.id, type)
                          )
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilesConfig;