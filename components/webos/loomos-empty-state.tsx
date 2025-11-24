/**
 * @deprecated This component is deprecated. Use UnifiedEmptyState from '@/components/common/unified-empty-state' instead.
 * This file now re-exports from the unified component for backward compatibility.
 * 
 * Migration:
 * ```
 * // Before
 * import { LoomOSEmptyState } from '@/components/webos/loomos-empty-state';
 * 
 * // After
 * import { UnifiedEmptyState } from '@/components/common/unified-empty-state';
 * <UnifiedEmptyState variant="loomos" ... />
 * // Or use the exported alias:
 * import { LoomOSEmptyState } from '@/components/common/unified-empty-state';
 * ```
 */

'use client';

import { useEffect } from 'react';
import { LoomOSEmptyState as UnifiedLoomOSEmptyState } from '@/components/common/unified-empty-state';
import { ReactNode } from 'react';

interface LoomOSEmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function LoomOSEmptyState(props: LoomOSEmptyStateProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[DEPRECATED] LoomOSEmptyState from @/components/webos/loomos-empty-state is deprecated. ' +
        'Please use UnifiedEmptyState from @/components/common/unified-empty-state with variant="loomos" instead.'
      );
    }
  }, []);

  return <UnifiedLoomOSEmptyState {...props} />;
}
