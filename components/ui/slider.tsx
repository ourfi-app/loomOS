'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, style, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    style={style}
    {...props}
  >
    <SliderPrimitive.Track 
      className="relative w-full grow overflow-hidden rounded-full"
      style={{
        height: 'var(--slider-track-height)',
        backgroundColor: 'var(--slider-track-bg)',
      }}
    >
      <SliderPrimitive.Range 
        className="absolute h-full"
        style={{
          backgroundColor: 'var(--slider-range-bg)',
        }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className="block rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      style={{
        width: 'var(--slider-thumb-size)',
        height: 'var(--slider-thumb-size)',
        borderColor: 'var(--slider-thumb-border)',
        backgroundColor: 'var(--slider-thumb-bg)',
      }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
