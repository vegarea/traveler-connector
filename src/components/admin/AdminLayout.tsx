import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, Users, Activity, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Configuración",
      path: "/admin",
      icon: Settings,
    },
    {
      title: "Perfiles",
      path: "/admin/travelbuddys/profiles",
      icon: Users,
    },
    {
      title: "Actividad",
      path: "/admin/travelbuddys/activity",
      icon: Activity,
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar">
        <nav className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Panel Admin</h2>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "active:bg-sidebar-accent/80",
                  location.pathname === item.path 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          
          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 rounded-md transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "active:bg-sidebar-accent/80",
                "text-sidebar-foreground"
              )}
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;