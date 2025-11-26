/**
 * loomOS Textarea Component
 * 
 * Multi-line text input with Phase 1C design token integration.
 * 
 * @example
 * ```tsx
 * <Textarea placeholder="Enter your message..." />
 * ```
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl px-4 py-3 text-sm font-light placeholder:font-light resize-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        style={{
          backgroundColor: 'var(--semantic-input-bg)',
          border: '1px solid var(--semantic-input-border)',
          color: 'var(--semantic-input-text)',
          borderRadius: 'var(--radius-xl)',
          ...style,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
