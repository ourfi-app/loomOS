
'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export type LoomOSButtonVariant = 'light' | 'medium' | 'affirmative' | 'negative' | 'orange';

export interface LoomOSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LoomOSButtonVariant;
  icon?: React.ReactNode;
}

export const LoomOSButton = forwardRef<HTMLButtonElement, LoomOSButtonProps>(
  ({ variant = 'light', icon, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'loomos-button',
          variant && `loomos-button-${variant}`,
          className
        )}
        {...props}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </button>
    );
  }
);

LoomOSButton.displayName = 'LoomOSButton';
