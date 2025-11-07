
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

// Lazy load Chart.js components
export const LazyLineChart = dynamic(
  () => import('react-chartjs-2').then(mod => ({ default: mod.Line })),
  {
    loading: () => (
      <Card className="w-full h-64 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </Card>
    ),
    ssr: false,
  }
);

export const LazyBarChart = dynamic(
  () => import('react-chartjs-2').then(mod => ({ default: mod.Bar })),
  {
    loading: () => (
      <Card className="w-full h-64 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </Card>
    ),
    ssr: false,
  }
);

export const LazyPieChart = dynamic(
  () => import('react-chartjs-2').then(mod => ({ default: mod.Pie })),
  {
    loading: () => (
      <Card className="w-full h-64 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </Card>
    ),
    ssr: false,
  }
);

export const LazyDoughnutChart = dynamic(
  () => import('react-chartjs-2').then(mod => ({ default: mod.Doughnut })),
  {
    loading: () => (
      <Card className="w-full h-64 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </Card>
    ),
    ssr: false,
  }
);

// Export Chart.js registration helper
export const registerChartElements = async () => {
  const { Chart, registerables } = await import('chart.js');
  Chart.register(...registerables);
};
