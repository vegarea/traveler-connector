import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Mail, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface UserRole {
  role: 'admin' | 'user';
}

interface User {
  id: string;
  wordpress_user_id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_login_date: string | null;
  account_status: string;
  email_verified: boolean;
  user_roles: UserRole[];
}

export const UserList = () => {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      return data as User[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getRoleBadge = (role: 'admin' | 'user') => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      default:
        return <Badge variant="secondary">Usuario</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="px-6 py-5">
        <CardTitle className="text-2xl font-bold">Lista de Usuarios</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px] py-4">Usuario</TableHead>
                <TableHead className="w-[250px]">Email</TableHead>
                <TableHead className="w-[150px]">Estado</TableHead>
                <TableHead className="w-[150px]">Email Verificado</TableHead>
                <TableHead className="w-[120px]">Rol</TableHead>
                <TableHead className="w-[120px]">Registro</TableHead>
                <TableHead className="w-[180px]">Último acceso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10">
                          {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.account_status)} className="px-2 py-1">
                      <span className="flex items-center gap-1">
                        {user.account_status === 'active' ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                        {user.account_status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.email_verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Mail className="h-5 w-5 text-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.user_roles?.[0]?.role || 'user')}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(user.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.last_login_date
                      ? format(new Date(user.last_login_date), 'dd/MM/yyyy HH:mm')
                      : 'Nunca'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};