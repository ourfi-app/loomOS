
'use client';

import { cn } from '@/lib/utils';

// Base Skeleton Component with shimmer effect
export function Skeleton({ 
  className, 
  variant = 'default' 
}: { 
  className?: string;
  variant?: 'default' | 'shimmer';
}) {
  return (
    <div 
      className={cn(
        "bg-muted rounded-md",
        variant === 'shimmer' && "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )} 
    />
  );
}

// Card Skeleton - for list items
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-4 space-y-3", className)}>
      <div className="flex items-start gap-3">
        <Skeleton variant="shimmer" className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="shimmer" className="h-4 w-3/4" />
          <Skeleton variant="shimmer" className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton variant="shimmer" className="h-3 w-full" />
      <Skeleton variant="shimmer" className="h-3 w-2/3" />
    </div>
  );
}

// List Item Skeleton - for compact lists
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 p-3", className)}>
      <Skeleton variant="shimmer" className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="shimmer" className="h-4 w-1/3" />
        <Skeleton variant="shimmer" className="h-3 w-1/2" />
      </div>
      <Skeleton variant="shimmer" className="h-3 w-16" />
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton 
          key={i}
          variant="shimmer" 
          className={cn(
            "h-4",
            i === 0 ? "w-1/4" : i === columns - 1 ? "w-20" : "flex-1"
          )} 
        />
      ))}
    </div>
  );
}

// Message List Skeleton
export function MessageListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4 hover:bg-muted/5 rounded-lg border-b border-border/50 last:border-0">
          <Skeleton variant="shimmer" className="w-10 h-10 rounded-full flex-shrink-0 mt-1" />
          <div className="flex-1 space-y-2 py-1">
            <div className="flex items-center justify-between">
              <Skeleton variant="shimmer" className="h-4 w-32" />
              <Skeleton variant="shimmer" className="h-3 w-16" />
            </div>
            <Skeleton variant="shimmer" className="h-4 w-3/4" />
            <Skeleton variant="shimmer" className="h-3 w-full" />
            <Skeleton variant="shimmer" className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Calendar Skeleton
export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton variant="shimmer" className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton variant="shimmer" className="h-9 w-24" />
          <Skeleton variant="shimmer" className="h-9 w-24" />
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-square p-2 border border-border rounded-lg">
            <Skeleton variant="shimmer" className="h-5 w-5 mb-2" />
            <Skeleton variant="shimmer" className="h-2 w-full mb-1" />
            <Skeleton variant="shimmer" className="h-2 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Document Grid Skeleton
export function DocumentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
          <Skeleton variant="shimmer" className="h-32 w-full rounded-lg" />
          <Skeleton variant="shimmer" className="h-4 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton variant="shimmer" className="h-3 w-20" />
            <Skeleton variant="shimmer" className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Task List Skeleton
export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton variant="shimmer" className="w-5 h-5 rounded flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="shimmer" className="h-4 w-3/4" />
              <Skeleton variant="shimmer" className="h-3 w-full" />
              <div className="flex gap-2">
                <Skeleton variant="shimmer" className="h-6 w-16 rounded-full" />
                <Skeleton variant="shimmer" className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Directory Card Skeleton
export function DirectoryCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <Skeleton variant="shimmer" className="w-20 h-20 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton variant="shimmer" className="h-5 w-32 mx-auto" />
              <Skeleton variant="shimmer" className="h-4 w-24 mx-auto" />
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-border">
            <Skeleton variant="shimmer" className="h-3 w-full" />
            <Skeleton variant="shimmer" className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton variant="shimmer" className="h-4 w-24" />
            <Skeleton variant="shimmer" className="w-10 h-10 rounded-lg" />
          </div>
          <Skeleton variant="shimmer" className="h-8 w-20" />
          <Skeleton variant="shimmer" className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

// Generic Page Skeleton with header and content
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton variant="shimmer" className="h-10 w-64" />
        <div className="flex gap-3">
          <Skeleton variant="shimmer" className="h-10 w-32" />
          <Skeleton variant="shimmer" className="h-10 w-32" />
        </div>
      </div>
      
      {/* Stats */}
      <StatsCardSkeleton count={4} />
      
      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
