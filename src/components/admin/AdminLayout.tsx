import React, { useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuth } from './auth/AdminAuth';
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
import { Settings, LogOut, Users, Globe, UserCircle, Users2, Activity, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    group: "Usuarios",
    icon: Users,
    items: [
      { title: "Gestión de Usuarios", icon: UserCircle, path: "/admin/users" },
      { title: "Roles y Permisos", icon: Users2, path: "/admin/users/roles" },
    ]
  },
  {
    group: "Travelbuddys",
    icon: Globe,
    items: [
      { title: "Perfiles de Viajero", icon: UserCircle, path: "/admin/travelbuddys/profiles" },
      { title: "Grupos", icon: Users2, path: "/admin/travelbuddys/groups" },
      { title: "Feed de Actividad", icon: Activity, path: "/admin/travelbuddys/feed" },
      { title: "Notificaciones", icon: Bell, path: "/admin/travelbuddys/notifications" },
      { title: "Configuración", icon: Settings, path: "/admin/travelbuddys/settings" },
    ]
  },
  {
    group: "WordPress",
    icon: Settings,
    items: [
      { title: "Panel de Control", icon: Settings, path: "/admin" },
    ]
  }
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!session) {
    return <AdminAuth />;
  }

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
                <SidebarGroupLabel>
                  <group.icon className="w-4 h-4 mr-2" />
                  {group.group}
                </SidebarGroupLabel>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <Link to={item.path} className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
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