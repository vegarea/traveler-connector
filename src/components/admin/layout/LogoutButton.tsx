import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  onLogout: () => void;
  isCollapsed: boolean;
}

export const LogoutButton = ({ onLogout, isCollapsed }: LogoutButtonProps) => {
  return (
    <button
      onClick={onLogout}
      className={cn(
        "flex items-center gap-3 m-4 px-4 py-3 rounded-lg transition-all duration-200",
        "text-slate-600 hover:text-slate-900",
        "bg-slate-50 hover:bg-slate-100 active:bg-slate-200",
        "border border-slate-200 shadow-sm"
      )}
    >
      <LogOut className="w-5 h-5" />
      {!isCollapsed && <span>Cerrar sesión</span>}
    </button>
  );
};