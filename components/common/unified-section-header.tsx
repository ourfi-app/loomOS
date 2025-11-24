/**
 * Unified Section Header Component
 * 
 * Consolidates:
 * - components/common/section-header.tsx
 * - components/webos/shared/section-header.tsx
 * - components/webos/loomos-section-header.tsx
 * 
 * This component provides all section header variants with a unified API.
 */

'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedSectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  variant?: 'default' | 'webos' | 'loomos';
  divider?: boolean;
}

export function UnifiedSectionHeader({
  icon: Icon,
  title,
  description,
  subtitle,
  action,
  className,
  variant = 'default',
  divider = false,
}: UnifiedSectionHeaderProps) {
  // LoomOS variant - gradient background
  if (variant === 'loomos') {
    return (
      <div className={cn(
        "bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 text-[11px] font-bold tracking-wider",
        className
      )}>
        {title.toUpperCase()}
      </div>
    );
  }

  // WebOS variant - minimal, uppercase
  if (variant === 'webos') {
    return (
      <div
        className={cn(
          'flex items-center justify-between',
          divider && 'border-b pb-3',
          className
        )}
        style={{
          borderColor: divider ? 'var(--border-light)' : undefined,
        }}
      >
        <div className="flex flex-col gap-1">
          <h3
            className="text-xs font-light tracking-wider uppercase"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-sm font-light normal-case"
              style={{ color: 'var(--text-secondary)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    );
  }

  // Default variant - with icon support
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

// Aliases for backward compatibility
export const SectionHeader = UnifiedSectionHeader;
export const WebOSSectionHeader = (props: Omit<UnifiedSectionHeaderProps, 'variant'>) => (
  <UnifiedSectionHeader {...props} variant="webos" />
);
export const LoomOSSectionHeader = (props: { title: string; className?: string }) => (
  <UnifiedSectionHeader {...props} variant="loomos" />
);
