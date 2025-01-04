import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  headerLogo: { url: string; alt_text?: string } | null;
  isCollapsed: boolean;
}

export const SidebarHeader = ({ headerLogo, isCollapsed }: SidebarHeaderProps) => {
  return (
    <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-white to-slate-50">
      {headerLogo ? (
        <img 
          src={headerLogo.url} 
          alt={headerLogo.alt_text || "Logo"} 
          className={cn(
            "object-contain transition-all duration-300",
            isCollapsed ? "h-8 w-8" : "h-8"
          )}
        />
      ) : (
        <h2 className={cn(
          "font-semibold transition-all duration-300",
          "bg-gradient-to-r from-[#F4007A] to-[#F4007A]/80 bg-clip-text text-transparent",
          isCollapsed ? "text-lg" : "text-xl"
        )}>
          {isCollapsed ? "PA" : "Panel Admin"}
        </h2>
      )}
    </div>
  );
};