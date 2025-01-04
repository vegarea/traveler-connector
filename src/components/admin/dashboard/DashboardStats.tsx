import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Activity, MessageSquare } from "lucide-react";

export const DashboardStats = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Usuarios Registrados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Registrados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,274</div>
            <p className="text-xs text-muted-foreground">
              +20% desde el último mes
            </p>
          </CardContent>
        </Card>

        {/* Usuarios Activos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">849</div>
            <p className="text-xs text-muted-foreground">
              +12% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        {/* Actividad Diaria */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actividad Diaria
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +8% desde ayer
            </p>
          </CardContent>
        </Card>

        {/* Mensajes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mensajes
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482</div>
            <p className="text-xs text-muted-foreground">
              +15% desde la semana pasada
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};