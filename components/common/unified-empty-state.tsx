/**
 * Unified Empty State Component
 * 
 * Consolidates:
 * - components/common/empty-state.tsx
 * - components/webos/loomos-empty-state.tsx
 * 
 * This component provides all empty state variants with a unified API.
 */

'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UnifiedEmptyStateProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  } | ReactNode;
  illustration?: ReactNode;
  className?: string;
  variant?: 'default' | 'loomos';
}

export function UnifiedEmptyState({
  icon,
  title,
  description,
  action,
  illustration,
  className,
  variant = 'default',
}: UnifiedEmptyStateProps) {
  // LoomOS variant
  if (variant === 'loomos') {
    return (
      <div className={cn('loomos-empty-state', className)}>
        <div className="loomos-empty-state-icon">{icon}</div>
        <div className="loomos-empty-state-title">{title}</div>
        {description && (
          <div className="loomos-empty-state-description">{description}</div>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    );
  }

  // Default variant
  const IconComponent = icon as LucideIcon;
  const isReactNode = icon && typeof icon !== 'function';

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className
    )}>
      {illustration || (icon && (
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          {isReactNode ? (
            icon
          ) : IconComponent ? (
            <IconComponent className="w-8 h-8 text-muted-foreground" />
          ) : null}
        </div>
      ))}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      
      {action && (
        typeof action === 'object' && 'label' in action ? (
          <Button onClick={action.onClick} size="sm">
            {action.label}
          </Button>
        ) : (
          action
        )
      )}
    </div>
  );
}

// Aliases for backward compatibility
export const EmptyState = UnifiedEmptyState;
export const LoomOSEmptyState = (props: Omit<UnifiedEmptyStateProps, 'variant'>) => (
  <UnifiedEmptyState {...props} variant="loomos" />
);
