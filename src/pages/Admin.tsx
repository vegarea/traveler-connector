import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { WordPressConfigForm } from "@/components/admin/WordPressConfigForm";
import { ConnectionStatus } from "@/components/admin/ConnectionStatus";
import { SyncStats } from "@/components/admin/SyncStats";

const Admin = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList>
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="sync">Sincronización</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <WordPressConfigForm />
          </TabsContent>

          <TabsContent value="permissions">
            <div className="space-y-6">
              <ConnectionStatus />
            </div>
          </TabsContent>

          <TabsContent value="sync">
            <SyncStats />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;