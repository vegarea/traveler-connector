import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UserCircle, 
  Users2, 
  Activity,
  LogOut,
  Palette,
  ChevronDown
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface LogoConfig {
  url: string;
  alt_text?: string;
}

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

  const menuItems = [
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white dark:bg-gray-900 shadow-lg">
        <nav className="h-full flex flex-col">
          <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            {headerLogo ? (
              <img 
                src={headerLogo.url} 
                alt={headerLogo.alt_text || "Logo"} 
                className="h-8 object-contain"
              />
            ) : (
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Panel Admin
              </h2>
            )}
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.path} className="space-y-1">
                <Link
                  to={item.submenu ? '#' : item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150",
                    "hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700",
                    "group relative",
                    isActiveRoute(item.path) 
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 text-purple-700 dark:text-white font-medium shadow-sm" 
                      : "text-gray-600 dark:text-gray-300"
                  )}
                  onClick={(e) => {
                    if (item.submenu) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActiveRoute(item.path) 
                      ? "text-purple-600 dark:text-white" 
                      : "text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-white"
                  )} />
                  <span className="flex-1">{item.title}</span>
                  {item.submenu && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>

                {item.submenu && (
                  <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150",
                          "text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700",
                          "group",
                          isActiveSubmenuItem(subItem.path)
                            ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 text-purple-700 dark:text-white font-medium shadow-sm"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      >
                        <subItem.icon className={cn(
                          "w-4 h-4",
                          isActiveSubmenuItem(subItem.path)
                            ? "text-purple-600 dark:text-white"
                            : "text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-white"
                        )} />
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Logout Button */}
          <div className="p-4 border-t bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150",
                "text-gray-600 dark:text-gray-300",
                "hover:bg-white/50 dark:hover:bg-gray-700/50",
                "active:bg-white/75 dark:active:bg-gray-700/75"
              )}
            >
              <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 shadow-inner">
        <div className="container mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;