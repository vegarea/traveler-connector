import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  submenu?: MenuItem[];
}

export interface LogoConfig {
  url: string;
  alt_text?: string;
}