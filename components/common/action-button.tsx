
'use client';

import { LucideIcon } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-state';

interface ActionButtonProps extends ButtonProps {
  icon?: LucideIcon;
  label: string;
  isLoading?: boolean;
  loadingText?: string;
}

export function ActionButton({
  icon: Icon,
  label,
  isLoading = false,
  loadingText,
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      className={cn("gap-2", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingText || label}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {label}
        </>
      )}
    </Button>
  );
}
