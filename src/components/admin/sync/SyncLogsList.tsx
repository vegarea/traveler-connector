import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetchSyncLogs = async () => {
  const { data, error } = await supabase
    .from('sync_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

export const SyncLogsList = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['sync_logs'],
    queryFn: fetchSyncLogs,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  if (isLoading) return <div>Cargando registros...</div>;

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.event_type}</TableCell>
              <TableCell>{log.source}</TableCell>
              <TableCell>
                <Badge 
                  variant={log.status === 'success' ? 'success' : 'destructive'}
                >
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(log.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};