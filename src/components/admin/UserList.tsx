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
  user_roles: { role: 'admin' | 'user' }[];
}

export const UserList = () => {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles:user_roles(role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as User[];
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
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Email Verificado</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Último acceso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(user.account_status)}>
                    <span className="flex items-center gap-1">
                      {user.account_status === 'active' ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {user.account_status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.email_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Mail className="h-4 w-4 text-yellow-500" />
                  )}
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.user_roles?.[0]?.role || 'user')}
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {user.last_login_date
                    ? format(new Date(user.last_login_date), 'dd/MM/yyyy HH:mm')
                    : 'Nunca'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};