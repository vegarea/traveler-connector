import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  headerLogo: { url: string; alt_text?: string } | null;
}

export const SidebarHeader = ({ headerLogo }: SidebarHeaderProps) => {
  return (
    <div className="p-6 border-b bg-gradient-to-br from-[#F4007A]/10 to-[#F4007A]/5 dark:from-gray-800 dark:to-gray-900">
      {headerLogo ? (
        <img 
          src={headerLogo.url} 
          alt={headerLogo.alt_text || "Logo"} 
          className="h-8 object-contain"
        />
      ) : (
        <h2 className="text-xl font-semibold bg-gradient-to-r from-[#F4007A] to-[#F4007A]/80 bg-clip-text text-transparent">
          Panel Admin
        </h2>
      )}
    </div>
  );
};