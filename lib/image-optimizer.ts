
/**
 * Image Optimization Utilities
 * 
 * Provides utilities for optimizing image loading and performance
 */

/**
 * Generate responsive image URLs
 */
export function getResponsiveImageUrl(
  baseUrl: string,
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
): string {
  const sizeMap = {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    original: 0,
  };

  const width = sizeMap[size];
  if (width === 0) return baseUrl;

  // If using a CDN or image optimization service, append size parameters
  return `${baseUrl}?w=${width}&q=80`;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (priority === 'high') {
    link.setAttribute('fetchpriority', 'high');
  }

  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string,
  onLoad?: () => void
) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imgElement.src = src;
            imgElement.onload = () => {
              onLoad?.();
              observer.disconnect();
            };
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(imgElement);
  } else {
    // Fallback for browsers without IntersectionObserver
    imgElement.src = src;
    if (onLoad) {
      imgElement.onload = onLoad;
    }
  }
}

/**
 * Convert image to WebP format (client-side)
 */
export async function convertToWebP(
  imageBlob: Blob
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/webp',
        0.8
      );
    };

    img.src = URL.createObjectURL(imageBlob);
  });
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'avif' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  const canvas = document.createElement('canvas');
  
  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }

  // Check AVIF support (newer format)
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }

  return 'jpeg';
}

/**
 * Calculate image dimensions for responsive loading
 */
export function calculateResponsiveDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number
): { width: number; height: number } {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }

  const ratio = originalHeight / originalWidth;
  return {
    width: maxWidth,
    height: Math.round(maxWidth * ratio),
  };
}

/**
 * Progressive image loading with blur-up effect
 */
export class ProgressiveImageLoader {
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target as HTMLElement);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );
    }
  }

  observe(element: HTMLElement) {
    if (this.observer) {
      this.observer.observe(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(element);
    }
  }

  unobserve(element: HTMLElement) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private async loadImage(element: HTMLElement) {
    const img = element.querySelector('img');
    if (!img) return;

    const fullSrc = img.dataset.src;
    const fullSrcSet = img.dataset.srcset;

    if (!fullSrc) return;

    // Load full image
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = fullSrc;
      if (fullSrcSet) {
        img.srcset = fullSrcSet;
      }
      img.classList.remove('blur');
      img.classList.add('loaded');
      this.unobserve(element);
    };

    tempImg.onerror = () => {
      img.classList.add('error');
      this.unobserve(element);
    };

    if (fullSrcSet) {
      tempImg.srcset = fullSrcSet;
    }
    tempImg.src = fullSrc;
  }
}

/**
 * Adaptive image loading based on network conditions
 */
export function getAdaptiveImageQuality(): number {
  if (typeof navigator === 'undefined') return 80;

  const connection = (navigator as any).connection;
  if (!connection) return 80;

  const effectiveType = connection.effectiveType;
  
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return 40;
    case '3g':
      return 60;
    case '4g':
    default:
      return 80;
  }
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  return widths
    .map((width) => {
      return `${src}?w=${width}&q=80 ${width}w`;
    })
    .join(', ');
}

/**
 * Responsive image sizes
 */
export function generateSizes(breakpoints: Record<string, number>): string {
  const entries = Object.entries(breakpoints).map(([query, vw]) => {
    return `${query} ${vw}vw`;
  });
  
  // Add default size
  entries.push('100vw');
  
  return entries.join(', ');
}

/**
 * Image preloading with priority queue
 */
export class ImagePreloader {
  private queue: Array<{ src: string; priority: number }> = [];
  private loading = new Set<string>();
  private loaded = new Set<string>();
  private maxConcurrent = 3;

  add(src: string, priority: number = 0) {
    if (this.loaded.has(src) || this.loading.has(src)) return;

    this.queue.push({ src, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  private async processQueue() {
    while (this.queue.length > 0 && this.loading.size < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;

      this.loading.add(item.src);

      try {
        await this.loadImage(item.src);
        this.loaded.add(item.src);
      } catch (error) {
        console.warn('[ImagePreloader] Failed to load:', item.src);
      } finally {
        this.loading.delete(item.src);
        this.processQueue();
      }
    }
  }

  private loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  clear() {
    this.queue = [];
    this.loading.clear();
  }

  isLoaded(src: string): boolean {
    return this.loaded.has(src);
  }
}

/**
 * Get blur data URL for placeholder
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  // Generate a simple blur placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="blur">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <rect width="${width}" height="${height}" fill="#e5e7eb" filter="url(#blur)" />
    </svg>
  `;

  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  
  // Server-side fallback
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Global preloader instance
export const globalImagePreloader = new ImagePreloader();
