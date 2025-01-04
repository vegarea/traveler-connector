import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Activity, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  gradient
}: { 
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  gradient: string;
}) => (
  <Card className="overflow-hidden">
    <div className={cn(
      "absolute inset-0 opacity-5",
      gradient
    )} />
    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center",
        "bg-background/50 backdrop-blur-sm"
      )}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent className="relative">
      <div className="text-2xl font-bold">{value}</div>
      <p className={cn(
        "text-xs",
        change > 0 ? "text-[#F4007A]" : "text-destructive"
      )}>
        {change > 0 ? "+" : ""}{change}% desde el último mes
      </p>
    </CardContent>
  </Card>
);

export const DashboardStats = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Usuarios Registrados"
          value="1,274"
          change={20}
          icon={Users}
          gradient="bg-gradient-to-br from-[#F4007A] to-[#F4007A]/50"
        />
        <StatCard
          title="Usuarios Activos"
          value="849"
          change={12}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-[#E2F3FD] to-[#D3E4FD]"
        />
        <StatCard
          title="Actividad Diaria"
          value="2,847"
          change={8}
          icon={Activity}
          gradient="bg-gradient-to-br from-[#E1F6EB] to-[#E1F6EB]/50"
        />
        <StatCard
          title="Mensajes"
          value="482"
          change={15}
          icon={MessageSquare}
          gradient="bg-gradient-to-br from-[#FEC6A1] to-[#FEC6A1]/50"
        />
      </div>
    </div>
  );
};