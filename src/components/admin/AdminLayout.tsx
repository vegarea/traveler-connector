import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Settings, Users, Webhook, Globe, Activity, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    group: "WordPress",
    items: [
      { title: "Configuración", icon: Settings, path: "/admin" },
      { title: "Webhooks", icon: Webhook, path: "/admin/webhooks" },
      { title: "Usuarios", icon: Users, path: "/admin/users" },
    ]
  },
  {
    group: "BuddyPress",
    items: [
      { title: "Actividad", icon: Activity, path: "/admin/activity" },
      { title: "Grupos", icon: Globe, path: "/admin/groups" },
      { title: "Permisos", icon: Shield, path: "/admin/permissions" },
    ]
  }
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold">Panel de Control</h2>
          </SidebarHeader>
          <SidebarContent>
            {menuItems.map((group) => (
              <SidebarGroup key={group.group}>
                <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        isActive={location.pathname === item.path}
                        tooltip={item.title}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;