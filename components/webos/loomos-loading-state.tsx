/**
 * @deprecated This component is deprecated. Use unified components from '@/components/common/unified-loading-state' instead.
 * This file now re-exports from the unified component for backward compatibility.
 * 
 * Migration:
 * ```
 * // Before
 * import { LoomOSLoadingState } from '@/components/webos/loomos-loading-state';
 * 
 * // After
 * import { LoadingState } from '@/components/common/unified-loading-state';
 * <LoadingState message="Loading..." variant="loomos" />
 * ```
 */

'use client';

import { useEffect } from 'react';
import { 
  LoadingState as UnifiedLoadingState,
  LoomOSSkeleton as UnifiedLoomOSSkeleton,
  LoomOSListSkeleton as UnifiedLoomOSListSkeleton 
} from '@/components/common/unified-loading-state';

interface LoomOSLoadingStateProps {
  message?: string;
  className?: string;
}

export function LoomOSLoadingState({ message = 'Loading...', className }: LoomOSLoadingStateProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[DEPRECATED] LoomOSLoadingState is deprecated. ' +
        'Please use LoadingState from @/components/common/unified-loading-state with variant="loomos" instead.'
      );
    }
  }, []);

  return <UnifiedLoadingState message={message} className={className} variant="loomos" />;
}

// Re-export unified skeleton components
export { 
  UnifiedLoomOSSkeleton as LoomOSSkeleton,
  UnifiedLoomOSListSkeleton as LoomOSListSkeleton
};
