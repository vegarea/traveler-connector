import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UserCircle, 
  Users2, 
  Activity,
  Palette
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { SidebarHeader } from './layout/SidebarHeader';
import { SidebarMenuItem } from './layout/SidebarMenuItem';
import { LogoutButton } from './layout/LogoutButton';
import type { MenuItem, LogoConfig } from './layout/types';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [headerLogo, setHeaderLogo] = useState<LogoConfig | null>(null);
  
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
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-200 to-slate-100">
      {/* Sidebar con gradiente sutil y sombra mejorada */}
      <aside className="w-72 flex flex-col bg-gradient-to-b from-white via-slate-100 to-slate-200 border-r border-slate-200 shadow-lg">
        <nav className="h-full flex flex-col">
          <SidebarHeader headerLogo={headerLogo} isCollapsed={false} />
          
          {/* Menu Items con mejor espaciado y efectos hover */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.path}
                item={item}
                isActive={isActiveRoute(item.path)}
                isActiveSubmenuItem={isActiveSubmenuItem}
                isCollapsed={false}
              />
            ))}
          </div>
          
          <LogoutButton onLogout={handleLogout} isCollapsed={false} />
        </nav>
      </aside>

      {/* Main Content con gradiente y sombra interna */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-100 to-white">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;