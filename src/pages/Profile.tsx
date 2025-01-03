import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useWordPressConfig } from '@/components/wordpress/hooks/useWordPressConfig';
import { useWordPressUser } from '@/components/wordpress/hooks/useWordPressUser';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileProps {
  userId?: string;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user data if userId is provided
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user-data', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario",
          variant: "destructive",
        });
      }
    }
  });

  const { data: wpConfig } = useWordPressConfig();
  const { data: wpUserData, isLoading: wpLoading } = useWordPressUser(wpConfig);

  if (userLoading || wpLoading) {
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

  const displayData = userId ? userData : wpUserData;
  const wpProfileUrl = userId 
    ? `${wpConfig?.wp_url}/members/${userData?.username}`
    : wpUserData?.link;

  // Obtener la URL del avatar correcta
  const avatarUrl = displayData?.avatar_url || (wpUserData?.avatar_urls && wpUserData.avatar_urls['96']);
  const username = displayData?.username || 'Usuario';

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo */}
      <div className="relative h-[300px] w-full">
        <img
          src={displayData?.cover_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
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
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-3xl font-bold">{username}</h1>
            <p className="mt-2 text-muted-foreground text-center max-w-2xl">
              {displayData?.description || 'Sin descripción'}
            </p>
            {wpProfileUrl && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.open(wpProfileUrl, '_blank')}
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