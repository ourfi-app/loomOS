/**
 * @deprecated This component is deprecated. Use UnifiedSectionHeader from '@/components/common/unified-section-header' instead.
 * This file now re-exports from the unified component for backward compatibility.
 * 
 * Migration:
 * ```
 * // Before
 * import { LoomOSSectionHeader } from '@/components/webos/loomos-section-header';
 * 
 * // After
 * import { UnifiedSectionHeader } from '@/components/common/unified-section-header';
 * <UnifiedSectionHeader variant="loomos" ... />
 * // Or use the exported alias:
 * import { LoomOSSectionHeader } from '@/components/common/unified-section-header';
 * ```
 */

'use client';

import { useEffect } from 'react';
import { LoomOSSectionHeader as UnifiedLoomOSSectionHeader } from '@/components/common/unified-section-header';

interface LoomOSSectionHeaderProps {
  title: string;
  className?: string;
}

export function LoomOSSectionHeader(props: LoomOSSectionHeaderProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[DEPRECATED] LoomOSSectionHeader from @/components/webos/loomos-section-header is deprecated. ' +
        'Please use UnifiedSectionHeader from @/components/common/unified-section-header with variant="loomos" instead.'
      );
    }
  }, []);

  return <UnifiedLoomOSSectionHeader {...props} />;
}
