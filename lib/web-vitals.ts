// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

/**
 * Web Vitals Monitoring
 * Track and report Core Web Vitals metrics
 */

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  delta: number;
}

export interface WebVitalsReport {
  CLS?: WebVitalMetric;
  FCP?: WebVitalMetric;
  LCP?: WebVitalMetric;
  TTFB?: WebVitalMetric;
  INP?: WebVitalMetric;
}

// Thresholds for Web Vitals (in milliseconds for timing metrics)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

/**
 * Get rating for a metric value
 */
function getRating(metricName: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals(onReport?: (metric: WebVitalMetric) => void) {
  if (typeof window === 'undefined') return;

  // Dynamically import web-vitals library if available
  import('web-vitals')
    .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      const handleMetric = (metric: any) => {
        const vitalMetric: WebVitalMetric = {
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
          id: metric.id,
          delta: metric.delta,
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
        }

        // Call custom report handler
        if (onReport) {
          onReport(vitalMetric);
        }

        // Send to analytics (if configured)
        sendToAnalytics(vitalMetric);
      };

      onCLS(handleMetric);
      onFCP(handleMetric);
      onLCP(handleMetric);
      onTTFB(handleMetric);
      onINP(handleMetric); // INP replaces FID in newer versions
    })
    .catch((error) => {
      console.warn('[Web Vitals] Library not available:', error);
    });
}

/**
 * Send metrics to analytics
 */
function sendToAnalytics(metric: WebVitalMetric) {
  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      metric_rating: metric.rating,
    });
  }

  // Send to custom analytics endpoint
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch((error) => {
      console.warn('[Web Vitals] Failed to send to analytics:', error);
    });
  }
}

/**
 * Get current Web Vitals scores
 */
export async function getCurrentWebVitals(): Promise<WebVitalsReport> {
  if (typeof window === 'undefined') return {};

  const report: WebVitalsReport = {};

  try {
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

    await Promise.all([
      new Promise<void>((resolve) => onCLS((metric) => { 
        report.CLS = {
          name: metric.name,
          value: metric.value,
          rating: getRating('CLS', metric.value),
          id: metric.id,
          delta: metric.delta,
        };
        resolve();
      })),
      new Promise<void>((resolve) => onFCP((metric) => { 
        report.FCP = {
          name: metric.name,
          value: metric.value,
          rating: getRating('FCP', metric.value),
          id: metric.id,
          delta: metric.delta,
        };
        resolve();
      })),
      new Promise<void>((resolve) => onLCP((metric) => { 
        report.LCP = {
          name: metric.name,
          value: metric.value,
          rating: getRating('LCP', metric.value),
          id: metric.id,
          delta: metric.delta,
        };
        resolve();
      })),
      new Promise<void>((resolve) => onTTFB((metric) => { 
        report.TTFB = {
          name: metric.name,
          value: metric.value,
          rating: getRating('TTFB', metric.value),
          id: metric.id,
          delta: metric.delta,
        };
        resolve();
      })),
      new Promise<void>((resolve) => onINP((metric) => { 
        report.INP = {
          name: metric.name,
          value: metric.value,
          rating: getRating('INP', metric.value),
          id: metric.id,
          delta: metric.delta,
        };
        resolve();
      })),
    ]);
  } catch (error) {
    console.warn('[Web Vitals] Error getting metrics:', error);
  }

  return report;
}

/**
 * Performance Observer for custom metrics
 */
export class PerformanceMonitor {
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initObservers();
    }
  }

  private initObservers() {
    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('[Performance] Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      // Long task observer not supported
    }

    // Monitor layout shifts
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          console.warn('[Performance] Layout shift detected:', {
            value: (entry as any).value,
            sources: (entry as any).sources,
          });
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(layoutShiftObserver);
    } catch (e) {
      // Layout shift observer not supported
    }

    // Monitor resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          if (resource.duration > 1000) {
            console.warn('[Performance] Slow resource:', {
              name: resource.name,
              duration: resource.duration,
              size: resource.transferSize,
            });
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (e) {
      // Resource observer not supported
    }
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Hook for Web Vitals in React components
 */
export function useWebVitals() {
  if (typeof window === 'undefined') return null;

  const [vitals, setVitals] = React.useState<WebVitalsReport>({});

  React.useEffect(() => {
    initWebVitals((metric) => {
      setVitals((prev) => ({
        ...prev,
        [metric.name]: metric,
      }));
    });
  }, []);

  return vitals;
}

// Add React import for the hook
import * as React from 'react';
