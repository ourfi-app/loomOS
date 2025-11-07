/**
 * Centralized dynamic imports for heavy libraries
 *
 * This file provides lazy-loaded wrappers for large dependencies to reduce
 * initial bundle size and improve page load performance.
 *
 * Benefits:
 * - Reduces initial JavaScript bundle size
 * - Libraries are only loaded when actually needed
 * - Better code splitting and caching
 * - Improved Time to Interactive (TTI) metrics
 *
 * Optimization Strategy:
 * 1. Framer Motion: Using LazyMotion (see components/providers/motion-provider.tsx)
 *    - ~90 KB saved from initial bundle
 *    - Features loaded on first animation
 * 2. Mapbox GL: Dynamic import (~500 KB saved)
 * 3. Plotly.js: Using basic distribution (~4.2 MB saved)
 * 4. Chart.js, Recharts: Dynamic imports when needed
 * 5. Admin Features: Route-based code splitting (~200-300 KB saved for non-admins)
 * 6. Tree-shaking: Automatic via modularizeImports in next.config.js
 *    - lodash: Already using individual imports (e.g., lodash/debounce)
 *    - date-fns: Already using individual imports (e.g., date-fns/format)
 *    - Radix UI: Proper tree-shaking configured
 *
 * Total bundle savings: ~5.1-5.2 MB from initial load
 *
 * Best Practices:
 * - Always import specific functions: import { format } from 'date-fns'
 * - Avoid barrel imports: import * as _ from 'lodash' ❌
 * - Use dynamic imports for admin/heavy features
 * - Let Next.js automatically split routes
 */

import dynamic from 'next/dynamic';

/**
 * Mapbox GL - Interactive maps (~500 KB)
 * Used in: Property Map admin feature
 *
 * Usage:
 * const DynamicMapboxMap = DynamicMapbox;
 * <DynamicMapboxMap {...props} />
 */
export const DynamicMapbox = dynamic(
  () => import('@/components/maps/MapboxMap'),
  {
    ssr: false, // Maps don't work with SSR
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

/**
 * Plotly.js - Advanced charting (~800 KB for basic distribution)
 *
 * OPTIMIZED: Using plotly.js-basic-dist instead of full plotly.js
 * - Full version: ~5 MB (includes all chart types, 3D, maps, etc.)
 * - Basic version: ~800 KB (scatter, bar, pie, line charts)
 * - Savings: ~4.2 MB
 *
 * The webpack alias in next.config.js automatically redirects plotly.js imports
 * to plotly.js-basic-dist, so existing code continues to work.
 *
 * Usage:
 * const DynamicPlot = DynamicPlotly;
 * <DynamicPlot data={data} layout={layout} />
 *
 * Supported chart types in basic distribution:
 * - scatter, scattergl, bar, pie, histogram
 * - box, violin, heatmap, contour
 *
 * NOT included (use recharts or chart.js if needed):
 * - 3D charts, maps, sankey, treemap, sunburst, etc.
 */
export const DynamicPlotly = dynamic(
  () => import('@/components/lazy/lazy-plotly'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        </div>
      </div>
    ),
  }
);

/**
 * Chart.js with react-chartjs-2 - Charting library (~200 KB)
 *
 * Usage:
 * const { Line, Bar, Pie } = await import('react-chartjs-2');
 * Or use this helper for individual components
 */
export const DynamicLineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    ),
  }
);

export const DynamicBarChart = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    ),
  }
);

export const DynamicPieChart = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Pie),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    ),
  }
);

/**
 * Recharts - Alternative charting library (~400 KB)
 *
 * Usage example:
 * const { LineChart, BarChart, PieChart } = await import('recharts');
 */
export const DynamicRechartsLine = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false, loading: () => <div className="w-full h-64 bg-gray-50 rounded-lg animate-pulse" /> }
);

export const DynamicRechartsBar = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false, loading: () => <div className="w-full h-64 bg-gray-50 rounded-lg animate-pulse" /> }
);

/**
 * React Grid Layout - Draggable grid system (~100 KB)
 * Used for dashboard layouts
 */
// @ts-ignore - Dynamic import type issues with React versions
export const DynamicGridLayout = dynamic(
  // @ts-ignore
  () => import('react-grid-layout'),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-50 rounded-lg animate-pulse" />,
  }
);

/**
 * Canvas Confetti - Celebration effects (~30 KB)
 * Already has a lazy component wrapper
 */
export const DynamicConfetti = dynamic(
  () => import('@/components/lazy/confetti-button'),
  {
    ssr: false,
  }
);

/**
 * Heavy Admin Components
 * These are admin-only features that don't need to be in the main bundle
 */
export const DynamicPropertyMap = dynamic(
  () => import('@/app/dashboard/admin/property-map/page'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

/**
 * PDF Generation/Viewing (if added in future)
 * @example
 * export const DynamicPDFViewer = dynamic(
 *   () => import('react-pdf'),
 *   { ssr: false, loading: () => <div>Loading PDF viewer...</div> }
 * );
 */
