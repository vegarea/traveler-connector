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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const UserMetaList = () => {
  const { data: userMeta, isLoading } = useQuery({
    queryKey: ['user-meta'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_meta')
        .select(`
          *,
          users (
            username,
            email
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadatos de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Clave</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Última actualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userMeta?.map((meta) => (
              <TableRow key={meta.id}>
                <TableCell>{meta.users?.username}</TableCell>
                <TableCell>{meta.meta_key}</TableCell>
                <TableCell>{meta.meta_value}</TableCell>
                <TableCell>
                  {new Date(meta.updated_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};