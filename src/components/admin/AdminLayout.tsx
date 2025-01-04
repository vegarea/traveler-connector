import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UserCircle, 
  Users2, 
  Activity,
  Palette,
  ChevronLeft
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { SidebarHeader } from './layout/SidebarHeader';
import { SidebarMenuItem } from './layout/SidebarMenuItem';
import { LogoutButton } from './layout/LogoutButton';
import type { MenuItem, LogoConfig } from './layout/types';
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [headerLogo, setHeaderLogo] = useState<LogoConfig | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    const fetchLogo = async () => {
      const { data, error } = await supabase
        .from('logo_config')
        .select('url, alt_text')
        .eq('type', 'header_desktop')
        .single();

      if (!error && data) {
        setHeaderLogo(data);
      }
    };

    fetchLogo();
  }, []);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Usuarios",
      path: "/admin/users",
      icon: Users,
    },
    {
      title: "TravelBuddies",
      path: "/admin/travelbuddies",
      icon: Users2,
      submenu: [
        {
          title: "Perfiles",
          path: "/admin/travelbuddies/profiles",
          icon: UserCircle,
        },
        {
          title: "Grupos",
          path: "/admin/travelbuddies/groups",
          icon: Users2,
        },
        {
          title: "Actividad",
          path: "/admin/travelbuddies/activity",
          icon: Activity,
        },
      ],
    },
    {
      title: "Configuración",
      path: "/admin/settings",
      icon: Settings,
      submenu: [
        {
          title: "WordPress",
          path: "/admin/settings/wordpress",
          icon: Settings,
        },
        {
          title: "Permisos",
          path: "/admin/settings/permissions",
          icon: Users,
        },
        {
          title: "Estilo y Marca",
          path: "/admin/settings/style",
          icon: Palette,
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActiveRoute = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  const isActiveSubmenuItem = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col bg-sidebar transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <nav className="h-full flex flex-col relative">
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute -right-4 top-6 z-50",
              "w-8 h-8 rounded-full bg-accent flex items-center justify-center",
              "text-accent-foreground hover:bg-accent/90 transition-colors",
              "shadow-lg border border-border"
            )}
          >
            <ChevronLeft className={cn(
              "w-5 h-5 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )} />
          </button>

          <SidebarHeader headerLogo={headerLogo} isCollapsed={isCollapsed} />
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.path}
                item={item}
                isActive={isActiveRoute(item.path)}
                isActiveSubmenuItem={isActiveSubmenuItem}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
          
          <LogoutButton onLogout={handleLogout} isCollapsed={isCollapsed} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-xl">
          <div className="p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;