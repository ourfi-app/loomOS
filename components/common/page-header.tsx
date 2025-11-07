
'use client';

import { ReactNode } from 'react';
import { LucideIcon, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: ReactNode;
  onBack?: () => void;
  tabs?: ReactNode;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  actions,
  onBack,
  tabs,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("border-b bg-background sticky top-0 z-10", className)}>
      <div className="px-6 py-4">
        <div className="flex items-start gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="flex-shrink-0 mt-1"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {Icon && (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
      
      {tabs && (
        <div className="px-6 -mb-px">
          {tabs}
        </div>
      )}
    </div>
  );
}
