import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { MenuItem } from './types';

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  isActiveSubmenuItem: (path: string) => boolean;
  isCollapsed: boolean;
}

export const SidebarMenuItem = ({ 
  item, 
  isActive, 
  isActiveSubmenuItem,
  isCollapsed 
}: SidebarMenuItemProps) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isActive);

  return (
    <div className="space-y-1">
      <Link
        to={item.submenu ? '#' : item.path}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          "hover:bg-slate-50 active:bg-slate-100",
          "group relative",
          isActive && "bg-[#F4007A]/5 text-[#F4007A] font-medium shadow-sm"
        )}
        onClick={(e) => {
          if (item.submenu) {
            e.preventDefault();
            setIsSubmenuOpen(!isSubmenuOpen);
          }
        }}
      >
        <item.icon className={cn(
          "w-5 h-5 transition-colors",
          isActive 
            ? "text-[#F4007A]" 
            : "text-slate-500 group-hover:text-slate-800"
        )} />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-slate-700 group-hover:text-slate-900">{item.title}</span>
            {item.submenu && (
              <ChevronDown className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-200",
                isSubmenuOpen && "rotate-180"
              )} />
            )}
          </>
        )}
      </Link>

      {!isCollapsed && item.submenu && isSubmenuOpen && (
        <div className="ml-4 pl-4 border-l border-slate-200 space-y-1">
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                "text-sm hover:bg-slate-50 active:bg-slate-100",
                "group",
                isActiveSubmenuItem(subItem.path) && 
                "bg-[#F4007A]/5 text-[#F4007A] font-medium shadow-sm"
              )}
            >
              <subItem.icon className={cn(
                "w-4 h-4",
                isActiveSubmenuItem(subItem.path)
                  ? "text-[#F4007A]"
                  : "text-slate-500 group-hover:text-slate-800"
              )} />
              <span className="text-slate-700 group-hover:text-slate-900">{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};