import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <div className="p-4 border-t bg-gradient-to-br from-[#F4007A]/5 to-[#F4007A]/5 dark:from-gray-800 dark:to-gray-900">
      <button
        onClick={onLogout}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          "text-gray-600 dark:text-gray-300",
          "hover:bg-white/50 dark:hover:bg-gray-700/50",
          "active:bg-white/75 dark:active:bg-gray-700/75"
        )}
      >
        <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};