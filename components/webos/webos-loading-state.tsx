
'use client';

import { cn } from '@/lib/utils';

interface WebOSLoadingStateProps {
  message?: string;
  className?: string;
}

export function WebOSLoadingState({ message = 'Loading...', className }: WebOSLoadingStateProps) {
  return (
    <div className={cn('webos-loading-state', className)}>
      <div className="webos-spinner w-8 h-8 border-4" />
      {message && <div>{message}</div>}
    </div>
  );
}

interface WebOSSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function WebOSSkeleton({ className, width, height }: WebOSSkeletonProps) {
  return (
    <div
      className={cn('webos-skeleton', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

export function WebOSListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="webos-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="webos-list-item">
          <WebOSSkeleton width={40} height={40} className="rounded-full mr-3" />
          <div className="flex-1 space-y-2">
            <WebOSSkeleton width="60%" height={16} />
            <WebOSSkeleton width="80%" height={14} />
          </div>
          <WebOSSkeleton width={60} height={12} />
        </div>
      ))}
    </div>
  );
}
