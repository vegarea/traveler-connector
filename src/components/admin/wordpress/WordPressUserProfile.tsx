import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users } from "lucide-react";
import { useWordPressPermissions } from '../permissions/hooks/useWordPressPermissions';

export const WordPressUserProfile = () => {
  const { userStructure, userStructureLoading } = useWordPressPermissions();

  if (userStructureLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userStructure) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No se encontró información del usuario</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de WordPress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userStructure.avatar_urls['96']} />
            <AvatarFallback>
              {userStructure.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{userStructure.name}</h3>
              <p className="text-muted-foreground">{userStructure.description || 'Sin descripción'}</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(userStructure.link, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver perfil en WordPress
              </Button>
            </div>

            {userStructure.meta && userStructure.meta.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Metadatos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {userStructure.meta.map((meta: any, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{meta.key}: </span>
                      <span className="text-muted-foreground">{meta.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};