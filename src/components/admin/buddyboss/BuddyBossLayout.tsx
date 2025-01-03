import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuddyBossConfigForm } from './BuddyBossConfigForm';
import { Card } from "@/components/ui/card";
import TravelGroups from '@/components/TravelGroups';

const BuddyBossLayout = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">BuddyBoss</h1>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <BuddyBossConfigForm />
        </TabsContent>

        <TabsContent value="groups">
          <Card className="p-6">
            <TravelGroups />
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="p-6">
            <p className="text-muted-foreground">
              Lista de miembros próximamente...
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-6">
            <p className="text-muted-foreground">
              Feed de actividad próximamente...
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuddyBossLayout;