import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const WordPressUserProfile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de WordPress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">
            La información del perfil estará disponible después de conectar con WordPress
          </p>
        </div>
      </CardContent>
    </Card>
  );
};