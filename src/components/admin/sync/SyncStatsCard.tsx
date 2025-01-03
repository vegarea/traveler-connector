import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchSyncStats = async () => {
  const { data: total, error: totalError } = await supabase
    .from('sync_logs')
    .select('*', { count: 'exact' });

  const { data: successful, error: successError } = await supabase
    .from('sync_logs')
    .select('*', { count: 'exact' })
    .eq('status', 'success');

  const { data: latest, error: latestError } = await supabase
    .from('sync_logs')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (totalError || successError || latestError) throw new Error('Error fetching stats');

  return {
    total: total?.length || 0,
    successful: successful?.length || 0,
    latestSync: latest?.created_at,
  };
};

export const SyncStatsCard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['sync_stats'],
    queryFn: fetchSyncStats,
    refetchInterval: 5000,
  });

  const successRate = stats 
    ? ((stats.successful / stats.total) * 100).toFixed(1)
    : '0';

  const timeSinceLastSync = stats?.latestSync
    ? Math.round((Date.now() - new Date(stats.latestSync).getTime()) / 60000)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de sincronización</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <div className="text-sm text-muted-foreground">
              Sincronizaciones totales
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">
              {timeSinceLastSync} min
            </div>
            <div className="text-sm text-muted-foreground">
              Última sincronización
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="text-sm text-muted-foreground">
              Tasa de éxito
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};