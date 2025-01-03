import React from 'react';
import { SyncStatsCard } from './SyncStatsCard';
import { SyncLogsList } from './SyncLogsList';

export const SyncDashboard = () => {
  return (
    <div className="space-y-6">
      <SyncStatsCard />
      <SyncLogsList />
    </div>
  );
};