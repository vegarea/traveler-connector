import React from 'react';
import { SyncStats } from "../SyncStats";
import { SyncLogsList } from "./SyncLogsList";
import { UserMetaList } from "../UserMetaList";

export const SyncDashboard = () => {
  return (
    <div className="space-y-6">
      <SyncStats />
      <UserMetaList />
      <SyncLogsList />
    </div>
  );
};