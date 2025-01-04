import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, MessageSquare, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className={cn(
            "text-sm mt-1",
            change > 0 ? "text-green-600" : "text-red-600"
          )}>
            {change > 0 ? "+" : ""}{change}%
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Usuarios Totales"
          value="1,234"
          change={12}
          icon={Users}
        />
        <DashboardCard
          title="Usuarios Activos"
          value="892"
          change={-5}
          icon={UserCheck}
        />
        <DashboardCard
          title="Actividad Diaria"
          value="2,456"
          change={8}
          icon={Activity}
        />
        <DashboardCard
          title="Mensajes"
          value="15,234"
          change={23}
          icon={MessageSquare}
        />
      </div>
    </div>
  );
};

export default Dashboard;