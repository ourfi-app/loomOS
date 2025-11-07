
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoomOSEmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function LoomOSEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: LoomOSEmptyStateProps) {
  return (
    <div className={cn('loomos-empty-state', className)}>
      <div className="loomos-empty-state-icon">{icon}</div>
      <div className="loomos-empty-state-title">{title}</div>
      {description && (
        <div className="loomos-empty-state-description">{description}</div>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
