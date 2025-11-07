
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WebOSEmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function WebOSEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: WebOSEmptyStateProps) {
  return (
    <div className={cn('webos-empty-state', className)}>
      <div className="webos-empty-state-icon">{icon}</div>
      <div className="webos-empty-state-title">{title}</div>
      {description && (
        <div className="webos-empty-state-description">{description}</div>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
