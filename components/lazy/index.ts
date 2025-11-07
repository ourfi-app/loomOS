
/**
 * Lazy-loaded Heavy Components
 * 
 * This module exports dynamic imports for heavy libraries to reduce initial bundle size.
 * All components are loaded on-demand with appropriate loading states.
 */

// Chart components
export {
  LazyLineChart,
  LazyBarChart,
  LazyPieChart,
  LazyDoughnutChart,
  registerChartElements,
} from './lazy-chart';

// Plotly components
export { default as LazyPlot } from './lazy-plotly';

// Confetti effects
export { useLazyConfetti, LazyConfettiButton } from './lazy-confetti';

// Grid layout
export { LazyGridLayout, LazyWidthProvider } from './lazy-grid-layout';

// Additional lazy utilities
export const lazyImports = {
  // Date utilities
  dateFns: () => import('date-fns'),
  dayjs: () => import('dayjs'),
  
  // Form libraries
  reactHookForm: () => import('react-hook-form'),
  yup: () => import('yup'),
  zod: () => import('zod'),
  
  // AWS SDK
  s3Client: () => import('@aws-sdk/client-s3'),
  s3Presigner: () => import('@aws-sdk/s3-request-presigner'),
  
  // Stripe
  stripeJs: () => import('@stripe/stripe-js'),
  
  // Animation
  framerMotion: () => import('framer-motion'),
};
