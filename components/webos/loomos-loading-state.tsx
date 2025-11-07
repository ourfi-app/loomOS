
'use client';

import { cn } from '@/lib/utils';

interface LoomOSLoadingStateProps {
  message?: string;
  className?: string;
}

export function LoomOSLoadingState({ message = 'Loading...', className }: LoomOSLoadingStateProps) {
  return (
    <div className={cn('loomos-loading-state', className)}>
      <div className="loomos-spinner w-8 h-8 border-4" />
      {message && <div>{message}</div>}
    </div>
  );
}

interface LoomOSSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function LoomOSSkeleton({ className, width, height }: LoomOSSkeletonProps) {
  return (
    <div
      className={cn('loomos-skeleton', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

export function LoomOSListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="loomos-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="loomos-list-item">
          <LoomOSSkeleton width={40} height={40} className="rounded-full mr-3" />
          <div className="flex-1 space-y-2">
            <LoomOSSkeleton width="60%" height={16} />
            <LoomOSSkeleton width="80%" height={14} />
          </div>
          <LoomOSSkeleton width={60} height={12} />
        </div>
      ))}
    </div>
  );
}
