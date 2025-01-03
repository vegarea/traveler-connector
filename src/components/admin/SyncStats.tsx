import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SyncStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['sync-stats'],
    queryFn: async () => {
      const [metaCount, userCount, lastSync] = await Promise.all([
        supabase
          .from('user_meta')
          .select('*', { count: 'exact', head: true })
          .then(({ count }) => count),
        supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .then(({ count }) => count),
        supabase
          .from('sync_logs')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
          .then(({ data }) => data?.created_at)
      ]);

      return {
        metaCount: metaCount || 0,
        userCount: userCount || 0,
        lastSync: lastSync ? new Date(lastSync).toLocaleString() : 'Nunca'
      };
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de sincronización</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{stats?.metaCount || 0}</div>
              <div className="text-sm text-muted-foreground">Metadatos sincronizados</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{stats?.userCount || 0}</div>
              <div className="text-sm text-muted-foreground">Usuarios registrados</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{stats?.lastSync || 'Nunca'}</div>
              <div className="text-sm text-muted-foreground">Última sincronización</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};