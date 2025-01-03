import React from 'react';
import { CheckCircle2, XCircle } from "lucide-react";

interface PermissionItemProps {
  endpoint: string;
  description: string;
  isAvailable: boolean;
}

export const PermissionItem = ({ endpoint, description, isAvailable }: PermissionItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
      <div className="space-y-1">
        <p className="text-sm font-medium">{description}</p>
        <code className="text-xs text-muted-foreground">
          {endpoint}
        </code>
      </div>
      <div className="flex items-center gap-2">
        {isAvailable ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
    </div>
  );
};