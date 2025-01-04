import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { MenuItem } from './types';

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  isActiveSubmenuItem: (path: string) => boolean;
}

export const SidebarMenuItem = ({ item, isActive, isActiveSubmenuItem }: SidebarMenuItemProps) => {
  return (
    <div className="space-y-1">
      <Link
        to={item.submenu ? '#' : item.path}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          "hover:bg-gradient-to-r hover:from-[#F4007A]/10 hover:to-[#F4007A]/5",
          "group relative",
          isActive 
            ? "bg-gradient-to-r from-[#F4007A]/20 to-[#F4007A]/10 text-[#F4007A] dark:text-white font-medium shadow-sm" 
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
          isActive 
            ? "text-[#F4007A] dark:text-white" 
            : "text-gray-500 dark:text-gray-400 group-hover:text-[#F4007A] dark:group-hover:text-white"
        )} />
        <span className="flex-1">{item.title}</span>
        {item.submenu && (
          <ChevronDown className="w-4 h-4" />
        )}
      </Link>

      {item.submenu && (
        <div className="ml-4 pl-4 border-l border-[#F4007A]/20 dark:border-gray-700 space-y-1">
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                "text-sm hover:bg-gradient-to-r hover:from-[#F4007A]/10 hover:to-[#F4007A]/5",
                "group",
                isActiveSubmenuItem(subItem.path)
                  ? "bg-gradient-to-r from-[#F4007A]/20 to-[#F4007A]/10 text-[#F4007A] dark:text-white font-medium shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <subItem.icon className={cn(
                "w-4 h-4",
                isActiveSubmenuItem(subItem.path)
                  ? "text-[#F4007A] dark:text-white"
                  : "text-gray-400 dark:text-gray-500 group-hover:text-[#F4007A] dark:group-hover:text-white"
              )} />
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};