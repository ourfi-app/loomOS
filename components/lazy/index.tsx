
/**
 * Lazy-Loaded Components
 * 
 * Heavy components that should be loaded on-demand to reduce initial bundle size.
 * All components are loaded with Next.js dynamic import and include loading states.
 */

import { lazyLoad } from '@/lib/performance-utils';
import { LoadingSpinner } from '@/components/webos/shared';

// Heavy visualization components
export const LazyChart = lazyLoad(
  () => import('@/components/dashboard/chart'),
  {
    loading: <LoadingSpinner size="lg" text="Loading chart..." />,
    ssr: false, // Charts often use browser APIs
  }
);

// Rich text editor (heavy dependency)
export const LazyRichTextEditor = lazyLoad(
  () => import('@/components/common/rich-text-editor'),
  {
    loading: <LoadingSpinner size="md" text="Loading editor..." />,
    ssr: false,
  }
);

// Map components (mapbox-gl is large)
export const LazyMapView = lazyLoad(
  () => import('@/components/maps/map-view'),
  {
    loading: <LoadingSpinner size="lg" text="Loading map..." />,
    ssr: false,
  }
);

// Calendar/scheduling components
export const LazyCalendar = lazyLoad(
  () => import('@/components/calendar/calendar-view'),
  {
    loading: <LoadingSpinner size="md" text="Loading calendar..." />,
    ssr: false,
  }
);

// AI/Chat components (potentially heavy)
export const LazyAIAssistant = lazyLoad(
  () => import('@/components/webos/ai-assistant'),
  {
    loading: <LoadingSpinner size="md" text="Initializing assistant..." />,
    ssr: false,
  }
);

// Document viewer
export const LazyDocumentViewer = lazyLoad(
  () => import('@/components/documents/document-viewer'),
  {
    loading: <LoadingSpinner size="lg" text="Loading document..." />,
    ssr: false,
  }
);

// Image editor/cropper
export const LazyImageEditor = lazyLoad(
  () => import('@/components/common/image-editor'),
  {
    loading: <LoadingSpinner size="md" text="Loading editor..." />,
    ssr: false,
  }
);

// Web builder (heavy Craft.js dependency)
export const LazyWebBuilder = lazyLoad(
  () => import('@/components/web-builder/web-builder-editor'),
  {
    loading: <LoadingSpinner size="lg" text="Loading builder..." />,
    ssr: false,
  }
);
