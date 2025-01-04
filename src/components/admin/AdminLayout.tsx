import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UserCircle, 
  Users2, 
  Activity,
  LogOut,
  Palette 
} from 'lucide-react';
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <nav className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Panel Admin</h2>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.path} className="space-y-1">
                <Link
                  to={item.submenu ? '#' : item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors w-full",
                    "hover:bg-accent hover:text-accent-foreground",
                    "active:bg-accent/80",
                    isActiveRoute(item.path) 
                      ? "bg-accent text-accent-foreground" 
                      : "text-foreground"
                  )}
                  onClick={(e) => {
                    if (item.submenu) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>

                {item.submenu && (
                  <div className="ml-4 pl-4 border-l space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md transition-colors w-full text-sm",
                          "hover:bg-accent hover:text-accent-foreground",
                          "active:bg-accent/80",
                          isActiveSubmenuItem(subItem.path)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "active:bg-accent/80",
                "text-foreground"
              )}
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;