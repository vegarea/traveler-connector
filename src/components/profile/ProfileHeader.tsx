import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ProfileHeaderProps {
  coverUrl?: string;
  avatarUrl?: string;
  username: string;
  description?: string;
  wpProfileUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  coverUrl,
  avatarUrl,
  username,
  description,
  wpProfileUrl,
}) => {
  return (
    <>
      {/* Cover Photo */}
      <div className="relative h-[300px] w-full">
        <img
          src={coverUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
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
            <Avatar className="w-48 h-48 border-4 border-background">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-3xl font-bold">{username}</h1>
            <p className="mt-2 text-muted-foreground text-center max-w-2xl">
              {description || 'Sin descripción'}
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
          </div>
        </div>
      </div>
    </>
  );
};