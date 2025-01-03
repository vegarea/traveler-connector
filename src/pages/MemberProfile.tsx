import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import Profile from './Profile';
import { useToast } from '@/hooks/use-toast';

const MemberProfile = () => {
  const { username } = useParams();
  const { toast } = useToast();

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      if (!username) throw new Error('No username provided');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        throw error;
      }

      return data;
    },
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del usuario",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Cargando perfil...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !userData) {
    return <Navigate to="/404" replace />;
  }

  return <Profile userId={userData.id} />;
};

export default MemberProfile;