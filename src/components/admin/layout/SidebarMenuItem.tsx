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
          "hover:bg-sidebar-accent/50 active:bg-sidebar-accent",
          "group relative",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
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
            : "text-muted-foreground group-hover:text-foreground"
        )} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.submenu && (
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                isSubmenuOpen && "rotate-180"
              )} />
            )}
          </>
        )}
      </Link>

      {!isCollapsed && item.submenu && isSubmenuOpen && (
        <div className="ml-4 pl-4 border-l border-sidebar-border space-y-1">
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                "text-sm hover:bg-sidebar-accent/50 active:bg-sidebar-accent",
                "group",
                isActiveSubmenuItem(subItem.path) && 
                "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              <subItem.icon className={cn(
                "w-4 h-4",
                isActiveSubmenuItem(subItem.path)
                  ? "text-[#F4007A]"
                  : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};