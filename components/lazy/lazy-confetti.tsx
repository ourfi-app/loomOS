
'use client';

import dynamic from 'next/dynamic';

// Lazy load confetti library
export const useLazyConfetti = () => {
  const fireConfetti = async (options?: any) => {
    const confetti = (await import('canvas-confetti')).default;
    confetti(options);
  };

  return { fireConfetti };
};

// For component-based usage
export const LazyConfettiButton = dynamic(
  () => import('./confetti-button').then(mod => mod.ConfettiButton),
  {
    loading: () => null,
    ssr: false,
  }
);
