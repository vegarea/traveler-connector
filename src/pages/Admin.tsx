import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { WordPressConfigForm } from "@/components/admin/WordPressConfigForm";
import { PermissionsCheck } from "@/components/admin/permissions/PermissionsCheck";
import { SyncDashboard } from "@/components/admin/sync/SyncDashboard";
import { WordPressUserProfile } from "@/components/admin/wordpress/WordPressUserProfile";

const Admin = () => {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        
        <WordPressUserProfile />
        
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
              <PermissionsCheck />
            </div>
          </TabsContent>

          <TabsContent value="sync">
            <SyncDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;