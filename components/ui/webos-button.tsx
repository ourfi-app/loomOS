
'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export type WebOSButtonVariant = 'light' | 'medium' | 'affirmative' | 'negative' | 'blue';

export interface WebOSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: WebOSButtonVariant;
  icon?: React.ReactNode;
}

export const WebOSButton = forwardRef<HTMLButtonElement, WebOSButtonProps>(
  ({ variant = 'light', icon, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'webos-button',
          variant && `webos-button-${variant}`,
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

WebOSButton.displayName = 'WebOSButton';
