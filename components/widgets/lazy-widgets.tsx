
/**
 * Lazy-loaded Widget Components
 * Implements code splitting for better initial load performance
 */

import { Suspense, ComponentType } from 'react';
import { lazyWithRetry } from '@/lib/performance-utils';
import { Card } from '@/components/ui/card';

// Lazy load optimized task widget
export const LazyTasksWidget = lazyWithRetry(() => 
  import('./optimized-task-widget')
);

// Widget loading skeleton
function WidgetSkeleton() {
  return (
    <Card className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    </Card>
  );
}

// Higher-order component to wrap lazy widgets with Suspense
function withSuspense<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return (props: P) => (
    <Suspense fallback={<WidgetSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}

// Export optimized tasks widget wrapped with Suspense
export const OptimizedTasksWidgetLazy = withSuspense(LazyTasksWidget);

// Re-export for compatibility
export { WidgetSkeleton };
