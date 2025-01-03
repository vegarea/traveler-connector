import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Flag, Star, Trophy, Plane, UsersRound, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMap from '@/components/ProfileMap';
import ProfileStats from '@/components/ProfileStats';
import TravelBadges from '@/components/TravelBadges';
import PublishedTrips from '@/components/PublishedTrips';
import TravelGroups from '@/components/TravelGroups';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();

  // Fetch WordPress config
  const { data: wpConfig, error: configError } = useQuery({
    queryKey: ['wordpress-config'],
    queryFn: async () => {
      console.log('Fetching WordPress config...');
      const { data, error } = await supabase
        .from('wordpress_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching WordPress config:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No WordPress configuration found');
      }

      console.log('WordPress config fetched:', data[0]);
      return data[0];
    },
    retry: 1,
    onError: (error) => {
      console.error('WordPress config fetch error:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de WordPress",
        variant: "destructive",
      });
    },
  });

  // Fetch WordPress user data
  const { data: wpUserData, isLoading } = useQuery({
    queryKey: ['wordpress-user', wpConfig?.wp_url],
    queryFn: async () => {
      if (!wpConfig?.wp_url || !wpConfig?.wp_token || !wpConfig?.wp_username) {
        throw new Error('WordPress configuration is incomplete');
      }

      console.log('Fetching WordPress user data...');
      // Usar autenticación Basic con usuario y token
      const response = await fetch(`${wpConfig.wp_url}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Basic ${btoa(`${wpConfig.wp_username}:${wpConfig.wp_token}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WordPress API Error:', errorText);
        throw new Error('Failed to fetch WordPress user data');
      }

      const userData = await response.json();
      console.log('WordPress user data fetched:', userData);
      return userData;
    },
    enabled: !!wpConfig?.wp_url && !!wpConfig?.wp_token && !!wpConfig?.wp_username,
    retry: 1,
    onError: (error) => {
      console.error('WordPress user data fetch error:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del usuario de WordPress",
        variant: "destructive",
      });
    },
  });

  if (configError) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Error al cargar la configuración de WordPress</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo */}
      <div className="relative h-[300px] w-full">
        <img
          src={wpUserData?.banner_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
      </div>

      {/* Profile Info */}
      <div className="container relative max-w-6xl mx-auto px-4">
        <div className="relative -mt-24">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={wpUserData?.avatar_urls?.['96'] || ''} />
              <AvatarFallback>
                {wpUserData?.name ? wpUserData.name.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-3xl font-bold">{wpUserData?.name || 'Usuario'}</h1>
            <p className="mt-2 text-muted-foreground text-center max-w-2xl">
              {wpUserData?.description || 'Sin descripción'}
            </p>
            {wpUserData?.link && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.open(wpUserData.link, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver perfil en WordPress
              </Button>
            )}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>2.5k followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>1.2k following</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <ProfileStats />
            
            {/* Travel Map */}
            <Card className="col-span-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Visited Countries
                </h2>
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <ProfileMap />
                </div>
              </CardContent>
            </Card>

            {/* Bucket List */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Travel Bucket List
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Japan</Badge>
                  <Badge variant="outline">New Zealand</Badge>
                  <Badge variant="outline">Iceland</Badge>
                  <Badge variant="outline">Peru</Badge>
                  <Badge variant="outline">Thailand</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Travel Interests */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Travel Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge>Adventure</Badge>
                  <Badge>Photography</Badge>
                  <Badge>Culture</Badge>
                  <Badge>Food</Badge>
                  <Badge>Nature</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Community Badges */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Community Badges
                </h2>
                <TravelBadges />
              </CardContent>
            </Card>
          </div>

          {/* Travel Groups */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <UsersRound className="w-6 h-6" />
              Grupos de Viaje
            </h2>
            <TravelGroups />
          </div>

          {/* Published Trips */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Plane className="w-6 h-6" />
              Published Trips
            </h2>
            <PublishedTrips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;