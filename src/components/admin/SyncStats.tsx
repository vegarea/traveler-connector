import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SyncStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de sincronización</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-muted-foreground">Usuarios sincronizados</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">5 min</div>
              <div className="text-sm text-muted-foreground">Última sincronización</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">Tasa de éxito</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};