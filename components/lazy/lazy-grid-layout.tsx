
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load react-grid-layout
// @ts-ignore - Dynamic import type issues with React versions
export const LazyGridLayout: any = dynamic(
  // @ts-ignore
  () => import('react-grid-layout').then(mod => ({ default: mod.Responsive })),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    ),
    ssr: false,
  }
);

// @ts-ignore - Dynamic import type issues with React versions
export const LazyWidthProvider: any = dynamic(
  // @ts-ignore
  () => import('react-grid-layout').then(mod => ({ default: mod.WidthProvider })),
  {
    loading: () => null,
    ssr: false,
  }
);
