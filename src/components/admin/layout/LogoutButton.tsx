import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface LogoutButtonProps {
  onLogout?: () => void;
  isCollapsed: boolean;
}

export const LogoutButton = ({ onLogout, isCollapsed }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      if (onLogout) {
        onLogout();
      }
      navigate('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
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