import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  onLogout: () => void;
  isCollapsed: boolean;
}

export const LogoutButton = ({ onLogout, isCollapsed }: LogoutButtonProps) => {
  return (
    <div className="p-4 border-t border-sidebar-border bg-gradient-to-br from-[#F4007A]/5 to-transparent">
      <button
        onClick={onLogout}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-sidebar-accent/50 active:bg-sidebar-accent"
        )}
      >
        <LogOut className="w-5 h-5" />
        {!isCollapsed && <span>Cerrar sesión</span>}
      </button>
    </div>
  );
};