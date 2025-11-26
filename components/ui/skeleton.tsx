/**
 * loomOS Skeleton Component
 * 
 * Loading placeholder with Phase 1C design token integration.
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-12 rounded-full" />
 * <Skeleton className="h-4 w-[250px]" />
 * ```
 */

import { cn } from '@/lib/utils';

function Skeleton({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md', className)}
      style={{
        backgroundColor: 'var(--semantic-bg-subtle)',
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };
