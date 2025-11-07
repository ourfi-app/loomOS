'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LoomOSAppHeaderProps {
  appName?: string;
  title?: string;
  subtitle?: string;
  appIcon?: ReactNode;
  actions?: ReactNode;
  gradient?: string | boolean;
  coloredHeader?: boolean;
}

export function LoomOSAppHeader({ 
  appName, 
  title, 
  subtitle, 
  appIcon, 
  actions,
  gradient = true,
  coloredHeader = false
}: LoomOSAppHeaderProps) {
  const displayTitle = title || appName || 'APP';
  
  // Determine background classes
  const bgClasses = typeof gradient === 'string' 
    ? `bg-gradient-to-r ${gradient}`
    : gradient 
      ? 'bg-gradient-to-b from-gray-100 to-gray-200'
      : 'bg-gray-50';
  
  // Determine text color based on colored header
  const textColor = coloredHeader ? 'text-white' : 'text-gray-600';
  const subtitleColor = coloredHeader ? 'text-white/90' : 'text-gray-500';
  const iconColor = coloredHeader ? 'text-white' : 'text-gray-600';
  
  return (
    <div className={cn(
      'border-b px-5 py-4 flex items-center justify-between flex-shrink-0',
      bgClasses,
      coloredHeader ? 'border-white/20' : 'border-gray-400'
    )}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {appIcon && <div className={cn(iconColor, 'flex-shrink-0')}>{appIcon}</div>}
        <div className="min-w-0">
          <h1 className={cn(
            'text-4xl font-light tracking-wide truncate',
            textColor
          )}>
            {displayTitle.toUpperCase()}
          </h1>
          {subtitle && (
            <p className={cn('text-sm mt-0.5 truncate', subtitleColor)}>{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          {actions}
        </div>
      )}
    </div>
  );
}
